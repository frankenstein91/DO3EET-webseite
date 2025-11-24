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

### Gleichzeitigkeitsfaktor
In der Netzplanung rechnet man mit dem Gleichzeitigkeitsfaktor (Simultaneity Factor, SF).
\[
SF = \frac{P_{max, \text{gleichzeitig}}}{\sum P_{nenn}}
\]
Normalerweise liegt dieser Faktor unter `0,1`, weil man davon ausgeht, dass nicht alle meine Nachbarn gleichzeitig den Herd einschalten oder die Kreissäge starten. Der Solarbonus zerstört diese Statistik. Er synchronisiert das Verhalten. Wenn ich und Millionen andere unsere E-Autos so programmieren, dass sie beim Preis **Zero** laden, mache ich aus Zufall Determinismus. Der SF nähert sich `1` an. Viele Analysen zeigen: Das Netz ist dafür nicht ausgelegt. Andere[^2] und ich sehen hier nicht nur eine theoretische Überlastung, sondern eine reale Gefahr für die Komponenten.

### Die Ohmsche Realität
Ich muss auch an das Ohmsche Gesetz erinnern.
\[
\Delta U \approx I \cdot R \cdot \cos \phi + I \cdot X \cdot \sin \phi
\]
Wenn durch den Solarbonus alle in meiner Straße gleichzeitig laden (hohe Stromstärke), fällt die Spannung massiv ab (Brownout[^3]). Scheint die Sonne und alle speisen ein, steigt die Spannung, und meine Wechselrichter schalten wegen Überspannung (Spannung > 253 V) ab.

- Szenario A: Spannung zu hoch \(\rightarrow\) Mein Wechselrichter schaltet ab \(\rightarrow\) Kein „Gratis-Strom“.
- Szenario B: Signal „Gratis“ kommt \(\rightarrow\) Last springt an \(\rightarrow\) Spannung bricht ein \(\rightarrow\) Geräteausfall.

## Thermodynamik
Man hört oft, Leitungen seien passiv. Das ist falsch. Ihre Lebensdauer hängt an der Temperatur.

### Ortsnetztransformator
Der Transformator in meiner Straße ist meist ölgekühlt. Seine Lebensdauer[^4] halbiert sich bei ca. 6 Kelvin Temperaturerhöhung. Der Solarbonus legt die Lastspitzen genau in den Sommermittag. Das ist thermodynamisch der denkbar schlechteste Zeitpunkt. Wenn ich nun durch den „Gratis-Strom“-Anreiz den Trafo genau dann maximal belaste, riskiere ich Gasblasen im Öl und die Hydrolyse des Isolierpapiers. Ich sehe hier, wie wir für ein kurzfristiges Preissignal die Lebensdauer unserer teuersten Assets opfern.

### unsichtbare Last
Dazu kommen Blindleistung und Oberschwingungen. Meine Leistungselektronik (EV-Lader, Wechselrichter) belastet das Netz auch, wenn ich rechnerisch (Wirkleistung) bei Null bin.
\[
S = \sqrt{P^2 + Q^2}
\]

## informationstechnische Leere
Wechseln wir die Disziplin. Damit ich 600 Stunden im Jahr abrechnen kann, brauche ich Daten. Ich habe mir den Status Quo angesehen.

### Smart Meter
Ich brauche zwingend intelligente Messsysteme (iMSys). Die Zahlen der Bundesnetzagentur (Stand 2024/2025) sind ernüchternd.  
Das heißt für mich: Für über 95% der Haushalte ist der Vorschlag technisch nicht umsetzbar. Ohne Messung keine Steuerung. Eine Schätzung über Standardlastprofile (SLP) wäre für mich reines Voodoo und würde den physikalischen Zweck der Netzstabilisierung verfehlen.
Angenommen, wir hätten 40 Millionen Smart Meter.
\[40.000.000 \times 96 \text{ Werte/Tag} \approx 4 \text{ Milliarden Datensätze/Tag}\]
Ich kenne die IT-Landschaft der Versorger. Viele laufen auf alten SAP IS-U Systemen. Ein solcher Datenstrom käme einem DDoS-Angriff gleich. Ich bezweifle stark, dass die Backend-Systeme diese Latenzzeiten bewältigen können, um eine Echtzeit-Steuerung zu ermöglichen.
Ich sehe hier das „Thundering Herd“ Problem. Wenn eine zentrale App das Signal „JETZT GRATIS“ sendet, stürmen Millionen Anfragen auf die API der Wallbox-Hersteller ein. Ich prophezeie API-Crashes. Schlimmer noch: Wenn das Netz überlastet ist, kommt der „Stop“-Befehl wegen der Latenz zu spät. **Und wer bezahlt dann die falschen Messungen?**

### Cybersecurity
Der Solarbonus zwingt mich in ein System der totalen Überwachung. Grüße an die EU: **erwischt!**

Ich weiß, dass hochauflösende Lastgänge verraten, welches Fernsehprogramm ich schaue. Das ist ein Side-Channel Attack. Der Solarbonus zwingt mich ökonomisch dazu, diese Daten preiszugeben. Ich sehe hier riesige zentrale Datenbanken entstehen.

Mein größtes **Sicherheitsbedenken** ist aber cyber-kinetischer Natur. Wir vernetzen Millionen leistungsstarke Verbraucher. Wenn es einem Angreifer gelingt, das zentrale Preissignal zu fälschen („Strom gratis“), erzeugt er eine Flash Crowd. Millionen Geräte schalten gleichzeitig ein. Ich sehe das Risiko eines Frequenzabfalls und regionaler Blackouts. **Wir bauen hier die perfekte Waffe für einen Angreifer**. Hier gehen meine Grüße an Russland, China und Nord Korea...  

Zwar ist das Smart Meter Gateway "sicher" (BSI-zertifiziert). Aber meine 20-Euro-WLAN-Steckdose ist es nicht. Der Solarbonus incentiviert billige Vernetzung. Ich erwarte eine Flut **unsicherer IoT-Geräte** plus die vom Staat als sicher betrachteten Smart Meter, die als Einfallstor dienen.

## Der Deadlock
Ich sehe einen logischen Fehler im Design, wenn ich den §14a EnWG betrachte...
Der §14a erlaubt dem Netzbetreiber, mich auf 4,2 kW zu dimmen, wenn es eng wird. Hier kollidieren zwei Welten:
1. Markt (Solarbonus): „Lade jetzt voll! Es ist umsonst!“
2. Physik (§14a): „Halt! Überlastung! Dimmen!“
3. Jeder Informatiker: Ahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh! Fuck!!!!

Ich sehe ein Oszillations-Problem (Hunting) auf uns zukommen: Preis 0 --> Last hoch --> Netz voll --> Dimmung an --> Last runter --> Netz frei --> Dimmung aus --> Last hoch.
Das ist ein instabiler Regelkreis.

## Schlussworte
Zu guter Letzt noch ein persönliches Ärgernis, bei dem sich mir als Techniker die Nackenhaare aufstellen: Die Sache mit den Einheiten. Es macht mich wahnsinnig, wenn in politischen Papieren von „Stromverbrauch in Stunden“ gefaselt wird. Freunde, wir bezahlen für Energie, nicht für Zeit! Stromverbrauch misst man verdammt nochmal in Kilowattstunden (kWh), nicht in Stunden auf der Uhr.

Der Vorschlag „600 Stunden Gratis-Strom“ ist physikalischer Unsinn. Eine Stunde, in der ich mein E-Auto mit 22 kW lade, ist energetisch und finanziell eine völlig andere Liga als eine Stunde, in der nur meine LED-Nachttischlampe mit 5 Watt brennt. Mir „Stunden“ zu schenken, ist so präzise wie das Angebot „10 Minuten Tanken zum Festpreis“ – völlig egal, ob ich dabei mit einer Pipette tröpfle oder einen Feuerwehrschlauch in den Tank halte. 

Wer den Unterschied zwischen der Zeitachse und der Fläche unter der Kurve (Arbeit W=P⋅t) nicht verstanden hat, sollte vielleicht nochmal das Physikbuch der 7. Klasse aufschlagen, bevor er Gesetze für die Energiewende schreibt.

[^1]: [Tagesspiegel: Vorschlag vor Parteitag: Grüne wollen 600 Stunden Gratis-Strom für alle](https://www.tagesspiegel.de/politik/vorschlag-vor-parteitag-grune-wollen-600-stunden-gratis-strom-fur-alle-14854589.html)
[^2]: [OutdoorChiemgau: Systemstabilitätsbericht Stromnetz 2025 - Der Killer für Solar und Wind?](https://youtu.be/RZN0aGpCB4I?si=9xrIJOudrW7pW1pf)
[^3]: [Photovoltaik raymann: Erklärung des Begriffs Brownout](https://youtu.be/FoZiAq-oMH4?si=50v9uL0L4LAGCLFg)
[^4]: [Ankundigung 2017 Transformatoralterung](https://ront.info/ankundigung-transformatoralterung/)