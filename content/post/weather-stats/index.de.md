+++
title = 'Wetterstatistiken meiner Station'
date = "2026-04-26T14:29:54+02:00"
draft = false
author = "Frank Tornack"
tags = [
    "Wetter",
    "Daten",
    "Statistik",
    "Python",
]
+++

In diesem Beitrag werfe ich einen Blick auf die gesammelten Daten meiner Wetterstation. Ich habe die CSV-Exporte bereinigt und in eine SQLite-Datenbank überführt, um vergleichende Statistiken und Diagramme zu erstellen.

Es ist schon erstaunlich, was man so alles sieht, wenn man die Daten über mehrere Jahre (2022 bis heute) hinweg betrachtet. *Wir sind wieder etwas nerdig unterwegs und nutzen Python/Matplotlib für die Visualisierung.*

<!--more-->

Hier sind die vergleichenden Auswertungen der Tageshöchst- und Tiefsttemperaturen für jeden Monat. Die Farben repräsentieren die verschiedenen Jahre:

- **2022**: Violett (Daten ab November)
- **2023**: Grün
- **2024**: Cyan
- **2025**: Pink
- **2026**: Gelb/Orange (Daten bis April)

## Jahresübersichten (Geglättet)

Um einen besseren Überblick über die Trends zu bekommen, zeigt diese Übersicht den Verlauf über das gesamte Jahr. Die Daten wurden geglättet, indem jeder Monat in 5 Segmente (ca. 6-Tage-Schritte) unterteilt wurde. So verschwinden die täglichen "Zacken" und der saisonale Trend wird sichtbar.

In meiner Datenbank finden sich interessante Extremwerte: Der bisher **heißeste Tag** war der **02.07.2025 mit stolzen 36,2 °C**. Auf der anderen Seite steht der **11.01.2026** als kältester Rekordhalter mit frostigen **-17,7 °C**.

![Jahresübersicht Höchstwerte](year_overview_max.svg)

Bei den Durchschnittstemperaturen sieht man gut, dass das Jahr 2024 mit einem Schnitt von ca. 11,5 °C leicht über dem Jahr 2023 (11,2 °C) lag.

![Jahresübersicht Durchschnitt](year_overview_avg.svg)
![Jahresübersicht Tiefstwerte](year_overview_min.svg)

## Niederschlag im Vergleich

Neben der Temperatur ist der Regen eine der wichtigsten Kenngrößen. Besonders in Erinnerung geblieben ist der **Dezember 2023**, der mit insgesamt **122,4 mm** Niederschlag der nasseste Monat in meiner Aufzeichnung ist.

Die Diagramme zeigen die monatliche Gesamtmenge sowie die Anzahl der Tage, an denen es geregnet hat (mindestens 0,1 mm). Man sieht deutlich, dass 2024 insgesamt ein recht "nasses" Jahr war, verglichen mit den anderen.

![Monatliche Regenmenge](year_overview_rain_total.svg)
![Anzahl der Regentage](year_overview_rainy_days.svg)

## Sonnenschein im Vergleich

Wie viele Stunden zeigt sich die Sonne? Als "Sonnenstunde" werte ich hierbei jeden Zeitraum, in dem die Lichtintensität an der Station mindestens 20 klux erreicht hat. Das ist ein guter Indikator für direkten Sonnenschein oder zumindest einen sehr hellen Himmel.

Das bisher **sonnigste Jahr war 2024** mit insgesamt **1.421 Sonnenstunden**. Im Diagramm unten sieht man die geglätteten Tagesschnitte pro Monat.

![Jahresübersicht Sonnenstunden](year_overview_sun.svg)

## Monatliche Detailansichten

Wer es genauer wissen will, findet hier die ungeschönten Tageswerte im direkten Vergleich der Jahre. Hier sieht man auch die Lücken in den Daten, falls die Station mal keine Lust auf das Loggen hatte oder der Server Schluckauf hatte.

### Januar
![Januar Höchstwerte](temp_max_01_januar.svg)
![Januar Durchschnitt](temp_avg_01_januar.svg)
![Januar Tiefstwerte](temp_min_01_januar.svg)
![Januar Sonnenstunden](sun_hours_01_januar.svg)

### Februar
![Februar Höchstwerte](temp_max_02_februar.svg)
![Februar Durchschnitt](temp_avg_02_februar.svg)
![Februar Tiefstwerte](temp_min_02_februar.svg)
![Februar Sonnenstunden](sun_hours_02_februar.svg)

### März
![März Höchstwerte](temp_max_03_märz.svg)
![März Durchschnitt](temp_avg_03_märz.svg)
![März Tiefstwerte](temp_min_03_märz.svg)
![März Sonnenstunden](sun_hours_03_märz.svg)

### April
![April Höchstwerte](temp_max_04_april.svg)
![April Durchschnitt](temp_avg_04_april.svg)
![April Tiefstwerte](temp_min_04_april.svg)
![April Sonnenstunden](sun_hours_04_april.svg)

### Mai
![Mai Höchstwerte](temp_max_05_mai.svg)
![Mai Durchschnitt](temp_avg_05_mai.svg)
![Mai Tiefstwerte](temp_min_05_mai.svg)
![Mai Sonnenstunden](sun_hours_05_mai.svg)

### Juni
![Juni Höchstwerte](temp_max_06_juni.svg)
![Juni Durchschnitt](temp_avg_06_juni.svg)
![Juni Tiefstwerte](temp_min_06_juni.svg)
![Juni Sonnenstunden](sun_hours_06_juni.svg)

### Juli
![Juli Höchstwerte](temp_max_07_juli.svg)
![Juli Durchschnitt](temp_avg_07_juli.svg)
![Juli Tiefstwerte](temp_min_07_juli.svg)
![Juli Sonnenstunden](sun_hours_07_juli.svg)

### August
![August Höchstwerte](temp_max_08_august.svg)
![August Durchschnitt](temp_avg_08_august.svg)
![August Tiefstwerte](temp_min_08_august.svg)
![August Sonnenstunden](sun_hours_08_august.svg)

### September
![September Höchstwerte](temp_max_09_september.svg)
![September Durchschnitt](temp_avg_09_september.svg)
![September Tiefstwerte](temp_min_09_september.svg)
![September Sonnenstunden](sun_hours_09_september.svg)

### Oktober
![Oktober Höchstwerte](temp_max_10_oktober.svg)
![Oktober Durchschnitt](temp_avg_10_oktober.svg)
![Oktober Tiefstwerte](temp_min_10_oktober.svg)
![Oktober Sonnenstunden](sun_hours_10_oktober.svg)

### November
![November Höchstwerte](temp_max_11_november.svg)
![November Durchschnitt](temp_avg_11_november.svg)
![November Tiefstwerte](temp_min_11_november.svg)
![November Sonnenstunden](sun_hours_11_november.svg)

### Dezember
![Dezember Höchstwerte](temp_max_12_dezember.svg)
![Dezember Durchschnitt](temp_avg_12_dezember.svg)
![Dezember Tiefstwerte](temp_min_12_dezember.svg)
![Dezember Sonnenstunden](sun_hours_12_dezember.svg)
