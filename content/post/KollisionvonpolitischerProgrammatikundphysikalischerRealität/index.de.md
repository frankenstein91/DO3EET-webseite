+++
title = 'Kollision von politischer Programmatik und physikalischer Realität'
date = 2025-11-24T09:55:45+01:00
draft = false
author = "Frank Tornack"
tags = [
    "Deutschland",
    "Politik",
    "Meinung",
    "Energie",
    "Solar",
    "Strom",
]
+++

In der zeitgenössischen Debatte zur Energiewende in Deutschland ist eine zunehmende Divergenz zwischen politischer Willensbildung und technisch-physikalischer Machbarkeit zu beobachten. Der jüngste Vorschlag der Partei Bündnis 90/Die Grünen, der unter dem Begriff „Solarbonus“ oder „Gratis-Strom“ firmiert, stellt hierbei einen bemerkenswerten Fall dar, der einer rigorosen Analyse aus der Perspektive der Informatik und der Naturwissenschaften bedarf. Der Vorschlag, entwickelt unter anderem durch den ehemaligen Direktor der Agora Energiewende, Simon Müller, sieht vor, privaten Haushalten ein Kontingent von bis zu 600 Stunden pro Jahr an „kostenlosem“ Strom zur Verfügung zu stellen, primär in Zeiten hoher photovoltaischer Einspeisung im Sommer. Das erklärte Ziel ist die Incentivierung von Lastverschiebungen in Zeiten des Überflusses, um Abregelungen von Erneuerbaren Energien zu vermeiden und fossile Kraftwerke in den Randzeiten zu verdrängen.[^1]

Mein Fokus liegt exklusiv auf der Betrachtung des deutschen Stromnetzes als cyber-physisches System (CPS). Ein CPS ist definiert durch die tiefgreifende Verschränkung von physikalischen Prozessen und informationstechnischen Steuerungskomponenten.

Der Vorschlag suggeriert eine algorithmische Einfachheit – `if (sun_shines) then (price = 0)` – die ich bei näherer Betrachtung der Systemarchitektur nur als **katastrophal** bezeichnen kann. Ich werde aufzeigen, warum die Implementierung dieses deterministischen Signals in ein stochastisch ausgelegtes Netzdesign zwangsläufig zu dem führt, was ich als „System Failure“ klassifiziere.

## Physikalische Grundlagen
### Mein Problem mit der Verwechslung von Arbeit und Leistung
Das fundamentale Missverständnis, das ich in diesem Vorschlag sehe, beginnt bei den Einheiten. Die politische Elite operiert mit Energie (kWh), während ich als Techniker weiß, dass das Netz durch Leistung (Watt) limitiert wird.Energie (E) ist für mich die Fähigkeit, Arbeit zu verrichten, Leistung (P) ist die Rate.

\[
E = \int_{t_1}^{t_2} P(t) \, dt
\]
\[
P(t) = \frac{dE}{dt}
\]

Das ist keine Haarspalterei meinerseits. Ein Kabel hat keine Energiekapazität, sondern eine Leistungskapazität. Die Belastungsgrenzen der Infrastruktur werden durch die momentane Leistung bestimmt. Wenn der Solarbonus mir 600 Stunden Energie verspricht, interessiert das mein Netz nicht. Das Netz spürt nur die Amplitude der Leistung. Ich sehe hier die Gefahr, dass wir die Maximierung der Leistung in einem engen Zeitfenster incentivieren – Gift für ein Netz, das auf Statistik ausgelegt ist.



[^1]: [Tagesspiegel: Vorschlag vor Parteitag: Grüne wollen 600 Stunden Gratis-Strom für alle](https://www.tagesspiegel.de/politik/vorschlag-vor-parteitag-grune-wollen-600-stunden-gratis-strom-fur-alle-14854589.html)