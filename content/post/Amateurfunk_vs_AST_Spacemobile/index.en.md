+++
title = 'Amateur Radio vs. AST SpaceMobile'
date = 2025-08-01T12:40:00+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Space",
    "Ham Radio",
    "Politics",
]
+++

> Houston, we have a problem

A Texan startup wants to rain 5G down from the sky using giant satellites. Sounds cool, right? Shame they want to park right in our digital sandbox to do it—the 70 cm band.

## The Glorious Future from Space... with One Little Catch
As a space nerd and computer geek, I have to admit: AST SpaceMobile's vision has a certain appeal. Imagine a world where dead zones are a relic from the Stone Age of the internet. No more frantically waving your phone around for signal bars on a hike, no more "No Service" in the middle of the ocean. That's the exact promise of this Texas-based company: a global cellular network from space that connects directly to any standard, unmodified smartphone. Just pull your phone out of your pocket and browse at 4G or 5G speeds, no matter where you are on the planet.

The tech behind it is, to put it mildly, seriously impressive. We're not talking about shoebox-sized CubeSats here. Their prototype, BlueWalker 3, unfolded a 64-square-meter phased-array antenna in orbit—that's bigger than an average studio apartment and one of the largest commercial communications arrays ever deployed in low Earth orbit (LEO). The new "BlueBird" satellites are set to be even larger and more powerful. Credit where credit is due: that is an engineering marvel.

Yet for all my fascination with the technology, as a licensed radio amateur my alarm bells are ringing loudly. Because to steer, monitor, and command a massive constellation of over 240 of these giants in space, you need frequencies. And right there lies the showstopper that makes this article necessary in the first place. Instead of sticking to established commercial frequency bands, AST SpaceMobile picked out a "very special" slice of spectrum for its TT&C links—one that directly affects us amateur radio operators.

This exposes a fundamental contradiction. To talk to a tiny, low-power smartphone down on Earth, the satellites themselves have to be colossal, operating with enormous transmit power and receiver sensitivity. That exact technical necessity turns them into a potential source of interference on an epic scale. Their greatest strength is simultaneously the biggest threat to everyone else sharing the airwaves. It feels like a multi-billion-dollar high-tech company backed by partners like Vodafone and AT&T has the cash for gigantic satellites, yet for the basic infrastructure to control them falls back on something resembling a shoestring CubeSat project trying to dodge expensive commercial licenses. Silicon Valley's "move fast and break things" mindset might fly for software startups, but in the global radio spectrum, it can have devastating consequences.

## Our Digital Sandbox
Before we dive into why AST's choice of frequencies is so problematic, we need to talk about the crime scene: the 70-centimeter band. To non-hams, those are just numbers: 430 MHz to 440 MHz. For amateur radio operators in Germany and across Europe (what's known as ITU Region 1), however, this slice of spectrum is far more than that. It is a primary allocation (which is already rare enough) for the amateur radio service. That means we are **not** tolerated guests here—we are the **primary users** with codified rights.

Before the first "well, actually" pedant chimes in to correct me... of course we aren't completely alone in there. In the ISM sub-band around 433 MHz, you'll find car key fobs, wireless weather sensors, and garage door openers. But the rules are crystal clear: those devices are secondary users and have to accept interference from the primary amateur radio service, not the other way around. We're used to sharing the room, just under clear ground rules.

And this home of ours is anything but an empty, unused wasteland of spectrum. The 70 cm band is the Swiss Army knife of amateur radio bands—a vibrant, versatile, and indispensable part of our hobby:

- From quick local coordination on handhelds during Field Day to wide-area contacts via a dense network of repeaters covering entire regions, the 70 cm band keeps us connected locally and regionally.
- Here is where the irony gets **painful**. The 70 cm band is the central band for communicating with **amateur radio satellites**.
- It's home to a huge variety of operating modes—from classic digital modes like RTTY and Slow Scan Television all the way to modern digital voice networks like DMR. On top of that, it's the lowest frequency band on which we're allowed to run amateur television.
- In Germany, the 70 cm band is one of the most important and accessible bands for newcomers holding the Class N license. For many, it's their very first step into the fascinating world of amateur radio.

## The Uninvited Guest
So let's get to the heart of the problem. What exactly is AST SpaceMobile doing in our band? This isn't some vague fear; these are cold, hard facts. The company is already operating five of its commercial "BlueBirds" using frequencies smack in the middle of our 70 cm band for their TT&C links. And to make this unmistakably clear: these are **not** amateur radio satellites. These are massive commercial flying refrigerators packing the compute power of a small data center.

The true scale of the threat only becomes obvious when you look ahead. It's not just about the five satellites already flying up there. AST SpaceMobile's plan covers a constellation of 243 satellites in total. Let's do some quick math: with that many satellites in low Earth orbit, statistically speaking there will almost always be at least one—if not several—visible in the sky over Germany. That means we're not talking about occasional, brief blips of interference, but a potentially permanent blanket of RF noise sitting right on top of the entire 70 cm band.

To put it in perspective, imagine this analogy: AST SpaceMobile's core business—cellular service from space—runs on other, dedicated commercial frequencies. That's their company premises, their giant logistics hub. Using our 70 cm band is purely for internal operations—steering their satellites. That's like a massive trucking company with hundreds of semis deciding it's cheaper and easier not to park its fleet in its own depot, and instead lining the narrow streets of a quiet residential neighborhood with them. They block driveways, rattle windows day and night, and tell the residents not to make such a fuss because they're "only stopping briefly." That is literally what's happening here!

## A Quick Detour into Spectrum Law for Non-Lawyers
At this point, any reasonable person is going to ask:
> How is that even possible? How can a commercial company just transmit in a band primarily allocated to amateur radio?

The answer is a textbook case of regulatory loopholes and the art of creating facts on the ground. The root of the problem lies in the **USA** (also known as the world police), specifically with the Federal Communications Commission. The FCC granted AST SpaceMobile authorization for "limited, non-conforming use" of the 430–440 MHz band—though explicitly only for operations outside the United States. Note the phrasing: "non-conforming." The regulator itself is openly admitting that this usage does **not** actually comply with the rules.

Let's look a little closer at this authorization, which sounds reassuring at first glance:
> AST SpaceMobile shall not cause harmful interference and shall not claim protection from harmful interference caused by a station operating in accordance with the ITU Radio Regulations.

In practice, that sentence is a regulatory trap. It **reverses the burden of proof**. Instead of the multi-billion-dollar corporation having to prove it won't cause interference, the hobbyist radio operator on the ground has to document and report fleeting interference from a fast-moving satellite to a legal standard. With a constellation of hundreds of satellites, that's a Sisyphean task. It's a system that lets the offender act with impunity until proven guilty—proof the victim can barely gather.

This pattern of casual disregard is underscored by the fact that AST's original application to the FCC was widely criticized as vague and incomplete. You just apply for access and hope nobody notices.

Except the amateur radio community *did* notice. And it isn't taking this lying down. What's unfolding here isn't a quiet takeover; it's a fight being waged on a global scale. This isn't a handful of people grumbling—it's an organized, fact-based pushback. Leading the charge are international and national amateur radio organizations. The International Amateur Radio Union (IARU), the global umbrella body, has published an official position paper and urged its member societies—including the DARC in Germany—to alert their national regulators to the dangers. And not a moment too soon, because this isn't some theoretical risk. There is already concrete evidence of interference: it was documented that the BlueWalker-3 prototype interfered with the scientific satellite InspireSAT-1. So the FCC's "no harmful interference" clause has already been violated—proving the company's assurances aren't worth much when push comes to shove.

What we're watching play out is a modern David-versus-Goliath story. On one side stands a multi-billion-dollar publicly traded corporation with heavyweight partners. On the other stands a global community of volunteers spending their free time with community-run monitoring stations, collecting data to defend their community's rights. It's an impressive testament to the strength and professionalism of amateur radio.

## What Now, DO3EET?
A commercial company with a brilliant business idea—but questionable operational ethics—is exploiting regulatory loopholes to squat in a globally recognized, non-commercial frequency band purely out of convenience and cost-cutting. In doing so, it threatens not only countless applications, but the very future of amateur radio on one of its most vital bands.

This is about more than just a few kilohertz. It's a matter of principle. Should a radio service that has stood for technical experimentation, education, international goodwill, and emergency communications for over a century simply be shoved aside so a commercial provider can shave a bit off its operating expenses? My answer to that is a loud and clear "**No!**"

Stay curious, stay on the air. This fight isn't over yet. The satellites are only just being built and launched—and the threat grows with every single launch.
