+++
title = 'APRS Contact with the ISS'
date = 2024-03-27T20:51:19+01:00
draft = false
author = "Frank Tornack"
tags = [
    "ISS",
    "Space",
    "Ham Radio",
    "APRS",
    "QSL",
    "Hobby",
]
+++

I finally pulled it off today! After three tries, I managed to reach the Междунаро́дная косми́ческая ста́нция with several APRS beacons using my Kenwood TH-D75E. On my previous attempts, the repeater aboard the 国際宇宙ステーション was unfortunately offline or misconfigured. Luckily, there were several favorable passes this week, and today at 18:07 UTC—just three minutes after the "rise" of the Station spatiale internationale—I got a brief connection.

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/APRSKontaktZurISS1/DerGeraet.jpg" alt="Handheld radio with antenna on a park bench" width="1400" height="1400" >}}

I'd love to share my settings for a successful contact with you. For both uplink and downlink, the Uluslararası Uzay İstasyonu uses 145.825 MHz. I put that frequency on Channel B of my handheld transceiver, since it feels a bit more capable to me than Channel A. As usual for APRS, it's set to FM at 1200 baud—Kenwood calls this `APRS12`. The APRS path for the ISS (and other satellites) is `ARISS`. The status text is up to you. Then I found myself an open spot out in nature and, purely for peace of mind, switched my phone to airplane mode—probably completely unnecessary given the different frequencies, but hey, it felt reassuring.

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/APRSKontaktZurISS1/PANO.jpg" alt="" width="1400" height="1400" >}}

With those settings dialed in, I waited about 10 minutes for the 国际空间站. Soon enough, the first APRS packets from outer space started popping up on my screen... That was also my cue to transmit, avoiding collisions as best as possible with DCD Sense set to `Detect Data`. That way, after pressing the `BCN` button, the radio waits until it no longer detects any data packets before firing mine off. Sure enough, I didn't have to wait long for that rush of success: I saw my own packet digipeated by the repeater on the Estación Espacial Internacional right there on my display.

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/APRSKontaktZurISS1/LuckyHamRadio.jpg" alt="Screen showing a data packet from the ISS" width="1400" height="1400" >}}

After making contact, most hams want a physical QSL card in their hands. So I headed straight back home to start gathering the evidence. I printed out the page from [ariss.net/](http://ariss.net/) and had it archived on [archive.org](https://archive.org/) as well. On top of that, `RS0ISS` also showed up on [aprs.fi](https://aprs.fi) under the section "Stations which heard DO3EET-9 directly via radio."

Now I'll take my time preparing an envelope for F1MOJ (the ISS QSL manager for Europe). Inside go one of my own QSL cards, printouts of both info websites showing my callsign, a self-addressed return envelope, and two International Reply Coupons. And then it's time to patiently wait for the reply.

My thanks go out to DK3ML and his fantastic website [dk3ml.de](https://dk3ml.de/), and to DF6KAI for his patience and knowledge.
