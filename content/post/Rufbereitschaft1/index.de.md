+++
title = 'Rufbereitschaftsplanung goes Python'
date = 2024-10-13T15:35:13+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Informatik",
    "IT",
    "Personalplanung",
    "Best Practices",
]
+++

Wie in meinem letzen Artikel auf dieser Seite, geht es auch diesmal nicht um Funken oder das Reisen... sondern ich will mal wieder etwas die Arbeit für einige Menschen in der IT erleichtern. Alle Jahre wieder am Ende des jahres steht für viele Teamleite (oder meist deren Stellvertreter) die Planung der Bereitschaftsdienste ins Haus. Bei dieser Planung gibt es einge Hindernisse, wie Meldefristen an den Betriebsrat oder auch Informationsfristen an die Mitarbeiter. Aus meiner eigenen Erfahrung, gibt es hier oft Konflikte zwischen den Forderungen der Betriebsräte und was Mitarbeiter vielleicht übersichtlicher finden. So habe ich auch schon den Wechsel von Excel zum online TeamCal und zurück zu Excel hinter mir, da der Export des Tools dem Betriesrat nicht gefallen hat oder ähnliches.

Jedes Jahr einen neuen Kalender in Excel bauen und um die 20 Benutzer in 12 Tabellenblätter zu übernehmen, finde ich weder effizent, noch wirklich einem Informatiker gerecht. Mit etwas Python, kann man zumindest die Erstellung der Tabelle einfach automatesieren. Mit etwas mehr Anstrengung, ist es dann auch möglich die Rufbereitschaften schon zu verteilen.

```python
#!/usr/bin/env python3
import calendar
import argparse
from datetime import date, timedelta
import xlsxwriter


def numToDayShort(num):
    weekdays_short = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    return weekdays_short[num]


def numToMonth(num):
    months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]
    return months[num - 1]


def main():
    workerNames = ["Frank Tornack", "Meister Kollege", "Walter Hugo", "Dr. Der Da"]
    workbook = xlsxwriter.Workbook("TestRB.xlsx")
    centerformat = workbook.add_format()
    centerformat.set_align("center")
    centerformat.set_bold()
    centerformat.set_font_name("Courier New")
    wecenterformat = workbook.add_format()
    wecenterformat.set_align("center")
    wecenterformat.set_bold()
    wecenterformat.set_font_color("#FF0000")
    wecenterformat.set_font_name("Courier New")
    boldonlyformat = workbook.add_format()
    boldonlyformat.set_bold()
    calyear = date.today().year
    calyear += 1
    Calobj = calendar.Calendar()
    currentWorker = -1
    daysFromLast = {}
    for month in range(1, 12 + 1):
        col = 0
        namerowcounter = 2
        worksheet = workbook.add_worksheet(numToMonth(month))

        for workerName in workerNames:
            worksheet.write(namerowcounter, col, workerName, boldonlyformat)
            if not workerName in daysFromLast:
                daysFromLast[workerName] = 0
            namerowcounter += 1
        worksheet.autofit()
        for day in Calobj.itermonthdays4(calyear, month):
            col += 1
            if month == day[1]:
                if currentWorker == -1:
                    currentWorker = 0
                elif day[3] == 0:
                    print("Monday")
                    currentWorker += 1
                    if currentWorker >= len(workerNames):
                        print("back to first")
                        currentWorker = 0
            for key in daysFromLast:
                if key == workerNames[currentWorker]:
                    daysFromLast[key] = 0
                else:
                    daysFromLast[key] += 1
            worksheet.write(2 + currentWorker, col, "RB")
            print(day)
            print(daysFromLast)
            worksheet.set_column(col, col, 4)
            if day[3] <= 4:
                worksheet.write(0, col, day[2], centerformat)
                worksheet.write(1, col, numToDayShort(day[3]), centerformat)
            else:
                worksheet.write(0, col, day[2], wecenterformat)
                worksheet.write(1, col, numToDayShort(day[3]), wecenterformat)

    workbook.close()


if __name__ == "__main__":
    main()
```

Mein kleines Skript macht aktuell nicht viel... Es erstellt eine XLSX-Datei, die zu Microsoft kompatibel ist und befüllt diese. Dabei wird für jeden Monat ein Tabellenblatt angelegt und der Vor- und Nachlauf des Monats mit beachtet. In jeder ersten Spalte werden die Namen der Mitarbeiter hinterlegt. Da ich in der aktuellen Version noch keine Argumente für das Skript erarbeitet habe, muss dies noch im Array workerNames im Quellcode geändert werden. Auch der Dateiname der Ausgabedatei, ist eine Zeile tiefer im Quellcode und kann geändert werden. 

Das Skript zählt auch die Tage seit der letzten Rufbereitschaft... aktuell aber nur für die Ausgabe auf die Console, später möchte ich gern noch eine Dynamik einbauen um Urlaube, Feiertage in bestimmten Bundesländern und Geburtstage zu berücksichtigen. Ab dann wird es unabdigbar mit den Abständen eine Gerechtigkeit in den Plan einzubauen und nicht die Mitarbeiter einfach zu überspringen. Sollte ich zur Umsetzung kommen, werde ich dies in einem neuen Artikel veröffentlichen.

Habt Ihr andere Ideen, was noch fehlt... gern unten in die Kommentare.