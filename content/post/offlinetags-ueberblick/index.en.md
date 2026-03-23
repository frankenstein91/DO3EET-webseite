+++
title = 'Offlinetags: An Overview of All 6 Privacy Signals'
date = 2026-03-23T20:27:00+01:00
draft = false
author = "Frank Tornack"
tags = [
    "Privacy",
    "Photography",
    "Offlinetags",
    "OpenSource",
]
+++

```bash
[frank@do3eet-terminal ~]$ cat /etc/privacy/offlinetags.conf
# Consent Communication Protocol v2.0
# STATUS: ALL 6 TAGS ACTIVE
```

If you spend a lot of time at barcamps, hackathons, or amateur radio meetings, you know the problem: Am I allowed to post this photo? Who is that in the background? And how do I signal myself what should happen with pictures of me?

This is exactly where **Offlinetags** come in. They are a social signal for humans – and at the same time, machine-readable markers for algorithms. Since I submitted a **Pull Request** today to expand the set to **6 symbols**, here is the guide for all photographers and tag-wearers (including the new proposals).

---

<style>
  .ot-row {
    display: flex;
    align-items: flex-start;
    gap: 2rem;
    margin-bottom: 3rem;
  }
  .ot-tag {
    flex: 0 0 150px;
    text-align: center;
  }
  .ot-tag img {
    width: 150px;
    height: auto;
    border: 2px solid var(--terminal-border);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.2);
  }
  .ot-content {
    flex: 1;
  }
  .ot-content h3 {
    margin-top: 0 !important;
  }
  @media (max-width: 40rem) {
    .ot-row {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .ot-tag {
      flex: 0 0 auto;
    }
  }
</style>

<div class="ot-row">
  <div class="ot-tag">
    <img src="TagMe.svg" alt="Tag Me">
  </div>
  <div class="ot-content">
    <h3>1. Tag Me (Green)</h3>
    <p><i>The "all-round carefree package" for digital utilization.</i></p>
    <ul>
      <li><strong>May:</strong> Take photos, publish, tag, and apply facial recognition procedures.</li>
      <li><strong>Should ask:</strong> In very sensitive contexts, briefly check if a specific platform (e.g., Facebook vs. Mastodon) is okay.</li>
      <li><strong>Do not:</strong> Actually nothing – the wish for digital visibility is clearly formulated here.</li>
    </ul>
  </div>
</div>

<div class="ot-row">
  <div class="ot-tag">
    <img src="UploadMe.svg" alt="Upload Me">
  </div>
  <div class="ot-content">
    <h3>2. Upload Me (Yellow)</h3>
    <p><i>Publication yes, tracking no.</i></p>
    <ul>
      <li><strong>May:</strong> Take the photo and post it publicly on the web.</li>
      <li><strong>Should ask:</strong> If you still want to mention the person by name (credits), you should check briefly.</li>
      <li><strong>Do not:</strong> Manual tagging in social networks or enriching with metadata for facial recognition.</li>
    </ul>
  </div>
</div>

<div class="ot-row">
  <div class="ot-tag">
    <img src="BlurMe.svg" alt="Blur Me">
  </div>
  <div class="ot-content">
    <h3>3. Blur Me (Blue)</h3>
    <p><i>Presence yes, identity no.</i></p>
    <ul>
      <li><strong>May:</strong> Photograph the person, <strong>provided</strong> they are made unrecognizable before publication.</li>
      <li><strong>Should ask:</strong> Whether simple pixelation is enough or if the face should be completely "covered."</li>
      <li><strong>Do not:</strong> Publish the original image without editing. Facial recognition algorithms must not run over this under any circumstances.</li>
    </ul>
  </div>
</div>

<div class="ot-row">
  <div class="ot-tag">
    <img src="NoPhotos.svg" alt="No Photos">
  </div>
  <div class="ot-content">
    <h3>4. No Photos (Red)</h3>
    <p><i>The clear boundary.</i></p>
    <ul>
      <li><strong>May:</strong> Point the camera in another direction.</li>
      <li><strong>Should ask:</strong> Nothing. The wish for privacy is absolute.</li>
      <li><strong>Do not:</strong> Any recording of the person. Also no "back views" or "you can only see a little bit" – respect for the wish comes first.</li>
    </ul>
  </div>
</div>

<hr>
<p><i>New (Proposed via Pull Request):</i></p>
<hr>

<div class="ot-row">
  <div class="ot-tag">
    <img src="NameMe.svg" alt="Name Me">
  </div>
  <div class="ot-content">
    <h3>5. Name Me (Purple)</h3>
    <p><i>Visibility for credits.</i></p>
    <ul>
      <li><strong>May:</strong> Photograph and publish.</li>
      <li><strong>Should ask:</strong> Exactly how the naming should be done (real name, callsign, or nickname?).</li>
      <li><strong>Do not:</strong> Publication without clear identification of the author or person depicted. Here's the "deal": photo for fame!</li>
    </ul>
  </div>
</div>

<div class="ot-row">
  <div class="ot-tag">
    <img src="BlurScreen.svg" alt="Blur Screen">
  </div>
  <div class="ot-content">
    <h3>6. Blur Screen (Teal)</h3>
    <p><i>The new standard for tech events.</i></p>
    <ul>
      <li><strong>May:</strong> Photograph the foreground (people, hardware).</li>
      <li><strong>Should ask:</strong> If you are unsure whether a screen in the background shows critical data (code, passwords, emails).</li>
      <li><strong>Do not:</strong> Publish uncensored screen content in the background. Before the image goes online, every monitor in the image area must be made unrecognizable.</li>
    </ul>
  </div>
</div>

---

It is particularly worth noting that the entire project has been consistently published under [CC0 1.0 (Public Domain)](https://creativecommons.org/publicdomain/zero/1.0/). I think it's excellent that these symbols and the underlying idea are truly available to everyone without condition – no legal hurdles, entirely in the spirit of the public good.

```bash
[frank@do3eet-terminal ~]$ systemctl status privacy-awareness
● privacy-awareness.service - Respect for Human Signals
   Active: active (running) since Mon 2026-03-23 13:37:00 CET
```

Offlinetags are a powerful tool to bring the discussion about digital privacy from theory into practice. Which tag will you wear at the next event?

Get typing (or radio me)!

By the way, I will definitely be wearing the **Name Me** and **Blur Screen** tags myself as soon as I find a good way to produce them as high-quality pins or buttons.

And honestly: I actually need a seventh tag: **"Can't handle praise"**... ;)

---

### 📝 Call for Participation: Scientific Survey

Fittingly, there is currently an exciting online survey as part of a collaboration between the **University of Salzburg** and **TU Chemnitz**. It deals with the communication of photo preferences at public events.

*   **Goal:** Understanding attitudes towards taking photos/being photographed and the communication of personal preferences.
*   **Time required:** approx. 5 minutes.
*   **Anonymity:** The survey is completely anonymous.
*   **Deadline:** Participation is possible until **March 28, 2026**.

If you would like to support the research project, you can find the link here:  
👉 **[To the Survey (Limesurvey)](https://bildungsportal.sachsen.de/umfragen/limesurvey/index.php/232125?lang=de)**

Thank you for your support!

```bash
[frank@do3eet-terminal ~]$ logout
```
