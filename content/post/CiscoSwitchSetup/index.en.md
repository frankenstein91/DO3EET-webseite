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

## The Final running-config

Here is an excerpt of the current configuration (passwords and secrets have been masked). It shows all the discussed settings working together:

```text
Current configuration : 5956 bytes
!
version 15.0
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
energywise domain MyLab security shared-secret 0 <PASSWORD>
!
crypto pki trustpoint TP-self-signed-<ID>
 enrollment selfsigned
 subject-name cn=IOS-Self-Signed-Certificate-<ID>
 revocation-check none
 rsakeypair TP-self-signed-<ID>
!
!
crypto pki certificate chain TP-self-signed-<ID>
 certificate self-signed 01
  <CERTIFICATE_DATA_MASKED>
quit
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
line con 0
line vty 0 15
 login local
 transport input ssh
!
end
```

## Conclusion

Despite its age, the Cisco 3750G is an excellent device for a homelab if you want to get Layer 3 features on the cheap. However, you must plan the firmware path carefully, as the limited flash memory is very unforgiving. With SSH and IOS 15, the device is now ready for modern network tasks.

