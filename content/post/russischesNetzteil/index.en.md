+++
title = 'Russian Power Supply'
date = 2025-01-05T13:52:12+01:00
draft = false
author = "Frank Tornack"
tags = [
    "Hardware",
    "Soldering",
    "Vintage",
    "Christmas",
    "Russia",
    "Hobby",
]
+++

After everything worked out nicely over Christmas with the tree and my USB-C Christmas star, I had an old unused power supply sitting on my desk. You can read all about what I did there in [USB-C Upgrade for a Christmas Tree Star]({{< ref "/post/USB-C_Upgrade_fuer_Weihnachtsstern" >}}). In that post, I was still assuming it was a transformer... by now, I know better. Here's a quick peek at what I actually found inside.
<!--more-->

# Capacitive Power Supply
Inside that classic black brick—the kind that plugs straight into the wall and puts all its weight on the prongs—I surprisingly found neither coils nor an iron core. For this Russian contraption, they went with a capacitive dropper power supply. That said, I've never seen this particular circuit layout before.

```goat
                  ┌─────────────┐                                                  
                  │             │                                                  
                  │  Capacitor  │                                      ┌──────────┐
                  │             │                                      │     💡    │
                  └─┬─────────┬─┘                                      │          │
                    │         │                                        │     💡    │
                    │         │                                        │          │
                    │         ├─────────────────────────┬──────────────┤          │
               ┌────┤         │                         │              │          │
               │  ┌─┴─────────┴─┐                    ┌──┴──────────┐   │     💡    │
               │  │             │                    │             │   │          │
               │  │  Capacitor  │  ┌─────────────┐   │  Capacitor  │   │          │
               │  │             │  │             │   │             │   │     💡    │
               │  └─────────────┘  │  Resistor   │   └──┬──────────┘   │          │
┌───────────┐  │                 ┌─┤             ├──────┤              │     💡    │
│           ├──┴─────────────────┘ └─────────────┘      ├──────────────┤          │
│  Socket   │                                           │              │     💡    │
│           ├───────────────────────────────────────────┘              └──────────┘
└───────────┘                                                                      

```

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/russischesNetzteil/PXL_20250105_103624439.jpg" alt="Opened capacitive power supply" width="1024" height="1024" >}}

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/russischesNetzteil/PXL_20250105_103708319.jpg" alt="Opened capacitive power supply" width="1024" height="1024" >}}

One of the capacitors inside the PSU acts as capacitive reactance, limiting current flow from the 230V mains supply. The capacitor's value determines how tightly the current is choked. I suspect another one shifts the phase of the current relative to the voltage, which cuts the power delivered to the bulbs and dims them down. The resistor is there for protection, limiting inrush current spikes and shielding the bulbs from overvoltage.

Capacitive power supplies for incandescent bulbs used to be pretty common for dimming lights or extending bulb lifespan.

## Warning About Capacitive Power Supplies
Capacitive power supplies offer **no galvanic isolation** from the **230V** mains grid. That means the bulbs and every single part connected to the supply are live at mains voltage. On top of that, capacitive droppers can emit electromagnetic interference that disrupts other nearby electronics.
