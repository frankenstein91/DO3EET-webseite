+++
title = 'Weather Statistics of my Station'
date = "2026-04-26T14:29:54+02:00"
draft = false
author = "Frank Tornack"
tags = [
    "Weather",
    "Data",
    "Statistics",
    "Python",
]
+++

In this post, I take a look at the collected data from my weather station. I have cleaned the CSV exports and transferred them into a SQLite database to create comparative statistics and charts.

<!--more-->

Here are the comparative evaluations of daily maximum and minimum temperatures for each month. The colors represent the different years:

- **2022**: Purple
- **2023**: Green
- **2024**: Cyan
- **2025**: Pink
- **2026**: Yellow/Orange

## Yearly Overviews (Smoothed)

To provide a better overview of the trends, this summary shows the progression over the entire year. The data has been smoothed by dividing each month into 5 segments.

![Yearly Overview Max](year_overview_max.svg)
![Yearly Overview Avg](year_overview_avg.svg)
![Yearly Overview Min](year_overview_min.svg)

## Rainfall Comparison

Besides temperature, rainfall is one of the most important parameters. The following diagrams show the total monthly amount and the number of days it rained (at least 0.1 mm).

![Monthly Rainfall](year_overview_rain_total.svg)
![Number of Rainy Days](year_overview_rainy_days.svg)

## Monthly Detailed Views (Temperature)

### January
![January Max](temp_max_01_januar.svg)
![January Avg](temp_avg_01_januar.svg)
![January Min](temp_min_01_januar.svg)

### February
![February Max](temp_max_02_februar.svg)
![February Avg](temp_avg_02_februar.svg)
![February Min](temp_min_02_februar.svg)

### March
![March Max](temp_max_03_märz.svg)
![March Avg](temp_avg_03_märz.svg)
![March Min](temp_min_03_märz.svg)

### April
![April Max](temp_max_04_april.svg)
![April Avg](temp_avg_04_april.svg)
![April Min](temp_min_04_april.svg)

### May
![May Max](temp_max_05_mai.svg)
![May Avg](temp_avg_05_mai.svg)
![May Min](temp_min_05_mai.svg)

### June
![June Max](temp_max_06_juni.svg)
![June Avg](temp_avg_06_juni.svg)
![June Min](temp_min_06_juni.svg)

### July
![July Max](temp_max_07_juli.svg)
![July Avg](temp_avg_07_juli.svg)
![July Min](temp_min_07_juli.svg)

### August
![August Max](temp_max_08_august.svg)
![August Avg](temp_avg_08_august.svg)
![August Min](temp_min_08_august.svg)

### September
![September Max](temp_max_09_september.svg)
![September Avg](temp_avg_09_september.svg)
![September Min](temp_min_09_september.svg)

### October
![October Max](temp_max_10_oktober.svg)
![October Avg](temp_avg_10_oktober.svg)
![October Min](temp_min_10_oktober.svg)

### November
![November Max](temp_max_11_november.svg)
![November Avg](temp_avg_11_november.svg)
![November Min](temp_min_11_november.svg)

### December
![December Max](temp_max_12_dezember.svg)
![December Avg](temp_avg_12_dezember.svg)
![December Min](temp_min_12_dezember.svg)

