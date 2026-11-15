+++
title = 'RISC-V Learning to Run'
date = 2025-03-17T23:48:01+01:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Open Source",
    "Hardware",
]
+++

I'm genuinely excited to take you along on a fun ride today. I recently picked up the brand-new Milk-V Jupiter board and can't wait to share the first steps of getting it up and running. In this post, I'll walk you through the whole process from prepping the hardware to actually booting up the board—basically writing it down as I live through it. Hopefully my notes save you some headaches, and serve as a good reminder for future-me if I ever have to go through this again.

# Prepping the SSD

As some of you may know, I have a Kwumsy K3 keyboard with a built-in SSD slot. Up until now I've been using it to stash Linux ISO files for quick installs. Today, that SSD gets a brand-new job. First things first, though: wipe all existing data off that NVMe SSD via the keyboard's USB-C interface using `gparted`.

Next, I installed the SSD into the motherboard's M.2 slot—and immediately hit snag number one: the screw wouldn't thread into the standoff nut... After running the screw through from the back side of the board once to clear the threads, the issue resolved itself in seconds.

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/RISC-V-Learning-to-run/PXL_20250313_173415561.jpg" alt="Milk-V Jupiter with SSD and fan" width="1024" height="1024" >}}

# Preparing for First Boot

For the initial boot, I wanted to run Fedora 41 off an SD card, since the docs make it sound like one of the smoother paths. I grabbed the image from [Fedoravforce](https://images.fedoravforce.org/Jupiter). The default `root` password is `riscv`.  
To flash the image onto the SD card, I used [BalenaEtcher](https://github.com/balena-io/etcher), which keeps things dead simple. Once flashed, the SD card moved from my laptop into the new board.

# First Boot

Since I didn't have a case or ATX power supply on hand yet for the first test, I powered it with a USB-C laptop charger. Monitor hooked up over HDMI, keyboard and mouse plugged into the USB 2 ports, SSD still completely blank. Unlike a "normal" PC, the board boots automatically the instant you apply power.

Unfortunately, my first attempt with a 512 GB card failed. Second attempt with Fedora failed too:
```
try sd...
bm:3
sys: 0x200
```

# Trying Ubuntu

Onward to Ubuntu images then... [GitHub](https://github.com/milkv-jupiter/jupiter-ubuntu-build/issues). Again flashed with [BalenaEtcher](https://github.com/balena-io/etcher).

Same loop, same cryptic error:
```
try sd...
bm:3
sys: 0x200
```

# Suspecting USB-C PD

At this point I started suspecting USB-C Power Delivery was the culprit.

Testing with a proper ATX power supply a day later confirmed my hunch: with the ATX PSU connected, the board booted right up.

# First Bug Spotted

I also seemed to have a Wi-Fi hardware defect—the exact same issue YouTuber geerlingguy reported on his GitHub, where the wireless chip just isn't detected by the OS at all.
On Friday (March 14), I fired off an email to support about it as well.

# The Next Day

The Wi-Fi mystery turned out to be a problem for later—and apparently not a hardware defect after all.
Switching to the Irradium Linux distribution got the entire system running cleanly. You can grab the image over at [dl.irradium.org/irradium/images/](https://dl.irradium.org/irradium/images/milk_v_jupiter/).

So now I have the OS running off the SD card, and I plan to use the NVMe SSD as my data drive.

# Updating Irradium

From what I've learned, updates run via these two commands—though since this distro is brand new to me, I'm still learning the ropes.

```shell
ports -u
prt-get sysup
```

# After Waiting Overnight for Updates

For my project, I still needed Java and Apache Ant on the machine.
First I enabled all `prtdir` entries in `/etc/prt-get.conf`, followed by another round of `ports -u`.

I installed my desired packages with `PIP_ROOT_USER_ACTION=ignore prt-get depinst ntp git btrfs-progs htop screen openjdk21-jdk`. And then it was time for another long wait.

After that, I had to build Ant from source:  
Starting with a fresh SSH login to reload the environment...
```shell
export ANT_HOME=/usr/local/ant
export PATH=${PATH}:${ANT_HOME}/bin
mkdir /usr/local/ant
mkdir antsrc
curl "https://dlcdn.apache.org//ant/source/apache-ant-1.10.15-src.tar.xz" --output apache-ant-1.10.15-src.tar.xz
unxz apache-ant-1.10.15-src.tar.xz
cd antsrc/
tar xvf ../apache-ant-1.10.15-src.tar
sh build.sh -Ddist.dir=/usr/local/ant dist
ant -diagnostics
```

# Building and Running YaCy

With everything prepped for the YaCy search server, it was time to roll.
The data is going onto the NVMe SSD formatted with BTRFS, so I ran `mkfs.btrfs -f /dev/nvme0n1` to wipe the sole NVMe drive with BTRFS, then mounted it into the filesystem:

```shell
mkdir /yacyDisk
mount /dev/nvme0n1 /yacyDisk/
```

Next came cloning, building, and starting YaCy—which was refreshingly painless thanks to Java:
```shell
git clone --depth 1 https://github.com/yacy/yacy_search_server.git
cd yacy_search_server
ant clean all
./startYACY.sh
```

# That Wi-Fi Hardware...

During all this tinkering I'd been pretty alarmed that Wi-Fi didn't show up under Fedora, Ubuntu, or Bianbu. My first instinct was faulty hardware—yet under Irradium, Wi-Fi works just fine. Makes me wonder if [geerlingguy](https://www.youtube.com/watch?v=YxtFctEsHy0) ran into the exact same software quirk and didn't actually need a replacement board...

Which leaves just one thing left on the checklist: shut the system down and pop in the RTC battery.  
{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/RISC-V-Learning-to-run/HTOP.png" alt="htop on the Milk-V Jupiter" width="1024" height="1024" >}}
