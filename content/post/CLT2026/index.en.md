+++
title = 'Review: Chemnitzer Linux-Tage 2026'
date = 2026-03-31T21:00:00+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Open Source",
    "Chemnitz",
    "CLT",
    "Review",
]
+++

The Chemnitzer <span class="linux-egg">Linux</span>-Tage 2026 have come to a close, and it was once again a fantastic weekend of learning, sharing, and community.

In this post, I want to look back at my experiences and highlights of the event.

## Friday, March 27th

My journey to this year's <span class="linux-egg">Linux</span>-Tage began on Friday afternoon. I set off from Grimma at exactly 3:00 PM. The drive took me along country roads via Colditz, Geithain, and Narsdorf before finally hitting the A72 motorway toward Chemnitz.

My first stop in Chemnitz was the TU's main lecture hall building (Hörsaalgebäude). As soon as I arrived, I picked up my event badge – the official starting signal for a long and eventful weekend as a volunteer and exhibitor.

After that, I checked into my hotel. As soon as I got to my room, I set up the most essential equipment first: my D-Star hotspot and my radio. This meant I was immediately back "QRV" in Chemnitz and ready for some exchanges over the air.

However, I didn't stay in my room for long, as the traditional pre-event at **Turmbrauhaus** started at 6:30 PM. As in previous years, the upper floor was packed. With great food (luckily the menu has everything from meat to vegan), it was the perfect time for those first deep conversations with other attendees who had also arrived on Friday. It's the ideal way to get into the right mindset for the upcoming two days.

A big thank you to Silke for the great post to set the mood:

{{< loadtoot instance="mastodon.social" id="116193523212185171" >}}

Another interesting find of the evening was a flyer for the **3. Open Source Hardware Conference (OSHap)**, taking place from September 23rd to 24th, 2026, in Halle (Saale). Under the motto “Think open. Build open.”, they are currently calling for participation (Call for Participation). Since the topic of Open Source Hardware aligns perfectly with my interests (like the Sharp PC-E500S or RISC-V), I’m seriously considering attending the event in Halle this September. More information is available at [www.oshop-network.de](https://www.oshop-network.de).

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/CLT2026/EinladungHalle.jpg/EinladungHalle.jpg" alt="Flyer for OSHap 2026 in Halle" width="600" >}}

## Saturday, March 28th

The first full day of the event was particularly busy but also very exciting for me. This year, I was active as a volunteer in the **VOC team** (Video Operation Center).

My main task was live-editing the streams of the talks. This involves switching between different camera angles and the speakers' slides to ensure that online viewers can follow the presentations as smoothly as possible.

My first assignment of the day started at 11:00 AM in Room V6. On the schedule was a highly topical subject: **"The Cryptocalypse: Post-Quantum Cryptography and Open Source"**. This 60-minute session by Stefan Schumacher covered the massive challenges that quantum computers pose to our current encryption methods.

Here’s a quick summary of the key takeaways:

*   **The Problem:** Algorithms like **Shor** (breaking RSA and ECC) and **Grover** (halving the security of symmetric methods like AES) mean that quantum computers threaten the foundations of our digital security.
*   **The Solution (PQC):** The NIST standardization process has already announced the first winners. These include **ML-KEM (Kyber)** for key encapsulation, and **ML-DSA (Dilithium)** and **SLH-DSA (Sphincs+)** for digital signatures.
*   **Open Source Pioneers:** Projects like **Open Quantum Safe (OQS)** are playing a vital role. With the `oqsprovider` for OpenSSL, hybrid methods combining classic and post-quantum cryptography can already be used today.
*   **Recommendations:** We should focus on **crypto-agility**, implement hybrid schemes, and create a "crypto inventory" to know where encryption is being used across our systems.

It was technically demanding, which made it an exciting challenge for my first live edit of the day.

In the afternoon, at 2:00 PM in Room V5, we moved on to a practical topic for network enthusiasts: **"Containerlab – Simulating Datacenter Networks in the Lab"**. Robert Sander (Heinlein Consulting) provided a deep dive into this project, which started at Nokia five years ago and has since built a strong community.

What’s particularly fascinating about Containerlab is the ability to map complex data center structures using resource-efficient <span class="linux-egg">Linux</span> containers. Since modern router hardware often uses the <span class="linux-egg">Linux</span> kernel, many vendors provide their firmware as container images. For anything that doesn't run natively on <span class="linux-egg">Linux</span>, traditional VMs can also be integrated. Sitting at the video switcher, it was interesting to see how quickly and efficiently entire topologies can be spun up and down without needing a rack full of hardware.

The conclusion of my VOC shift that day was at 3:00 PM (also in Room V5) with the talk **"bindzwirn: <span class="linux-egg">Linux</span> Port Permissions via eBPF"** by Pluto.

In self-hosting scenarios, whether at home or on a VPS, isolating services through separate Unix accounts (e.g., using rootless Podman containers) is best practice. The issue is that <span class="linux-egg">Linux</span> lacks native permissions for IP ports. Pluto presented [bindzwirn](https://codeberg.org/bindzwirn/bindzwirn), a modern eBPF-based drop-in replacement for the aging `authbind`. Thanks to eBPF, access to specific ports can be restricted to specific accounts, effectively preventing attacks from compromised services. A very exciting project that demonstrates how powerful eBPF is for elegantly extending kernel functionality. (And I secretly wondered: is Pluto actually a fan of Neil deGrasse Tyson? 😉)

### Relaxed Evening: "Chemnitzer Catering-Tage"

Following Saturday's official program, there was a wonderful evening event for all volunteers, speakers, exhibitors, and sponsors. As is tradition, it was jokingly referred to as "Chemnitzer Catering-Tage" (Chemnitz Catering Days) – the food was excellent once again and provided the perfect setting for some relaxed networking away from the exhibition floor's hustle and bustle.

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/CLT2026/CCT.jpg/CCT.jpg" alt="Poster for the Chemnitzer Catering-Tage" width="600" >}}

## A Special Highlight: Overnight Hardware Rescue

In between the event days, I had a very personal success story. I had brought along my old **Sharp PC-E500S Pocket Computer**, which unfortunately had lost its display contrast and showed ugly black bars – a typical aging issue with the capacitors.

As I didn't trust myself with the delicate repair job, I sought help at the **soldering workshop**. An incredibly helpful participant (whose name I unfortunately forgot in all the excitement) offered to take a look at it overnight.

And it worked: He replaced the two faulty 3.3μF SMD electrolytic capacitors (16V and 25V) with robust tantalum ones. The next day, I was greeted by a flawless, clear display! I'm absolutely thrilled, as I plan to use this classic device as a **Ham Logbook** for amateur radio later. A huge thank you to my unknown rescuer!

## Sunday, March 29th

On Sunday, I switched perspectives: from the VOC team's video switcher to the stage. At 11:00 AM in Room K2, I hosted the **Keysigning Party** I had organized.

It’s always impressive to see how many people are passionate about digital sovereignty and encryption. My goal was to strengthen the **Web of Trust**. The process is as analog as it is effective:
1. **Hash Sum Verification:** First, we ensured that every participant had the same, up-to-date key list.
2. **Identity Verification:** In a long line, participants compared fingerprints and verified identities using official photo IDs.
3. **Building Trust:** This face-to-face interaction is the foundation for later signing other participants' keys at home with a clear conscience.

As the organizer, my job was to lead through the process, answer GnuPG-related questions, and ensure everything ran smoothly. Despite the technical nature of the topic, the focus was on human interaction.

### CTF Challenge with a Handicap

The **CTF-Challenge by secunet Security Networks AG** also kept me busy on Sunday. As it is every year, it was a major highlight for me, even though the challenge was twofold this time: I had to deal with massive firmware issues with my laptop's WiFi chip (which unfortunately are still ongoing). Despite this technical handicap, I managed to solve several levels, even if I couldn't complete the entire challenge this time around.

Here's a glimpse into the technical puzzles I had to crack:

*   **Getting Started & Hashing:** After the initial simple steps, it was all about extracting passwords from text files or calculating them using deprecated hash algorithms like MD5 from binary data.
*   **Archive Gymnastics:** One level involved analyzing a bzip2 archive that, once decompressed, turned into a massive, mostly empty file. The solution was hidden in scattered ASCII characters buried at specific offsets.
*   **Socket Voodoo:** Particularly exciting was accessing a Wireguard Unix socket (`/var/run/wireguard/wg0.sock`). By sending specific commands using `socat`, I was able to extract the private key needed for the next level.
*   **Metadata Forensics:** In a higher level, I had to inspect 64 directories for their timestamps. Only by meticulously comparing `Modify` vs. `Change` times could the correct puzzle pieces for the next password be assembled.
*   **SSH Tricks:** Finally, it came down to manipulating SSH environment variables (`SendEnv`) to bypass shell restrictions.

It's the spirit of the competition that counts, and even with the handicap, it was a blast once again!

After the party, I stayed until the official end of the event. At 6:00 PM sharp, as the doors were closed, I headed home with many new impressions.

## Conclusion

It was great to be back in Chemnitz! In addition to all the local experiences, there was also a major technical change to this website during the weekend: All graphics and images have moved from GitHub to **Cloudflare R2 storage**. This step was necessary as the Git repository was becoming too large due to the many images. While they have found their new home there, I'm not yet entirely sure if everything is working exactly as I'd like regarding caching and S3. I'll likely need to do some fine-tuning over the next few days.
