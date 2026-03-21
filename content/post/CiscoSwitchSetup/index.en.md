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

## Conclusion

Despite its age, the Cisco 3750G is an excellent device for a homelab if you want to get Layer 3 features on the cheap. However, you must plan the firmware path carefully, as the limited flash memory is very unforgiving. With SSH and IOS 15, the device is now ready for modern network tasks.
