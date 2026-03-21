+++
title = 'Cisco 3750G in the Homelab: A Rugged Path to IOS 15.0'
date = 2026-03-21T14:00:00+01:00
draft = false
tags = ["Cisco", "Switch", "Networking", "Homelab", "IOS"]
categories = ["IT"]
+++

Used enterprise hardware is a staple for any homelab. Recently, I came across a **Cisco WS-C3750G-24TS-S1U**. A solid 24-port Gigabit switch with SFP uplinks and – quite excitingly – Layer 3 capabilities. However, getting it up and running presented some typical Cisco hurdles, especially concerning firmware updates and storage space.

## Initial State: IPBASE and Missing Cryptography

After the first boot via console cable, `show version` revealed:
`Cisco IOS Software, C3750 Software (C3750-IPBASE-M), Version 12.2(44)SE6`

The acronym **IPBASE** is the core problem here. It's Cisco's entry-level feature set. Worse yet, without "K9" in the name, all cryptographic functions are missing. This means no SSH for the console and no HTTPS for the web interface. In a modern network, this is an absolute no-go. An attempt to activate HTTPS was promptly met with an error:

```bash
3750g(config)#ip http secure-server
                        ^
% Invalid input detected at '^' marker.
```

## The Update Marathon

My goal was version **15.0(2)SE10**, the last available version for this hardware series. Since jumping directly from 12.2 IPBASE to 15.0 is often problematic and I needed the K9 features, I took an intermediate step.

### Step 1: Laying the Foundation with 12.2(55) IPSERVICESK9

First, I installed an image from the 12.2 branch with the **IPSERVICESK9** feature set. This set unlocks Layer 3 features (routing) and, crucially, SSH/HTTPS. Since the image was available as a `.bin` file, a simple `copy` from my local HTTP server was sufficient:

```bash
3750g#copy http://192.168.254.11:8080/c3750-ipservicesk9-mz.122-55.SE12.bin flash:
```

### Step 2: The Battle for Every Megabyte (Flash Limit)

The Cisco 3750G (non-E/X models) has a hard limit of **32 MB flash memory**. This is extremely tight for modern IOS images. The `.tar` file for IOS 15.0, which contains both the image and the HTTP files for the web interface, almost exceeds this limit if another image is still on the flash.

Before I could risk the final update, I had to delete the just-installed 12.2 image to make room:

```bash
3750g#dir flash:
# ... shows approx. 21 MB free, not enough for the 15.0 TAR (approx. 22 MB) ...

3750g#delete flash:/c3750-ipservicesk9-mz.122-55.SE12.bin
```

### Step 3: Jumping to IOS 15.0 with `archive`

With the flash cleared, I could now use the `archive` command. This is preferable to a simple `copy` because it extracts the `.tar` file, installs all support files, and correctly sets the boot variable (`boot system`):

```bash
3750g#archive download-sw /overwrite /reload http://192.168.254.11:8080/c3750-ipservicesk9-tar.150-2.SE10.tar
```

After an automatic reload, the switch greeted me with the new system:
`Cisco IOS Software, C3750 Software (C3750-IPSERVICESK9-M), Version 15.0(2)SE10`

## Cleanup: Corporate VLANs and Legacy Baggage

The switch came from a large corporate environment. A `show vlan brief` displayed a long list of VLANs (e.g., `VLAN_10_PROD`, `OFFICE_NETWORK`, etc.). Since this information is stored in the `vlan.dat` file in flash, it survives a standard `erase startup-config`.

To truly start from scratch, I manually deleted the VLAN database:

```bash
3750g#delete flash:vlan.dat
3750g#reload
```

## Management Configuration for the Homelab

Once the switch was "clean" and up to date, the standard settings followed:

1.  **Management IP:** Assigned an IP in Vlan1 for access.
2.  **SNMP:** Configured for monitoring (e.g., with LibreNMS). Important: Only allow access via an ACL!
    ```bash
    3750g(config)#access-list 10 permit 192.168.254.0 0.0.0.255
    3750g(config)#snmp-server community secret RW 10
    ```
3.  **EnergyWise:** Since the switch draws about 94 watts at idle, I configured EnergyWise to put unused ports into a lower power level.

## Pro-Tips for the Homelab

When setting up a Cisco switch for your own lab, there are three often-overlooked points that can decide between frustration and success (and security).

### 1. Enabling 3rd-Party SFPs

Cisco is known for accepting only its own SFP modules. If you insert a cheap third-party module (e.g., from FS.com), the port is often shut down with an error message ("err-disable"). With two magic commands, this restriction can be lifted:

```bash
3750g(config)#service unsupported-transceiver
3750g(config)#no errdisable detect cause gbic-invalid
```
*Note: Cisco will issue a warning that no support is provided for non-Cisco hardware – in a homelab, however, this is usually of secondary importance.*

### 2. Closing a Security Gap: Disabling Smart Install

Older IOS versions often have the "Smart Install" feature enabled. This has been noted over the years for critical security vulnerabilities (e.g., CVE-2018-0171) through which attackers can gain full control of the switch. Since this feature is not needed in a homelab anyway, it should absolutely be disabled:

```bash
3750g(config)#no vstack
```

### 3. Enabling IPv6 Support (SDM Templates)

An often-overlooked aspect of older Catalyst models is **SDM (Switch Database Management)**. Since hardware memory (TCAM) is limited, you must tell the switch what to prioritize it for. By default, the 3750G often doesn't support IPv6.

To make the switch future-proof, you need to change the SDM template:

```bash
3750g(config)#sdm prefer dual-ipv4-and-ipv6 default
```
**Important:** This change only takes effect after a restart (`reload`)! After the reboot, you can verify the success with `show sdm prefer` and by enabling IPv6 on an interface:

```bash
3750g#show sdm prefer
 The current template is "desktop IPv4 and IPv6 default" template.

3750g(config)#interface vlan 1
3750g(config-if)#ipv6 enable

3750g#show ipv6 interface brief
Vlan1                      [up/up]
    FE80::213:7FFF:FE59:E240  <-- Link-local address is present!
```

### 4. Speeding Up the Boot Process (Stack Priority)

Since the 3750G is a stackable switch, it waits for a certain amount of time during boot for the "Stack Master Election" (`Waiting for Stack Master Election...`). Since usually only one switch is running in a homelab, you can speed up this process by setting the priority to the maximum value:

```bash
3750g(config)#switch 1 priority 15
Changing the Switch Priority of Switch Number 1 to 15
Do you want to continue?[confirm]
New Priority has been set successfully
```

### 5. SSH and the Key Issue

For SSH to work, the switch needs an RSA key. Usually, you generate this manually with `crypto key generate rsa`. In my configuration, however, a self-signed trustpoint was already present:

```text
crypto pki trustpoint TP-self-signed-<ID>
 enrollment selfsigned
 rsakeypair TP-self-signed-<ID>
```

If SSH does not start directly for you, even though `transport input ssh` is set, this command usually helps (after a hostname and a domain name have been set):

```bash
3750g(config)#crypto key generate rsa
```
A key length of at least **2048 bits** is recommended here to satisfy modern SSH clients (like current OpenSSH versions).

### 6. Solving SSH Connection Issues (Legacy Cryptography)

Anyone trying to connect to the switch via SSH from a modern Linux or macOS system will often be greeted with error messages like `no matching key exchange method found` or `no matching host key type found`. This is because the IOS 15.0 SSH stack uses methods that are considered outdated (insecure) today and are disabled by default by modern clients.

To get in anyway, you must explicitly allow the SSH client to use these old methods:

```bash
ssh -oKexAlgorithms=+diffie-hellman-group14-sha1 \
    -oHostKeyAlgorithms=+ssh-rsa \
    -oCiphers=+aes256-cbc \
    root@192.168.254.1
```

Alternatively, you can create an entry in your local `~/.ssh/config` for the switch so you don't have to type these parameters every time:

```text
Host 192.168.254.1
    KexAlgorithms +diffie-hellman-group14-sha1
    HostkeyAlgorithms +ssh-rsa
    Ciphers +aes256-cbc
```

### 7. The "Antenna Analyzer" for Network Cables (TDR)

As a ham radio operator (DO3EET), I love measurement tools. Did you know that the 3750G has a built-in TDR (Time Domain Reflectometry) meter? It can send electrical pulses through the cable to measure its length or find cable breaks with centimeter precision – even while the computer is still connected!

Here are two examples from my test run:

**Example 1: A working 1m patch cable (Port 1)**
```bash
3750g#show cable-diagnostics tdr interface gigabitEthernet 1/0/1
Interface Speed Local pair Pair length        Remote pair Pair status
--------- ----- ---------- ------------------ ----------- --------------------
Gi1/0/1   1000M Pair A     0    +/- 4  meters Pair A      Normal              
                Pair B     0    +/- 4  meters Pair B      Normal              
                Pair C     0    +/- 4  meters Pair C      Normal              
                Pair D     1    +/- 4  meters Pair D      Normal              
```

**Example 2: An open, approx. 24m long installation cable (Port 3)**
```bash
3750g#show cable-diagnostics tdr interface gigabitEthernet 1/0/3
Interface Speed Local pair Pair length        Remote pair Pair status
--------- ----- ---------- ------------------ ----------- --------------------
Gi1/0/3   auto  Pair A     23   +/- 4  meters N/A         Open                
                Pair B     24   +/- 4  meters N/A         Open                
                Pair C     24   +/- 4  meters N/A         Open                
                Pair D     24   +/- 4  meters N/A         Open                
```

**Interpreting the results:**
*   **Pair status "Normal":** Everything is fine. The cable is connected to an active device.
*   **Pair status "Open":** The cable has no termination at the end (unplugged).
*   **Pair length:** The "1" in the first example indicates a very short cable (~1m). Since the hardware has a measurement tolerance of `+/- 4 meters`, values close to zero are often displayed as 0 or 1. In the second example, we see an approx. 24-meter cable that ends "open" somewhere in the house.
*   **Remote pair:** In a working connection (Normal), the switch indicates whether the wire pairs arrive correctly on the opposite side. `Pair A -> Pair A` means: No twists in the cable!

The result confirms: My clean-lab is fully under control measurement-wise!

## Nerd Overkill: The Antenna Calculator on the Switch (TCL)

As a ham radio operator, I’m always looking for ways to combine my hobbies. Since modern Go binaries don't run on classic IOS, I used an old "backdoor": **TCL (Tool Command Language)**.

I ported my Python calculator for the **Comet HFJ-350M antenna** to TCL and uploaded it to the switch's flash. Now I can calculate my antenna settings directly on the switch console – perfect when I'm working on the rack!

```bash
3750g#tclsh flash:hfj350.tcl
=== Comet HFJ-350M Calculator (Cisco Edition) ===
Band (e.g. 40m) or Freq (MHz): 7.1

--- Configuration for 40m ---
Coil:   Base (No additional coil)
Jumper: None
Std Len (7.0 MHz): 960 mm
Calc Len (7.1 MHz): 920 mm
```
IT infrastructure meets ham radio – it doesn't get more "homelab" than this! Maybe this is even the foundation for a HAM-Net on the 10m band? 📡🌐🛰️

For those who want to rebuild it, here is the full TCL code:

```tcl
# Comet HFJ-350M Antenna Calculator for Cisco IOS
# Author: DO3EET

set antenna_data {
    {band "160m" low 1.8 high 2.0 std 1.8 coil "Base + 3.5 coil + 1.8 coil" jumper "None" len 1170 change 7}
    {band "80m"  low 3.5 high 3.8 std 3.5 coil "Base + 3.5 coil" jumper "None" len 910 change 20}
    {band "40m"  low 7.0 high 7.2 std 7.0 coil "Base (No additional coil)" jumper "None" len 960 change 25}
    {band "30m"  low 10.1 high 10.15 std 10.1 coil "Base" jumper "Terminal 1" len 990 change 40}
    {band "20m"  low 14.0 high 14.35 std 14.0 coil "Base" jumper "Terminal 2" len 800 change 60}
    {band "17m"  low 18.068 high 18.168 std 18.0 coil "Base" jumper "Terminal 3 (or 2)" len 1070 change 50}
    {band "15m"  low 21.0 high 21.45 std 21.0 coil "Base" jumper "Terminal 3" len 750 change 80}
    {band "12m"  low 24.89 high 24.99 std 24.9 coil "Base" jumper "Terminal 3" len 530 change 100}
    {band "10m"  low 28.0 high 29.7 std 28.5 coil "Base" jumper "Terminal 4" len 1000 change 120}
    {band "6m"   low 50.0 high 52.0 std 51.0 coil "Base" jumper "Terminal 5" len 950 change 100}
}

puts "=== Comet HFJ-350M Calculator (Cisco Edition) ==="
puts "Type 'exit' to quit."

while {1} {
    puts -nonewline "Band (e.g. 40m) or Freq (MHz): "
    flush stdout
    set input [string trim [gets stdin]]
    if {$input == "exit" || $input == "q"} break
    if {$input == ""} continue
    
    set found 0
    foreach item $antenna_data {
        array set d $item
        set clean_band [string map {m ""} $d(band)]
        set is_freq [string is double -strict $input]
        
        if {$input == $d(band) || $input == $clean_band || ($is_freq && $input >= $d(low) && $input <= $d(high))} {
            puts "\n--- Configuration for $d(band) ---"
            puts "Coil:   $d(coil)"
            puts "Jumper: $d(jumper)"
            puts "Std Len ($d(std) MHz): $d(len) mm"
            
            if {$is_freq && $input != $d(std)} {
                set diff_khz [expr {($input - $d(std)) * 1000.0}]
                set calc_len [expr {round($d(len) - (($diff_khz / $d(change)) * 10.0))}]
                puts "Calc Len ($input MHz): $calc_len mm"
            }
            puts ""
            set found 1
            break
        }
    }
    if {!$found} { puts "No data found for '$input'\n" }
}
```

## The Final Touch: A Login Banner

To round off the setup and give the switch a personal touch, I configured a login banner (Message of the Day). This not only looks professional but is often legally required in corporate environments.

```bash
3750g(config)#banner motd #
**************************************************************************
*                                                                        *
*   DO3EET Clean-Lab | Cisco 3750G                                       *
*                                                                        *
*   Authorized Access Only!                                              *
*                                                                        *
**************************************************************************
#
```

## Hardware Check: Is the Device Healthy?

After all the software work, I wanted to know about the physical health of the used switch. A look at `show tech-support` (or specific `show` commands) provided reassuring values:

*   **Temperature:** At **34°C** (`System Temperature State: GREEN`), the device stays pleasantly cool at idle.
*   **Fans:** A brief `FAN is OK` in the log confirms that the cooling is working properly – often a critical point with used enterprise gear (think bearing damage).
*   **The Heart:** Inside, a **PowerPC 405** processor is at work. Almost ancient by today's standards, but still perfectly adequate for Layer 3 switching in hardware.
*   **Self-Test:** All `POST` (Power-On Self-Test) routines, including the PortASIC memory, reported a clean `Passed`.

The Final running-config

Here is an excerpt of the current configuration (passwords and secrets have been masked). It shows all the discussed settings working together:

```text
Current configuration : 6798 bytes
!
version 15.0
no service pad
service timestamps debug datetime msec
service timestamps log datetime msec
no service password-encryption
service unsupported-transceiver
!
hostname 3750g
!
enable secret 5 <ENCRYPTED>
enable password <PASSWORD>
!
username root privilege 15 secret 5 <ENCRYPTED>
vtp domain clean-lab
vtp mode transparent
sdm prefer dual-ipv4-and-ipv6 default
ip domain-name do3eet-clab.internal
!
ip dhcp excluded-address 192.168.254.1 192.168.254.10
!
ip dhcp pool MGMT_POOL
 network 192.168.254.0 255.255.255.0
 default-router 192.168.254.1 
 dns-server 8.8.8.8 1.1.1.1 
!
energywise domain MyLab security shared-secret 0 <PASSWORD>
!
crypto pki trustpoint TP-self-signed-<ID>
 enrollment selfsigned
 subject-name cn=IOS-Self-Signed-Certificate-<ID>
 rsakeypair TP-self-signed-<ID>
!
crypto pki certificate chain TP-self-signed-<ID>
 certificate self-signed 01
  <CERTIFICATE_DATA_MASKED>
quit
!
no errdisable detect cause gbic-invalid
spanning-tree mode pvst
spanning-tree extend system-id
!
interface GigabitEthernet1/0/1
 description MANAGEMENT_PORT
 switchport mode access
 spanning-tree portfast
!
interface GigabitEthernet1/0/2
 description DISABLED_FOR_SECURITY
 shutdown
 energywise level 0
!
! ... Interfaces 3 to 27 configured similarly ...
!
interface GigabitEthernet1/0/28
 description DISABLED_FOR_SECURITY
 shutdown
 energywise level 0
!
interface Vlan1
 ip address 192.168.254.1 255.255.255.0
 no ip route-cache
 ipv6 enable
!
ip http server
ip http authentication local
ip http secure-server
!
access-list 10 permit 192.168.254.0 0.0.0.255
!
snmp-server community <SECRET>
snmp-server location 3750g
snmp-server contact DO3EET
!
no vstack
banner motd ^C
**************************************************************************
*                                                                        *
*   DO3EET Clean-Lab | Cisco 3750G                                       *
*                                                                        *
*   Authorized Access Only!                                              *
*                                                                        *
**************************************************************************
^C
!
line con 0
line vty 0 15
 login local
 transport input ssh
!
end
```

## Conclusion

Despite its age, the Cisco 3750G is an excellent device for a homelab if you want to get Layer 3 features on the cheap. However, you must plan the firmware path carefully, as the limited flash memory is very unforgiving. With SSH and IOS 15, the device is now ready for modern network tasks.

