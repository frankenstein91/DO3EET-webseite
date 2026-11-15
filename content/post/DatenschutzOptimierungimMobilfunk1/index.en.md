+++
title = 'Optimizing Mobile Privacy'
date = 2024-05-21T22:25:00+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Privacy",
    "Tracking",
    "Mobile Networks",
]
+++

Many readers of this blog care about privacy and data minimization just like I do, yet still depend on mobile networks for banking and other digital services. In Germany and across the EU, the established opt-in rules usually give us a sense of security. Recently, however, I noticed that Germany's leading mobile carriers have partnered up with [Utiq](https://utiq.com/).
<!--more-->

# What Is Utiq?
According to its own description, Utiq is a "privacy-friendly" advertising identifier built on a collaboration between telecommunications providers. The company's goal is to enable personalized advertising and recommendations based on pseudonymized profiles.

# The Problems I See with Utiq
Once you grant consent on one participating website, data collection becomes possible across *all* participating websites by sending a pseudonymous signal to recognize you. Even though the provider offers a way to block accidental activation, you have to renew this opt-out every single year. On top of that, anyone connecting to the internet via your phone's hotspot is empowered to lift that block.

# How to Set Up a Utiq Block
Through its [consenthub](https://consenthub.utiq.com/) platform, the provider lets you disable activation of the service. Because authentication on this portal relies on data from your mobile carrier, you need to be connected over cellular data—meaning you must disconnect your phone from your home Wi-Fi and turn off any VPNs. Once that's done, you can manage any existing consents on the site and set up a block for one year.

For anyone not reading this on a smartphone right now, here's the link as a QR code:

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/DatenschutzOptimierungimMobilfunk1/qrcode.png" alt="QR Code for https://consenthub.utiq.com/" width="300" height="300" >}}

And you might as well put a reminder in your calendar for next year right away... [Calendar file](UtiqSperreErneuern.ics)

# What's the Goal of This Post?
With this post, I want to encourage as many people as possible to set up that block and take a stand against data-harvesting services. Every piece of collected information carries potential for abuse—something many users don't realize. I hope to open a few eyes here.
