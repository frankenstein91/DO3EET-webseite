+++
title = 'From Frustration to a Custom Dial: Dream of Japan Torii GMT'
date = "2026-10-30T14:58:22+01:00"
draft = false
author = "Frank Tornack"
tags = [
    "Smartwatch",
    "Wear OS",
    "Ham Radio",
    "Japan",
    "Android",
    "Open Source",
    "Python",
    "Linux",
]
+++

Anyone who wears a smartwatch daily knows: the watch face is the most critical interface on your wrist. At a quick glance, it needs to deliver the exact information you require—clean, reliable, and aesthetically pleasing.

That is precisely where my frustration began. On my previous watch face, numbers in the complications were frequently truncated, cut off, or simply unreadable. Furthermore, none of the off-the-shelf watch faces reflected what truly defines my everyday life and hobbies: a fusion of **amateur radio** (my callsign [DO3EET](https://do3eet.pages.dev)), my enduring love for **Japan**, and the distinct terminal visual identity of this blog.

So I made a decision: if the perfect watch face doesn't exist, I'll build it myself from scratch. The result is **Dream of Japan · Torii GMT** for the Google Pixel Watch—crafted using Google's modern, purely declarative **Watch Face Format (WFF v2)**.

<!--more-->

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/DreamOfJapanWatchface/torii_gmt_wrist.jpg" alt="The finished Dream of Japan Torii GMT watch face on the Pixel Watch on wrist" width="1400" height="1093" >}}

---

## The Concept: When Radio Room Clocks Meet Miyajima

A cookie-cutter watch face was never going to cut it. I wanted a full-fledged GMT and radio room timepiece, combined with Japan travel utility and blog-inspired aesthetics.

### 1. Amateur Radio & Universal Time at the Core
- **Outer 24h Bezel with Zulu Crown (`Z`):** Positioned at 24/00 hours is the `Z` crown for Zulu time (UTC). A prominent red 24-hour arrow hand sweeps the dial once a day, continuously indicating current UTC on the bezel—an absolute essential for logging contacts and tracking band openings.
- **Radio Silence Sectors:** Around the minute track, the classic international radio silence intervals (minutes `00–03`, `15–18`, `30–33`, and `45–48`) are subtly highlighted—a nod to traditional maritime radio room clocks.
- **Skeletonized Hands (Still WIP):** The concept was to hollow out the shafts of the hour and minute hands so that complications and digital readouts beneath remain visible. In practice, however, this is very much an ongoing work in progress: reading smaller numbers through the cutouts is still quite tricky depending on hand alignment—I'll definitely need to tweak the frame widths, transparencies, and cutout geometry in upcoming iterations. Functionally, though, it’s all there: the hour hand can be toggled via settings between **24h Radio Room mode** (1 rotation = 24 hours, displaying the direct angular time zone offset against the UTC hand) and **classic 12h GMT mode**.

### 2. Japan Companion & Terminal Aesthetic
- **Dual-Digital Console:** Positioned below the 12 o'clock marker is a split digital terminal. The left side displays UTC/Zulu, while the right displays Tokyo local time (`Asia/Tokyo`, JST). A dynamic day/night indicator (`☀` / `☾`) for Tokyo is already prepared in the XML expressions, but isn't visible in the current rendering yet and remains on the to-do list.
- **Date with Kanji Weekday:** In addition to day and month, the date line displays the traditional Japanese Kanji day of the week (`日, 月, 火, 水, 木, 金, 土`).
- **Miyajima O-Torii & Seigaiha Waves:** The lower half is dominated by the silhouette of the floating Grand Torii of Itsukushima (Miyajima), complete with its curved *Kasagi* lintel, *Ryōbu* pillars, and subtle water reflections. Behind it lies a field of traditional *Seigaiha* concentric wave arches—symbolizing not only ocean waves but also electromagnetic radio wave propagation.
- **Typography & Scanlines:** All numerals and typography feature `OpenDyslexicMono`, matching this blog, subtly overlaid with horizontal CRT scanlines.
- **6 Configurable Complications:** Battery, sunrise/sunset, step counter, world clock, upcoming events, and day of the week fit into custom oval and rounded-box gauge frames—ensuring numbers are never truncated again!

---

## Under the Hood: 4 Technical Hurdles & Breakthroughs

With Wear OS 5, Google made the new **Watch Face Format (WFF)** the required standard for efficient watch faces. WFF relies entirely on declarative XML (`hasCode="false"` in the Android manifest)—meaning no custom background Java or Kotlin services are running, resulting in outstanding battery efficiency.

However, anyone assuming declarative XML is simple will quickly encounter the strict quirks of the Wear OS runtime. Here are the four biggest challenges I solved during development:

### 1. Quirks of the DeclarativeWatchFaceRuntime (Wear OS 5 & 6)
The Wear OS `DeclarativeWatchFaceRuntime` parses XML with strict validation. Syntax discrepancies often lead to silent failures or dropped components:

- **`<ComplicationSlot>` Must Be a Direct Child of `<Scene>`:** It is tempting to group complication slots inside `<Group>` elements for easier layout transforms. However, the runtime will ignore them unless every `<ComplicationSlot>` is placed **directly under `<Scene>`**!
- **Strict Bounding Tag Names:** For rounded touch targets, Wear OS expects `<BoundingRoundBox cornerRadius="14">`. Writing `<BoundingRoundRect>` causes the parser to discard the slot immediately.
- **Time Zones in DigitalClock:** Displaying a secondary digital clock for Tokyo cannot be done with simple string formatting. Instead, an explicit `<Localization>` element must be specified inside `<DigitalClock>`:

```xml
<DigitalClock x="228" y="99" width="82" height="42">
    <Localization timeZone="Asia/Tokyo" />
    <TimeText format="hh:mm" hourFormat="24" align="CENTER">
        <Font family="opendyslexic_mono" size="13" color="#C0CAF5" weight="BOLD" />
    </TimeText>
</DigitalClock>
```
*Note:* `<TimeText>` format strings must be strictly lowercase (`format="hh:mm"`).

### 2. A Lean Toolchain Instead of Gradle Overhead
Building a WFF watch face does not require launching Android Studio with gigabytes of Gradle daemon overhead and Kotlin compilers. Because WFF contains no compiled code, the entire APK can be packaged directly using the Android SDK build tools in under two seconds!

My build script `build_apk.sh` executes the entire pipeline synchronously:

```bash
#!/usr/bin/env bash
set -euo pipefail

SDK_DIR="${ANDROID_HOME:-$HOME/Android/Sdk}"
BUILD_TOOLS="$SDK_DIR/build-tools/36.1.0"
PLATFORM_JAR="$SDK_DIR/platforms/android-36/android.jar"

# 1. Render dial and hand assets
python3 ./scripts/generate_assets.py

# 2. Compile Android resources with aapt2
"$BUILD_TOOLS/aapt2" compile --dir ./app/src/main/res -o ./build/compiled_res/

# 3. Link APK package (de.dreamofjapan.watchface)
"$BUILD_TOOLS/aapt2" link \
    -I "$PLATFORM_JAR" \
    --manifest ./app/src/main/AndroidManifest.xml \
    --min-sdk-version 33 \
    --target-sdk-version 36 \
    --auto-add-overlay \
    -o ./build/unaligned.apk \
    ./build/compiled_res/*.flat

# 4. Zipalign & Sign
"$BUILD_TOOLS/zipalign" -f -p 4 ./build/unaligned.apk ./build/aligned.apk
"$BUILD_TOOLS/apksigner" sign --ks ./build/debug.keystore --out ./dist/dreamofjapan-torii-gmt.apk ./build/aligned.apk
```

In less than two seconds, a fully signed, production-ready APK is waiting in the `dist/` directory.

### 3. Asset Engineering: 4x Supersampling with Python & PIL
On the 450×450 pixel OLED screen of the Pixel Watch Gen 4, any pixelation on fine graduation marks or concentric curves is immediately visible.

Rather than drawing assets manually in vector software, a Python script (`generate_assets.py`) generates all layers mathematically using polar coordinate transformations:

```python
# 4x Supersampling: 1800x1800 px internal canvas -> Lanczos downsampling to 450x450 px
SIZE = 450
SCALE = 4
SS = SIZE * SCALE

def polar(angle_deg: float, radius: float, cx: float = 225.0, cy: float = 225.0):
    rad = math.radians(angle_deg - 90.0)
    x = cx + radius * math.cos(rad)
    y = cy + radius * math.sin(rad)
    return int(round(x * SCALE)), int(round(y * SCALE))

def downsample(img: Image.Image) -> Image.Image:
    return img.resize((SIZE, SIZE), Image.Resampling.LANCZOS)
```

By rendering on an 1800×1800 canvas and downsampling via **Lanczos filtering**, all tick marks, curves, and numerals appear razor-sharp on the watch face.

### 4. Wireless Deployment via ADB & Phone Hotspot
Connecting a smartwatch via physical USB is not an option on the Pixel Watch due to its wireless charging cradle. Fortunately, Wear OS supports *Wireless Debugging*.

Because smartwatches can frequently change local DHCP IPs on home routers, I use a straightforward trick:

1. Enable the Wi-Fi hotspot on the **Pixel 9 Pro XL** (both laptop and Pixel Watch 4 connect automatically).
2. Enable *Wireless Debugging* under Developer Options on the watch.
3. Because the ADB-TLS key pairing is persistent (`_adb-tls-connect._tcp`), ADB reconnects instantly without needing a new pairing code:

```bash
# Connect and deploy APK in one step
adb connect "$WATCH_IP:$WATCH_PORT"
adb install -r ./dist/dreamofjapan-torii-gmt.apk
```

In under 10 seconds, the updated watch face is live and running on the wrist.

---

## On the Wrist: The Final Result

The watch face came into being just today and has only been on my wrist for a few hours—still practically fresh from the compiler. Via the watch settings, four distinct themes (*Tokyo Night Terminal*, *Miyajima Vermilion*, *Neo-Tokyo Cyber*, and *JDM Field*), alternative date layouts, and hand modes can be changed on the fly.

Of course, a DIY project like this is never truly 100% finished. As mentioned, the skeletonized hands are still an active work in progress—when the minute hand parks directly over a digital digit, reading it still takes a bit of guesswork. But the foundation is rock solid, and subsequent iterations are only a quick Python tweak and an ADB deployment away.

What pleases me most: it works seamlessly in daily life. No more truncated numbers in complication frames, instant access to UTC for ham radio, a quick glance at Tokyo that brings back great travel memories—and the distinct satisfaction of wearing a timepiece crafted entirely to your own vision.
