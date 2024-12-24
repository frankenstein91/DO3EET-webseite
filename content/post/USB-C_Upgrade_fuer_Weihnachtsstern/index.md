+++
title = 'USB-C Upgrade für Weihnachtsstern'
date = 2024-12-24T09:49:11+01:00
draft = false
author = "Frank Tornack"
tags = [
    "Hardware",
    "USB-C",
    "Löten",
    "alt",
    "Weihnachten",
    "Russland"
]
+++

In meinem Haushalt gibt es noch viel Weihnachtsschmuck aus Russland. Dieser nutzt zwar dem Eurostecker ähnliche Anschlüsse, doch der Trafo für den Weihnachtsstern passt nicht in die Steckdose. In der Vergangenheit, hatte die Familie dafür einen Reiseadapter genutzt. Jetzt ist damit aber Schluss und ich habe mich für moderne Technik entschieden.

# Old Version
Früher wurde der Weihnachtsstern mit einem Spannungswandler betrieben. Dieser steckte wie übliche Schaltnetzteile in einer Steckdose und versorgte die fünf Glühleuchten im Stern.

```goat
                                     ┌───────────┐
                                     │           │
                      ┌──────────────┤ Glühlampe │
                      │              │           │
                      │              └─────┬─────┘
                      │                    │      
                      │              ┌─────┴─────┐
                      │              │           │
                      │              │ Glühlampe │
                      │              │           │
                      │              └─────┬─────┘
┌───────────┐     ┌───┴───┐                │      
│           ├─────┤       │          ┌─────┴─────┐
│ Steckdose │     │ Trafo │          │           │
│           ├─────┤       │          │ Glühlampe │
└───────────┘     └───┬───┘          │           │
                      │              └─────┬─────┘
                      │                    │      
                      │              ┌─────┴─────┐
                      │              │           │
                      │              │ Glühlampe │
                      │              │           │
                      │              └─────┬─────┘
                      │                    │      
                      │              ┌─────┴─────┐
                      │              │           │
                      └──────────────┤ Glühlampe │
                                     │           │
                                     └───────────┘
```

# Upgrade
Über die Daten des alten Netzteil kann ich nur spekulieren, besonders da es nur mit dem Preis in Rubel, der Spannung (input) und der Frequenz beschriftet war und keine weiteren Angaben. Aber ich bin mir sehr sicher, moderne USB-C-Netzteile sind viel effizenter... die Technik steht nie still. Also habe ich entschlossen das Kabel am Trafo geschnitten und die Isolierung über wenige Millimeter enterfernt. Außerdem habe ich mir ein kleines Board organesiert, welches Power Delivery steuern kann. Dieses PCB habe ich im Lötverfahren an den Kabeln angebracht. Da der Stern keine LEDs nutzt, kann ich die Polarität ignoerien. Da die Adern im Kabel sehr dünn waren, habe ich mir einen Trick bei den chineischen Herstellern ausgeliehen... ganz viel Heißkleber auf die Kontakte.

{{< imgwebp src="original_b542fc55-0d5c-4229-9888-c1a8ad6a12aa_PXL_20241224_091728455.jpg" alt="USB-C PD Board" width="1024" height="1024" >}}

```goat
                                     ┌───────────┐
                                     │           │
                      ┌──────────────┤ Glühlampe │
                      │              │           │
                      │              └─────┬─────┘
                      │                    │      
                      │              ┌─────┴─────┐
                      │              │           │
                      │              │ Glühlampe │
                      │              │           │
                      │              └─────┬─────┘
┌───────────┐     ┌───┴───┐                │      
│           ├─────┤       │          ┌─────┴─────┐
│   USB-C   │     │PD-PCB │          │           │
│           ├─────┤       │          │ Glühlampe │
└───────────┘     └───┬───┘          │           │
                      │              └─────┬─────┘
                      │                    │      
                      │              ┌─────┴─────┐
                      │              │           │
                      │              │ Glühlampe │
                      │              │           │
                      │              └─────┬─────┘
                      │                    │      
                      │              ┌─────┴─────┐
                      │              │           │
                      └──────────────┤ Glühlampe │
                                     │           │
                                     └───────────┘
```

Eingestellt habe ich den Adapter auf maximal 20 Volt. Damit lässt sich der Weihnachtsstern nun mit fast jedem Handy-Ladegerät bzw. Powerbank betreiben. Außerdem hält sich nun der Weihnachtsschmuck aus Russland an die [EU Richtlinie 2022/2380](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32022L2380).

# weitere Bilder
{{< imgwebp src="PXL_20241221_125119190.jpg" alt="Im Stern" width="1024" height="1024" >}}

{{< imgwebp src="PXL_20241221_131644252.jpg" alt="der Stern" width="1024" height="1024" >}}

{{< imgwebp src="PXL_20241223_212551198~4.jpg" alt="auf dem Baum" width="1024" height="1024" >}}
