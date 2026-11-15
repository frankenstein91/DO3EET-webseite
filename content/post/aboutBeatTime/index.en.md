+++
title = 'Swatch Internet Time'
date = 2024-04-23T13:39:30+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Time",
    "Hobby",
]
+++

In many areas of life, time is a crucial coordinate. My favorite physicist, Neil deGrasse Tyson, explains this wonderfully on his online show StarTalk: space and time matter, which is why they're often treated together as spacetime. If I say, "Shall we meet at 3:30 PM?", people intuitively ask, "**Where?**" Conversely, if I suggest meeting at the Monument to the Battle of the Nations (Völkerschlachtdenkmal), the follow-up question will just as quickly be **when**. Translated into amateur radio terms, that's frequency and time.

On top of our usual Babylonian clock, however, we humans have inflicted two extra headaches on ourselves: time zones and daylight saving time. For international meetups, sun-based local time is tricky to line up—8:00 AM in Japan is not 8:00 AM in Berlin. That's where the Swiss watchmaker Swatch stepped in back in 1998 and introduced a brand-new way of dividing up the day.

I see several real advantages in Swatch Internet Time—or `.beat` time for short:

- no time zones
- no daylight saving time
- it's a metric, decimal clock
- there is only a single unit (`.beat`), where one second equals 0.011574 `.beats`, making 1 k`.beat` one full day

The only drawback I see is with our existing physics formulas, which historically rely on the second as the SI base unit.

Right now, that makes the time **{{< beattime >}}**.

My proposal for international radio traffic and online meetings: use `.beat` time.
I know Swatch doesn't exactly have the best reputation among ham radio operators—here's a [BBC article](http://news.bbc.co.uk/2/hi/science/nature/320560.stm) on why.
