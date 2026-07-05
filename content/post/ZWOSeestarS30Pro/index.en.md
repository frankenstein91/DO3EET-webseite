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
Although the telescope is still on its way, today I already installed the first software packages required for future astrophotography image processing on my Linux system. Using the AUR helper `pikaur`, I set up `siril` (for stacking and basic processing), `graxpert-bin` (for gradient removal), and `starnet2-bin` (for star removal):

```bash
pikaur -S starnet2-bin graxpert-bin siril
```

In this post, I will document my initial thoughts, the delivery process, and later, of course, the first astrophotography results with this compact device.

## Saying Goodbye to Old Companions

With the arrival of the new smart telescope, it is also time to clear some space. I plan to pass down my two old telescopes from my childhood days to my cousin's children. This way, they won't gather dust in the closet anymore and will hopefully inspire a new generation to look up at the stars and explore astronomy.

## First Impressions After Delivery

*This section will contain the unpacking and first impressions once the package arrives.*

[^1]: [YouTube: ZWO Seestar S30 Pro Review / Test in Tokyo](https://youtu.be/WHwij7kp5Ao?si=akDDS5MTtnikQk3b)
