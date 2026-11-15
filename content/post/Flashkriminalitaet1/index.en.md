+++
title = 'Flash Fraud'
date = 2024-04-11T16:32:55+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Security",
    "Fraud",
    "Shopping",
]
+++

I'd like to share a recent bad experience with the world. Maybe it'll save a few potential victims from getting burned and do a small part in stamping out this kind of scam—sadly, it still pays off far too often.

# The Story
A few days ago, I bought a 512 GB USB 3 flash drive on Amazon. Honestly, it mostly caught my eye because of its design. When I formatted the drive as usual, nothing seemed out of the ordinary. Since I had ordered two of them (one for a friend), I decided—no idea what possessed me—to take a closer look at the drive. That's when I noticed the sluggish USB 2 speeds.

# Analysis
## USB Version
Actually, I only needed to look closely at the blue USB plug to see it was just a USB 2 connector dyed blue—the extra pins were completely missing inside. Being a Linux user, though, I reached for software first. In the output of `sudo lsusb -v -d 048d:1234`, the line `bcdUSB               2.00` jumped right out at me. With a sinking feeling, I ran a YaCy search to confirm that `bcdUSB` indeed reports the USB specification version. Since my Framework laptop definitely supports USB 3, the culprit had to be the stick. So I took a closer look at the plug and found only four contacts—definitely not what you expect from USB 3. Having caught fraud number one, my curiosity was officially piqued.

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/Flashkriminalitaet1/PXL_20240411_055122297~3.jpg" alt="Blue USB connector" width="800" height="600" >}}

## Storage Capacity
Up to that point, I might have just left a bad Amazon review as a warning and moved on. Neither my friend's use case nor mine actually needed USB 3 speeds. Now that my suspicion was up, though, I broke out the proper testing tools. With `f3`[^1], there's a great suite built specifically to fight flash fraud. On Arch, you can grab it straight from the AUR with `pikaur -S f3`.

Since I had already formatted the drive as exFAT, I opted for a file-level test. I hopped into the root directory of the USB stick in Bash and kicked off part one with `f3write .`, which writes `.h2w` test files until the drive is completely full. Thanks to USB 2 speeds across an alleged 512 GB (500 GB in the file manager), this phase ran overnight and took around nine hours. So far, there were no obvious red flags like I/O errors in the output.

First thing after waking up, I went straight to the laptop, synced and "safely" ejected the drive, set it aside next to the laptop, and rebooted—just to be 100% sure I was testing data actually stored in flash memory rather than something lingering in a cache.

About 10 minutes later, it was time for part two. I plugged the drive back in, let automount do its thing, jumped back into the root directory, and started the read test with `f3read .`. This verifies every single file—unfortunately at USB 2 speeds again. Starting at file `51.h2w`, the output reported nothing but `corrupted` blocks. By file `491.h2w`, things got even worse: some blocks were also flagged as `overwritten`.

The final tally:
```
Data OK:          59.92 GB (125666348 sectors)
Data LOST:       440.06 GB (922871252 sectors)
Corrupted:       440.00 GB (922755780 sectors)
Slightly changed:  0.00 Byte (0 sectors)
Overwritten:      56.38 MB (115472 sectors)
```
Needless to say, this stick is going straight back, along with a scathing review.

<sub><sup>I'm intentionally not linking to the USB drive or naming the product—I don't want to hand these scammers any free SEO juice from this post.</sup></sub>

[^1]: [Fight Flash Fraud](https://fight-flash-fraud.readthedocs.io)
