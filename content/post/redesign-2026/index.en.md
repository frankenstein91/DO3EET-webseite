+++
title = 'System Log: Redesign Successfully Deployed to Production'
date = 2026-03-20T20:00:00+01:00
draft = false
author = "Frank Tornack"
tags = [
    "Website",
    "Linux",
    "Design",
    "Hobby",
]
+++

```bash
[frank@do3eet-terminal ~]$ git checkout redesign
[frank@do3eet-terminal ~]$ git merge master
[frank@do3eet-terminal ~]$ deploy --force-coolness
```

If you briefly wondered while loading the page whether you accidentally landed on a 90s mainframe via SSH: **Don't worry, it's completely intentional!**

I've spent the last few days giving my digital home a complete makeover. Moving away from "standard website" towards a design that reflects my passions: Linux, technology, and a healthy dose of science fiction.

## What's New in the Terminal?

### 1. The Matrix Has You (and Your Browser)
The new design goes all-in on **Matrix Green on Tokyo Night Blue**. There are now subtle scanlines, a blinking cursor, and a layout that feels like a directory tree (`tree`).

A special technical treat: Take a look at the header of the terminal window. It displays a dynamic prompt that recognizes which browser you're using (e.g., `[Firefox@do3eet.pages.dev /var/www]#`). A small client-side JavaScript makes it possible – completely local and without data storage, of course.

### 2. The Great Inventory (Tag Cleanup)
I must admit: my keywords (tags) had become a bit... messy over time. I've cleaned up!
- Many granular tags have been consolidated (e.g., everything related to messengers, networking, or culinary topics).
- The new **"Hobby"** category is now packed with my DIY projects – from USB-C soldering on a Christmas star to my keyboard's QMK firmware adventure.

### 3. Digital Treasures and Easter Eggs
I couldn't resist building in a few small surprises:
- **Achievement Unlocked:** If you leave the page open for more than 5 minutes (perhaps while cozily reading a Japan report?), you'll receive a small homage to old CRT monitors. No, your screen isn't breaking; it's just a "simulated burn-in".
- **The Ark of Truth:** Stargate fans should scroll all the way to the bottom... but be careful, *Origin* is the source of truth.

## Why All This?
As an IT professional and ham radio operator, I spend a lot of time in terminals. So why should my blog look any different? The new look is faster, more focused, and still offers plenty of space for my travel photos from Hokkaido or Tokyo.

How do you like the new look? Leave me a comment (or radio me) – I'm looking forward to your feedback!

```bash
[frank@do3eet-terminal ~]$ exit
logout
Connection to do3eet.pages.dev closed.
```
