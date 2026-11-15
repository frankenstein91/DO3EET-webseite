+++
title = 'The 15-Minute Power Outage in Kleinbothen (2025-11-09)'
date = 2025-11-09T17:33:44+01:00
author = "Frank Tornack"
tags = [
    "Saxony",
    "Energy",
]
+++

On Sunday morning, November 9, 2025, we experienced a brief yet puzzling power outage here in Kleinbothen (Grimma). At 07:45 AM sharp, the lights went out, and exactly 15 minutes later, at 08:00 AM, power came right back.

While such a short blackout often goes unnoticed or gets brushed off as a quick "flicker," modern home energy management systems keep incorruptible receipts. A glance at my Sonnen battery dashboard (see image) confirms the incident down to the second.
<!-- more -->
{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/Stromausfall20251109/Screenshot_20251109-172057.png" alt="Screenshot of the Sonnen app" width="1000" height="1000" >}}

The daily energy flow chart shows a clean gap: all grid draw and consumption (shown by the colored lines and gray base-load area) plummet abruptly to zero at 07:45 AM. For exactly 15 minutes, there is complete "digital silence" before the system registers voltage returning at 08:00 AM and normal operation resumes.

## What Caused It?
An interesting question, since there were no public outage notices for this specific time window.
1. External factors: A quick check turned up no plausible external causes. There were no severe weather warnings for the Leipzig district. Reported accidents on the nearby A14 autobahn or local fire department dispatches didn't line up with the exact timing of the outage either.
2. Public reports: The online outage portals of the responsible grid operator, MITNETZ STROM, showed neither an active nor a logged disruption for Grimma/Kleinbothen.

## The Most Likely Explanation
The exact 15-minute duration is the smoking gun. That timeframe is textbook for a remote switching operation by the grid control center.  
The most probable scenario:
- 07:45 AM: Somewhere on MITNETZ STROM's regional medium-voltage grid, a technical fault occurred (such as a ground fault or cable failure).
- Result: Automatic protection relays tripped and safely disconnected the entire circuit serving Kleinbothen.
- 07:45 – 08:00 AM: Technicians in the central control room pinpointed the fault, isolated the damaged grid segment, and rerouted power to the intact sections.
- 08:00 AM: The switchover succeeded, Kleinbothen was back on the grid, and I was promptly woken up by my hard drives spinning back up.
