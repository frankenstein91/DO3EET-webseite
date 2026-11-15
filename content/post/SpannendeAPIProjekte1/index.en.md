+++
title = 'Exciting API Projects'
date = 2024-08-20T17:00:00+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Software",
    "Internet",
]
+++

Over my many years in computer science, I've come across quite a few API projects that are completely free to use—most of them aimed at the free software community. As a reminder for myself and a handy reference for others, here's a quick rundown. This isn't meant to be an exhaustive list, just "my favorites." I call them "API projects" because they either expose APIs themselves or put existing APIs to great use.
<!--more-->
# Cars
## Autobahn
Dodge traffic jams and steer clear of roadworks—with the official German API, no problem: [autobahn.api.bund.dev](https://autobahn.api.bund.dev/)

# Train Travel
## travelynx
I'd like to kick things off with [travelynx](https://travelynx.de/). It lets you actively check in and track your rides on trains and other public transit services. You get real-time trip tracking complete with a progress bar you can share. On top of that, the site keeps stats and an archive of your journeys along with all logged service alerts. Bonus points: it's a project from Germany.

## bahn.expert
Another German project is [bahn.expert](https://bahn.expert). It presents streamlined train schedules and rolling stock details, packing way more useful info into its clean interface than Deutsche Bahn's own website. Next time your kid asks... yes, you can even look up how much horsepower the train currently has. You can also see how crowded individual coaches are.

# Aircraft
## flightradar24
Almost everyone knows this one. [FR24](https://www.flightradar24.com) uses its own APIs so volunteers can feed live flight data into the network. I even have a small PC with an antenna up in my attic reporting aircraft movements to the site. They also offer an API for pulling data. A neat side project of theirs is [myFlightradar24](https://my.flightradar24.com/Frankennix), which lets you keep a flight log and track your carbon footprint a bit. At the time of writing, for example, I'm sitting at 35.2 metric tons of CO₂ from air travel.

## flightaware
[FlightAware](https://de.flightaware.com/) is a similar project to Flightradar24, though with a few differences in map styling and weather overlays. In day-to-day use, there aren't any huge differences between the two. My attic antenna feeds data here too.

## airplanes.live
A somewhat newer contender is [airplanes.live](https://airplanes.live/). Here, data is mostly unfiltered—meaning military aircraft show up as well. Their data API is also free to use. The site keeps things ultra-simple without bloated extras... just pure tracking, true to the "do one thing and do it well" philosophy. I'm not feeding data to this service yet.

## ITA Matrix
You'll usually find the cheapest flights using [Matrix](https://matrix.itasoftware.com/search) by ITA Software. The UI is anything but intuitive, though—I still haven't figured out who the intended target audience for this website actually is.

# Public Holidays and Days Off
## nager.date
On the [Date website by nager.at](https://date.nager.at/), you'll find pretty much every public holiday around the globe, complete with a free API. An absolute must-have for my scheduling.

# Money
It's all about the money... or as ABBA sang, "Money, Money, Money"...

## frankfurter
Quickly converting one currency into another... no problem, there are APIs for that too. I use [frankfurter.app](https://www.frankfurter.app/). The ECB publishes these rates as well, though in my opinion nowhere near as effortlessly.

# The Final Frontier
## Sunrise and Sunset
For that, I use the [sunrise-sunset.org](https://sunrise-sunset.org/api) API.

## ISS
For tracking the ISS across the night sky, I use the [Open-Notify](http://open-notify.org/Open-Notify-API/) API. Unfortunately, it only runs over plain HTTP, which can make embedding it a bit of a pain.
