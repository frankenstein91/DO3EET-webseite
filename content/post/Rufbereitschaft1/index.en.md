+++
title = 'On-call duty planning goes Python'
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

Alright, steering clear of the usual sparks and travelogues this time around! Instead, I'm diving back into a mission I'm passionate about: making life a little less of a grind for those of us in the IT trenches.

You know the drill. As the year winds down, that familiar beast slouches into view for countless team leads (or, let's be honest, usually their deputies): the dreaded on-call duty roster planning. What sounds like a straightforward task is, in reality, a minefield. We're talking about navigating the treacherous waters of works council notification deadlines on one hand, and keeping your actual team members clued in without mass confusion on the other.

Believe me, I've been there. I've witnessed firsthand the classic standoff between the official demands of the works council and what employees actually find clear and usable. I’ve personally ridden the rollercoaster from trusty old Excel to a sleek online team calendar... and right back to Excel, all because the tool's export format didn't quite get the works council's seal of approval, or some other similar bureaucratic joy. It’s a recurring headache, and this time, I want to explore it further.

Just picture the annual slog: manually constructing a new Excel calendar from scratch, then meticulously wrestling the details for around 20 users across 12 separate worksheets. Let's be honest, it's not just mind-numbingly inefficient; it’s an approach that feels beneath anyone who's spent time in the IT field. But here’s where a bit of ingenuity can shine: with a touch of Python, you can at least automate the entire, tedious creation of that table structure. And if you're willing to invest a little more effort, you could even get Python to take on the initial heavy lifting of distributing those on-call duties.

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

So, what’s my little Python script capable of right now? Well, it's still a fledgling, but it already rolls up its digital sleeves to:
 - Whip up a fully Microsoft-compatible XLSX file right from scratch.
 - It then gets to work populating it, smartly creating a dedicated tab for each month. And here’s a neat touch: it accurately includes those often-overlooked overlapping days from the previous and next months, so you always get the complete picture.
 - Plus, it neatly lays out all employee names in the first column of every sheet.

Now, for a bit of real talk: in its current incarnation, the script isn't yet sophisticated enough to handle command-line arguments. This means that for the time being, you’ll need to take a quick peek into the source code to adjust the workerNames array directly. The output filename follows the same story – it’s just a line below in the code, ready for your customization.

But wait, there’s more under the hood! The script has a budding superpower: it already keeps a running tally of the days since each person last faced an on-call shift (though, for now, this vital intel is just displayed on the console). The grand vision, however, is to turbocharge this. I’m aiming to weave in dynamic logic that can intelligently juggle vacation schedules, those notoriously tricky public holidays that vary by region (yes, all you German Bundesländer, I see you!), and even birthdays.  
Once that piece of the puzzle is in place, it becomes an absolute must: the system has to leverage these 'time-since-last-duty' metrics to forge genuine fairness into the schedule, ensuring no one is inadvertently skipped or unfairly burdened. And you can absolutely bet that if I crack this code, I’ll be heralding it from the digital rooftops in a brand-new article!

So, over to you! What other brilliant strokes of genius or essential features do you think this on-call scheduling sidekick is desperately missing? Don't hold back – unleash your thoughts in the comments below!