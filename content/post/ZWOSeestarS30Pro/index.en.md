+++
title = 'New Addition: Ordering the ZWO Seestar S30 Pro'
date = "2026-07-05T20:42:27+02:00"
draft = false
author = "Frank Tornack"
tags = [
    "Astronomy",
    "Smart Telescope",
    "Seestar S30 Pro",
    "ZWO",
    "Bresser"
]
+++

On July 4, 2026, I ordered a new smart telescope: the **ZWO Seestar S30 Pro** via Bresser.

## How this post is written

I am writing this post diary-style over several days and will only publish it once the telescope is delivered and I have captured the first images. This article will document the entire journey from ordering to the "first light".

## Chronology

### June 2026: The Purchase Impulse at HAM Radio
The inspiration for this purchase came during my visit to the [HAM Radio Friedrichshafen](https://www.hamradio-friedrichshafen.de/) exhibition. Alongside the traditional amateur radio event, there was a parallel astronomy exhibition where I saw the smart telescope in person for the first time.

### July 4, 2026: The Order
The smart telescope was ordered via Bresser – thanks to a 15% exhibition discount coupon, the final price was €643.55 including DHL shipping. I actually wanted to pay using my Crypto.com credit card to benefit from the 2% cashback. However, since it was the weekend, a bank transfer to top up the card wasn't possible in time. Because I didn't have enough liquid funds on it, I had to resort to a standard credit card in the end.

#### Why the Seestar S30 Pro?
The first and most crucial point for me was that the Seestar S30 Pro works natively with **FITS files** – unlike the proprietary **NEF files** (Nikon Electronic Format) of my Nikon D5660.

Here are the key differences and benefits of FITS in daily astrophotography:

*   **Astronomical Standard & Metadata**: FITS (*Flexible Image Transport System*) is the gold standard in scientific astronomy. The biggest advantage over the NEF format is the standardized header. A FITS file stores not only the raw image data but also embeds extensive astronomical metadata directly. This includes exposure time, gain, sensor temperature, the exact coordinates (RA/Dec) of the target, filter information, and more. Stacking software like Siril can read this data natively, allowing it to automatically sort, align, and calibrate frames. With NEF files, this astronomical header metadata is entirely missing, making manual organization and processing far more tedious.
*   **Data Format & Bit Depth**: While NEF files are usually limited to 12-bit or 14-bit depth and often use proprietary lossy compression, FITS files store sensor data uncompressed in 16-bit (or even 32-bit floating point). This provides a significantly wider dynamic range and preserves the subtlest gradient details in nebulae and star clusters.
*   **Compatibility & Processing**: To use NEF files in astro-processing software like Siril, GraXpert, or PixInsight, they often must be converted or demosaiced through libraries like LibRaw first. FITS files are processed natively by any astronomy software without conversion loss, making calibration with darks and flats seamless and preserving maximum image quality.
*   **Sensor Configuration (Sony IMX585 & IMX586)**: The S30 Pro features a dual-camera system with two high-quality Sony sensors. The main (telephoto) camera uses the **Sony IMX585** sensor (1/1.2" format, 8.3 megapixels with 4K resolution), highly regarded in the astrophotography community for its extreme sensitivity and low noise (with zero amp-glow). This is a massive upgrade compared to the standard Seestar S30, which only uses the smaller IMX662 with 2.1 megapixels. The wide-angle camera uses the **Sony IMX586** (also 8.3 megapixels with 4K) for capturing wide-field views and Milky Way panoramas.
*   **Battery Life**: Another important factor for me is the battery life of 6 to 7 hours, which was confirmed by a YouTuber[^1]. I was particularly impressed by the fact that the telescope worked flawlessly for him even in the middle of heavily built-up Tokyo.
*   **Tripod Compatibility & Weight**: The low weight of the telescope is a huge benefit for me. Since I plan to bring the device with me to Wakkanai (Japan) in 2027, portability is key. Additionally, I love the fact that I can simply mount the Seestar onto my existing Rollei tripod, making travel and setup even easier.
*   **Solar Observation & Solar Filter**: Another highlight I am looking forward to is the total solar eclipse on August 2, 2027, on the Tunisian island of Djerba. The Seestar's solar filter will surely come in handy to record a spectacular video of this rare celestial event.
*   **Mosaic Mode (Milky Way Stitching)**: A great software feature is the mosaic mode, which automatically sweeps larger areas of the sky and stitches them together as a mosaic. This is extremely useful for large nebula complexes or Milky Way panoramas, since the sensor otherwise has a relatively narrow field of view (FOV).

### July 5, 2026: Software Preparations
Although the telescope is still on its way, today I already installed the first software packages required for future astrophotography image processing on my Linux system. Using the AUR helper `pikaur`[^2], I set up `siril`[^3] (for stacking and basic processing), `graxpert-bin`[^4] (for gradient removal), and `starnet2-bin`[^5] (for star removal - which is unfortunately closed source now):

```bash
pikaur -S starnet2-bin graxpert-bin siril
```

Afterward, I configured the paths to both external programs directly in Siril's settings so that Siril can invoke them during processing:
*   StarNet2: `/usr/bin/starnet2`
*   GraXpert: `/usr/bin/graxpert-bin`

### July 7, 2026: Shipped & FITS Viewer Integration
*   **Package Shipped**: At 10:10 AM, notification was received that the package has shipped. Although a DHL tracking number is already available, the tracking page does not show any information yet.
*   **FITS Viewer Integrated**: To hit the ground running as soon as the telescope is delivered, I integrated a FITS viewer into my website. A big thank you to Reddit user `u/sjmoodyiii` ([link to comment](https://www.reddit.com/r/seestar/comments/1cg0vbe/comment/l1sof20/)) for kindly hosting sample files on the internet, which made testing possible.

### July 9, 2026: Delivery & First Light
*   **Telescope Arrived**: The package was delivered by DHL today.
*   **Unboxing & Charging**: I unpacked the telescope right away. As with any new electronic device, the very first step is to plug it in and let it charge fully before taking it out for its first test run.
*   **App Download**: At the same time, I started downloading the Seestar app. With a size of about 1.3 GiB, it is quite a large download—on a DSL 7000 connection, this takes some time, which is crucial to plan for, especially when traveling abroad.
*   **First Light**: Luckily, the sky cleared up late in the evening, allowing me to head outside for the first observation session (NGC 7000) starting at 11:10 PM.

## Saying Goodbye to Old Companions

With the arrival of the new smart telescope, it is also time to clear some space. I plan to pass down my two old telescopes from my childhood days to my cousin's children. This way, they won't gather dust in the closet anymore and will hopefully inspire a new generation to look up at the stars and explore astronomy.

## First Impressions After Delivery

After the DHL delivery agent handed over the package today, I immediately went to unbox it. Unlike some other models, the Seestar S30 Pro does not come with a classic hard shell case (hardcase). Instead, it includes a carrying bag that feels very premium. A very practical detail: all the accessories—including a compact solar filter with a magnetic mount (which I haven't tested yet) and a small tripod—were already neatly packed and organized inside the bag.

As the first step, the telescope was plugged in to charge the battery. Meanwhile, the download of the accompanying Seestar app is already underway. Weighing in at a substantial 1.3 GiB, the app is a real heavyweight. On my DSL 7000 connection, this requires some patience and is also a critical detail to keep in mind if you plan to set up the telescope abroad or on the go using mobile data.

The next step after charging is connecting the telescope to the smartphone. To do this, it is necessary to create an account in the app. Once connected, you can change the default Wi-Fi password of the Seestar (a highly recommended security measure) and directly update the firmware to the latest version. As soon as that is done and the weather plays along, it will be time for the "first light."

## First Light: The First Night in Action

I was incredibly lucky: on the very evening after delivery, the sky cleared up completely, offering perfect conditions for the "first light." At 11:10 PM, I headed outside with the fully charged Seestar.

### Tripod and Mounting

Since I don't own a tripod head with a 3/8-inch thread yet, I used my existing Rollei tripod directly without a head, mounting the telescope straight onto the tripod's base screw. Compared to my Nikon D5660, the Seestar S30 Pro is a relatively large and bulky device. Screwing it onto the bare tripod thread felt a bit awkward and unsafe at first—it was tricky to keep it balanced while turning the telescope body. However, once the thread was fully tightened, it sat extremely stable and secure.

### App Settings and the First Target: NGC 7000

Before starting, I switched the Seestar app's language to English. The German localization feels a bit clunky and inaccurate in several places. Since my English is strong, the English user interface is much cleaner and easier for me to use.

My first target of the night was **NGC 7000**, the famous North America Nebula in the constellation Cygnus. While the telescope was slewing to the target and preparing the capture sequence in the background, the app showcased one of its coolest features: the built-in AI started sharing interesting facts and background details about the nebula. Having this audio/text companion completely transforms the waiting time during alignment and calibration, making the stargazing experience feel highly interactive.

For comparison, here is the JPEG image automatically processed and stretched by the Seestar app, exactly as saved on the smartphone:

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/ZWOSeestarS30Pro/NGC7000.jpg" alt="NGC 7000 (Seestar JPEG)" width="360" height="640" >}}

And here is the finished stacked raw image as a FITS file directly from the telescope, which can be viewed and adjusted using the interactive FITS viewer:

{{< fitsviewer src="https://do3eet-media.dreamofjapan.de/posts/ZWOSeestarS30Pro/Stacked_227_NGC%207000_10.0s_LP_20260710-001530_2.fit" localsrc="Seestar_Fit_20260710_013425/Stacked_227_NGC 7000_10.0s_LP_20260710-001530_2.fit" >}}

### Second Target: Sadr and the Addictive Fun

Originally, I had only planned to capture a single test image during this first night to check how the tripod, telescope, and app worked together. However, the observation process and the simplicity of the system were so much fun that I just couldn't stop. On a whim, I decided to start a second capture.

My second target of the night was **Sadr** (Gamma Cygni), the bright star at the center of the constellation Cygnus, which is surrounded by the vast emission nebulae of the Sadr region (IC 1318). Once again, slewing and centering went flawlessly.

Here is the processed JPEG image of the Sadr region from the app:

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/ZWOSeestarS30Pro/Sadr.jpg" alt="Sadr Region (Seestar JPEG)" width="360" height="640" >}}

And here is the raw stacked FITS image for comparison:

{{< fitsviewer src="https://do3eet-media.dreamofjapan.de/posts/ZWOSeestarS30Pro/Stacked_181_Sadr_10.0s_LP_20260710-010138_6.fit" localsrc="Seestar_Fit_20260710_013425/Stacked_181_Sadr_10.0s_LP_20260710-010138_6.fit" >}}

### In Conclusion: A Wide-Angle Mosaic of Vega

At the very end of the night, just as I was about to pack up, curiosity got the better of me: I really wanted to try out the new mosaic mode of the Seestar S30 Pro.

For this test, I chose one of the brightest stars in the summer sky: **Vega** in the constellation Lyra. What makes this image special is that it was not captured with the main telephoto lens, but with the integrated **wide-angle camera** (Sony IMX586 with a focal length of 5.96 mm).

The telescope captured a total of 54 frames at 10 seconds each (amounting to 9 minutes of total exposure time). The resulting FITS file has a resolution of **4175 x 3777 pixels**. Since the wide-angle camera's sensor natively has a different aspect ratio, this almost square format clearly demonstrates that the software successfully stitched multiple individual frames into a mosaic while the telescope swept the area around Vega.

Here is the stitched wide-angle JPEG image of Vega from the app:

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/ZWOSeestarS30Pro/Vega.jpg" alt="Vega Mosaic (Seestar JPEG)" width="500" height="452" >}}

And here is the stitched FITS image for interactive comparison:

{{< fitsviewer src="https://do3eet-media.dreamofjapan.de/posts/ZWOSeestarS30Pro/20260710-012011_4.fit" localsrc="Seestar_Fit_20260710_013425/20260710-012011_4.fit" layout="bottom" >}}

### Packing Up and Night Moisture

Around 1:30 AM, it was time to pack up. Similar to the setup, unscrewing the telescope directly from the tripod thread was a slightly nerve-wracking process. Due to the bulkiness of the Seestar S30 Pro, there is a constant fear of dropping the device while turning it off the bare 3/8-inch base screw. A proper tripod head will definitely be my next purchase to make this process much safer.

Additionally, while packing up, I noticed that the material of the included carrying bag strongly attracts the evening humidity. The bag was noticeably wet on the outside. It is definitely a good idea to let the telescope and accessories air out briefly at home so that no moisture gets trapped inside the bag.

### Battery Life, Range, and Comfort

In practical use, two points in particular surprised me very positively: the battery life and the range of the direct Wi-Fi hotspot:

* **Battery Capacity**: After the session lasting around 2 hours and 20 minutes (from 11:10 PM to approx. 1:30 AM), during which the telescope was almost continuously calibrating, slewing, and stacking, the battery level dropped from 100% to only 77%. This indicates that the battery life in real-world operation under these conditions might even exceed the YouTube estimates researched beforehand.
* **Wi-Fi Range**: The control ran entirely via the direct Wi-Fi network established by the Seestar itself (without integration into the home network). I was able to comfortably control the telescope directly from my bed—the signal remained stable through a house wall over a distance of about 50 meters to the dark, rural corner of the property where I had positioned the device.

I did not explicitly pay attention to any dew on the front lens during this first night—but given the high humidity and the wet carrying bag, this will certainly be an important point to monitor in the future.

### Scientific Excursion: Why Do These Nebulae Glow Red?

Both the North America Nebula (NGC 7000) and the region around Sadr (IC 1318) belong to the class of **emission nebulae**. The characteristic red glow of these regions has a fascinating physical reason:

* **Hydrogen (H-alpha)**: These nebulae consist largely of interstellar gas, primarily atomic hydrogen. Nearby, extremely hot stars emit vast amounts of energetic ultraviolet (UV) light.
* **Ionization & Recombination**: This UV radiation ionizes the hydrogen atoms by stripping the electrons away from the protons. When the electrons recombine with the protons and cascade down to lower energy levels, they emit light.
* **The 656.28 nm Line**: The electron transition from the third to the second energy level (the so-called **H-alpha line**) emits light at a wavelength of exactly 656.28 nanometers. This lies in the deep red portion of the visible spectrum.

Since hydrogen is by far the most abundant element in the universe, almost all classic star-forming regions and emission nebulae glow in this beautiful red hue in astrophotography.

### Raw Data vs. JPEG: Why Are the Colors in the FITS Viewer Fainter?

Anyone comparing the finished JPEG on their smartphone with the FITS file in the interactive FITS viewer will notice that the red color in the viewer appears significantly weaker and fainter. This is not a bug, but is due to technical reasons:

* **No Saturation Boost**: The Seestar app applies aggressive image processing to the JPEGs. This includes a heavy saturation boost to make the faint colors of the nebulae "pop" on mobile displays. The FITS viewer stretches the brightness values but does not modify color saturation.
* **Scientific White Balance**: The FITS viewer (implemented in `fitsviewer.js`) automatically balances the RGB channels to neutralize the sky background. In contrast, the mobile app uses sensor-specific color matrices to selectively boost H-alpha red.
* **FITS as Raw Material**: FITS files are raw measurement data intended for post-processing in software like Siril or PixInsight. Since my computer is currently having issues with Siril after the last Arch update (`siril: error while loading shared libraries: libopencv_calib3d.so.413: cannot open shared object file: No such file or directory`), I haven't been able to perform the manual stacking and processing on my laptop yet—so the FITS images here are based on the stacked images automatically generated by the telescope. It is only during manual processing (stretching, background extraction, and color saturation) that you pull the full, vibrant red out of the data in a controlled way.

## Join the Discussion!

Now it's your turn: Which celestial bodies should I target next with the Seestar S30 Pro? And what do you prefer when viewing – the interactive, scientific raw FITS data directly in the browser, or the pre-processed, vibrant JPEGs? Let me know in the comments below!





[^1]: [YouTube: ZWO Seestar S30 Pro Review / Test in Tokyo](https://youtu.be/WHwij7kp5Ao?si=akDDS5MTtnikQk3b)
[^2]: [GitHub: actionless/pikaur](https://github.com/actionless/pikaur)
[^3]: [Siril](https://siril.org/)
[^4]: [GraXpert](https://graxpert.com/)
[^5]: [StarNet](https://starnetastro.com/cli-tools/starnet/) (no longer open source)
