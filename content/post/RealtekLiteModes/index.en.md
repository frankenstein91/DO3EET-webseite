+++
title = 'Realtek Lite Modes'
date = 2025-02-15T18:23:43+01:00
draft = false
author = "Frank Tornack"
tags = [
    "Hardware",
    "Networking",
]
+++

I bought a NIC built around the RTL8157 chip and noticed its proprietary "Lite Modes." When I went looking for details on how they actually work, I found surprisingly little documentation—so I'm collecting my findings here in one place. Hopefully this post can stay "alive" and grow over time through the comments section.

# What are Realtek Lite Modes?
Realtek's Lite Modes are special operating modes that run at a reduced link speed compared to their full standard counterparts.
According to the documentation, these modes only use two wire pairs—specifically the A and B pairs. The one exception is GIGA Lite, which manages with just a single pair (two wires).
Since the chip supports automatic detection and correction of swapped wire pairs, in theory any four working wires ought to do the trick.

|  Mode Name  | Data Rate | Required Wires |
|:-----------:|:---------:|:--------------:|
| 5G Base-T   | 5 Gbps    | 8              |
| 5G Lite     | 2.5 Gbps  | 4              |
| 2.5G Base-T | 2.5 Gbps  | 8              |
| 2.5G Lite   | 1 Gbps    | 4              |
| 1000 Base-T | 1 Gbps    | 8              |
| GIGA Lite   | 500 Mbps  | 2              |
| 100BASE-TX  | 100 Mbps  | 4              |
| 10BASE-T    | 10 Mbps   | 4              |

# What are these modes actually good for?
Lite Modes offer a budget-friendly way to squeeze higher speeds out of aging networks without ripping out and upgrading all the cabling. With a bit of creative crimping and Lite Modes, you could probably even split a single 8-wire Ethernet cable across two separate links.
