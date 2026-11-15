+++
title = 'Attic Find: An Ancient Webcam'
date = 2024-06-15T19:36:38+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Hardware",
    "Vintage",
    "Hobby",
]
+++

# Accessing the Camera
Back during my first apprenticeship, I bought a HooToo HT-IP206 to experiment a bit with live streaming. I just rediscovered it gathering dust up in the attic. Even though the camera is practically a fossil by now, I set out to bring it back to life.

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/oldWebcam01/PXL_20240615_173019869.jpg" alt="HooToo HT-IP206" width="1024" height="1024" >}}

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/oldWebcam01/PXL_20240615_173051193~2.jpg" alt="HooToo HT-IP206" width="1024" height="1024" >}}


Step one was getting the camera onto the network, so I started with a hardware reset using a paperclip. Then I plugged the webcam into an isolated lab VLAN with no internet access. On the network, it immediately announced itself as `ipcam_E8ABFA190420`.

Finding the web interface didn't take long, though my browser was too modern for it (at least Firefox was—later I noticed Chrome worked fine). I spun up a ReactOS VirtualBox VM so I could access the camera with an ancient version of Firefox and VLC. Login uses the username `admin` and a blank password over HTTP Basic Auth.

Since I initially struggled to log into the webcam and now knew it used Basic Auth, I tried accessing it straight from my Arch Linux machine via `http://admin@192.168.1.2:80/`—and sure enough, modern Firefox can operate the webcam just fine too.

# Firmware Update
The web interface had an option to update the firmware; the only catch was actually finding the files. The old version running on the camera was `17.37.2.41` for the system and `20.8.1.132` for the WebUI. Thanks to [Robin's blog](https://blog.moneybag.de/hootoo-wlan-pan-tilt-ip-webcam-ein-erfahrungsbericht/comment-page-6/), I tracked down the original OEM, Apexis. Neither HooToo nor Apexis hosts firmware for this camera on their current websites anymore. So I turned to `web.archive.org` to pin down the exact product model. Comparing product photos pointed me to the name `APM-J011`, though I still couldn't find firmware under that name. On the [archived website](https://web.archive.org/web/20150106171303/http://www.apexis.com.cn:80/en/download-1.html), however, I spotted a firmware package with a suspiciously similar version number. So I downloaded the RAR archive labeled `"Firmware of j802.j803.j603.j805_17_37_2_49"` and flashed it using the tried-and-true YOLO method. The device accepted the file and rebooted onto the new version after about two minutes.

On this hardware, the firmware and web interface are separate packages, so I also grabbed `"Upgrade package of web UI (MJ745)"`. Again, I was mostly guessing based on the "J" in the name. Inside the RAR archive, under `/MJ745_WEBUI通用升级包_20131104/j011-1/`, I found a WebUI build that matched the unit. I took a wild guess based on the folder name—and actually nailed it. With that, the camera is now running the manufacturer's latest and greatest.

# Digging Into the Firmware
I couldn't make total sense of the `.bin` file, though I did spot `Linux version 2.4.20-uc0 (root@maverick-linux) (gcc version 3.0) #1924` listed for the Linux kernel. It also appears to be compiled for `armv3`. There's a `romfs` image tucked inside the file as well, though sadly I wasn't able to extract it.

# Update: June 17, 2024
I snapped a few more photos of the camera's insides.

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/oldWebcam01/IMG_9901.png" alt="HooToo HT-IP206 opened up" width="1024" height="1024" >}}
{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/oldWebcam01/IMG_9902.png" alt="HooToo HT-IP206 opened up" width="1024" height="1024" >}}
{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/oldWebcam01/IMG_9903.png" alt="HooToo HT-IP206 opened up" width="1024" height="1024" >}}
{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/oldWebcam01/IMG_9904.png" alt="HooToo HT-IP206 opened up" width="1024" height="1024" >}}
{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/oldWebcam01/IMG_9905.png" alt="HooToo HT-IP206 opened up" width="1024" height="1024" >}}
{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/oldWebcam01/IMG_9907.png" alt="HooToo HT-IP206 opened up" width="1024" height="1024" >}}
