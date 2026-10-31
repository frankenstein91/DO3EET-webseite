+++
title = 'russisches Netzteil'
date = 2025-01-05T13:52:12+01:00
draft = false
author = "Frank Tornack"
tags = [
    "Hardware",
    "Löten",
    "alt",
    "Weihnachten",
    "Russland",
    "Hobby",
]
+++

Nachdem Weihnachten alles mit dem Tannenbaum und dem USB-C-Weihnachtsstern geklappt hat, lag ein altes ungenutztes Netzteil bei mir auf dem Tisch. Was ich da gemacht habe, kann man gut im [USB-C Upgrade für Weihnachtsstern]({{< ref "/post/USB-C_Upgrade_fuer_Weihnachtsstern" >}}) nachlesen. In diesem Artikel, bin ich noch von einem Trafo ausgegangen... doch unterdessen weiß ich es besser. Hier ein kleiner Einblick, was ich gefunden habe.
<!--more-->

# Kondensatornetzteil
Im inneren des typischen schwarzen Block, der in der Steckdose steckt und die Kontakte mit seinem gesamten Gewicht belastet, fand ich wider Erwarten keine Spulen und einen Eisenkern. Bei diesem Konstrukt aus Russland hat man sich für ein Kondensatornetzteil entschieden. Gesehen habe ich aber diese Art der Schaltung noch nie.

```goat
                  ┌─────────────┐                                                  
                  │             │                                                  
                  │ Kondensator │                                      ┌──────────┐
                  │             │                                      │     💡    │
                  └─┬─────────┬─┘                                      │          │
                    │         │                                        │     💡    │
                    │         │                                        │          │
                    │         ├─────────────────────────┬──────────────┤          │
               ┌────┤         │                         │              │          │
               │  ┌─┴─────────┴─┐                    ┌──┴──────────┐   │     💡    │
               │  │             │                    │             │   │          │
               │  │ Kondensator │  ┌─────────────┐   │ Kondensator │   │          │
               │  │             │  │             │   │             │   │     💡    │
               │  └─────────────┘  │ Wiederstand │   └──┬──────────┘   │          │
┌───────────┐  │                 ┌─┤             ├──────┤              │     💡    │
│           ├──┴─────────────────┘ └─────────────┘      ├──────────────┤          │
│ Steckdose │                                           │              │     💡    │
│           ├───────────────────────────────────────────┘              └──────────┘
└───────────┘                                                                      

```

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/russischesNetzteil/PXL_20250105_103624439.jpg" alt="geöffnetes Kondensatornetzteil" width="1024" height="1024" >}}

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/russischesNetzteil/PXL_20250105_103708319.jpg" alt="geöffnetes Kondensatornetzteil" width="1024" height="1024" >}}

Einer der Kondensatoren im Netzteil wirkt als kapazitiver Widerstand. Dieser Widerstand begrenzt den Stromfluss von der 230V Netzspannung. Die Größe des Kondensators bestimmt, wie stark der Strom begrenzt wird. Ich denke ein weiterer er Kondensatoren verschiebt die Phase des Stroms gegenüber der Spannung. Dadurch wird der Stromfluss zur Glühbirne begrenzt und die Helligkeit reduziert. Der Widerstand dient zum Schutz. Er begrenzt den Einschaltstromstoß und schützt die Leuchtmittel vor Überspannungen.

Kondensatornetzteile für Glühbirnen wurden früher oft verwendet, um die Helligkeit von Lampen zu dimmen oder die Lebensdauer zu verlängern.

## Warnung zu Kondensatornetzteilen
Kondensatornetzteile bieten **keine galvanische Trennung** vom Stromnetz mit den üblichen **230V**. Das bedeutet, dass die Lampen und alle mit dem Netzteil verbundenen Teile unter Netzspannung stehen. Außerdem können Kondensatornetzteile elektromagnetische Störungen verursachen, die andere elektronische Geräte beeinträchtigen können.

