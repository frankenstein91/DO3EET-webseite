+++
title = 'First Impressions of Google’s Find My Device Network'
date = 2024-07-05T16:00:00+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Android",
    "Google",
    "Experience",
    "Tech",
]
+++

Being into tech in general and loving to travel, I've always envied Apple users a bit for their AirTags. A few weeks ago, Google finally opened up its Find My Device network to third-party trackers as well. Together with a member of the [Leipzig Linux User Group](https://www.gaos.org/page/treffen/), I placed a joint order with [Pebblebee](https://pebblebee.com/pages/google-find-my-device) for some of these trackers. With shipping, customs duties, and import VAT, it wasn't exactly cheap—though still cheaper than losing a suitcase. Personally, I went for two of the Clip-style trackers.

# Setup
Pairing the trackers with my Google account was straightforward—whenever the instruction webpage actually loaded, that is. Unfortunately, it gave me a bit of trouble on day one. Thankfully, my friend from the group had set his trackers up a day or two earlier and was able to help me out.

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/FindMyDeviceNetwork1/Screenshot_20240618-134158.png" alt="Screenshot of the website in maintenance mode" width="800" height="600" >}}

Here, good old-fashioned paper manuals definitely have an edge over a stick-on QR code.

# Issues
## Multiple Tags
Like any proper nerd, I immediately paired both tags with my phone. Since each tracker has a faint serial number and MAC address printed on the back, you'd assume it would be easy to tell them apart in Google's app. Unfortunately, without assigning custom names yourself, you can't distinguish them at all: both show up under the exact same default name in the app, and none of the identifiers printed on the hardware are exposed in the UI.

## Location Update Frequency
The whole point of these trackers is crowdsourced location updates via other people's phones. Since I wanted to test this before going on vacation, I handed one of my trackers to a family member with an Android phone when they went out shopping. On that "other" phone, I had already switched Google's setting to "With network in all areas" instead of the default "With network in high-traffic areas only." Since the phone and tracker were traveling right next to each other, I expected frequent location updates. At first, though, I didn't even get a map—just a "Last seen at home" notice.

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/FindMyDeviceNetwork1/Screenshot_20240702-112714.png" alt="Screenshot of the notification" width="800" height="600" >}}

Checking the app again later, I finally saw an actual location ping. The annoying part? That location didn't budge until 6:00 PM—even though the person had already driven back to my place (while I was out) and stopped by another household in between.

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/FindMyDeviceNetwork1/Screenshot_20240702-151402.png" alt="Screenshot of the location pin" width="800" height="600" >}}

The only explanation I can come up with is that only actively used smartphones contribute to location reports, rather than phones sitting idle in pockets and handbags.

# Verdict
Clearly, we'll have to wait and see how Google's network matures over time. Right now, though, it's not quite where I'd hoped it would be.
