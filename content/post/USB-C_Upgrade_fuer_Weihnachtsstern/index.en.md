+++
title = 'USB-C Upgrade for a Christmas Tree Star'
date = 2024-12-24T09:49:11+01:00
draft = false
author = "Frank Tornack"
tags = [
    "Hardware",
    "Soldering",
    "Vintage",
    "Christmas",
    "Russia",
    "Hobby",
]
+++

My household still has plenty of Christmas decorations from Russia. While their plugs look somewhat similar to Europlugs, the power brick for our Christmas tree star just doesn't fit into modern sockets properly. In the past, the family got by using a travel adapter. Now I've finally put an end to that and opted for modern tech instead.

# Old Version
Back in the day, the tree topper ran off an old power converter. It plugged straight into a wall socket like a standard wall wart and powered the five incandescent bulbs inside the star.

```goat
                                     ┌───────────┐
                                     │           │
                      ┌──────────────┤ Lightbulb │
                      │              │           │
                      │              └─────┬─────┘
                      │                    │      
                      │              ┌─────┴─────┐
                      │              │           │
                      │              │ Lightbulb │
                      │              │           │
                      │              └─────┬─────┘
┌───────────┐     ┌───┴───┐                │      
│           ├─────┤       │          ┌─────┴─────┐
│  Socket   │     │  PSU  │          │           │
│           ├─────┤       │          │ Lightbulb │
└───────────┘     └───┬───┘          │           │
                      │              └─────┬─────┘
                      │                    │      
                      │              ┌─────┴─────┐
                      │              │           │
                      │              │ Lightbulb │
                      │              │           │
                      │              └─────┬─────┘
                      │                    │      
                      │              ┌─────┴─────┐
                      │              │           │
                      └──────────────┤ Lightbulb │
                                     │           │
                                     └───────────┘
```

# Upgrade
I can only speculate about the exact specs of the old power supply, especially since it was only labeled with its price in rubles, input voltage, and frequency—nothing else. Still, I'm pretty confident modern USB-C power supplies are way more efficient... technology marches on. So I decided to snip the cable off the old brick and strip back a few millimeters of insulation. I also grabbed a tiny board capable of negotiating USB Power Delivery and soldered that PCB onto the leads. Since the star uses incandescent bulbs rather than LEDs, I didn't even have to care about polarity. Because the wires inside the cable were paper-thin, I borrowed a classic trick from Chinese manufacturers... drowning the contacts in hot glue.

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/USB-C_Upgrade_fuer_Weihnachtsstern/original_b542fc55-0d5c-4229-9888-c1a8ad6a12aa_PXL_20241224_091728455.jpg" alt="USB-C PD Board" width="1024" height="1024" >}}

```goat
                                     ┌───────────┐
                                     │           │
                      ┌──────────────┤ Lightbulb │
                      │              │           │
                      │              └─────┬─────┘
                      │                    │      
                      │              ┌─────┴─────┐
                      │              │           │
                      │              │ Lightbulb │
                      │              │           │
                      │              └─────┬─────┘
┌───────────┐     ┌───┴───┐                │      
│           ├─────┤       │          ┌─────┴─────┐
│   USB-C   │     │PD-PCB │          │           │
│           ├─────┤       │          │ Lightbulb │
└───────────┘     └───┬───┘          │           │
                      │              └─────┬─────┘
                      │                    │      
                      │              ┌─────┴─────┐
                      │              │           │
                      │              │ Lightbulb │
                      │              │           │
                      │              └─────┬─────┘
                      │                    │      
                      │              ┌─────┴─────┐
                      │              │           │
                      └──────────────┤ Lightbulb │
                                     │           │
                                     └───────────┘
```

I configured the adapter to output up to 20 volts. That means the Christmas star can now run off almost any phone charger or power bank. Best of all, this Russian Christmas decoration is now officially compliant with [EU Directive 2022/2380](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32022L2380).

# More Photos
{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/USB-C_Upgrade_fuer_Weihnachtsstern/PXL_20241221_125119190.jpg" alt="Inside the star" width="1024" height="1024" >}}

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/USB-C_Upgrade_fuer_Weihnachtsstern/PXL_20241221_131644252.jpg" alt="The star lit up" width="1024" height="1024" >}}

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/USB-C_Upgrade_fuer_Weihnachtsstern/PXL_20241223_212551198~4.jpg" alt="On top of the tree" width="1024" height="1024" >}}
