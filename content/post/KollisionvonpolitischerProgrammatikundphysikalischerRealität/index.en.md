+++
title = 'When Political Agenda Collides with Physical Reality'
date = 2025-11-24T12:15:00+01:00
draft = false
author = "Frank Tornack"
tags = [
    "Germany",
    "Politics",
    "Opinion",
    "Energy",
]
+++

In Germany's ongoing debate over the energy transition, there is a widening gulf between political wishful thinking and technical-physical feasibility. The latest proposal from the Green Party (Bündnis 90/Die Grünen), marketed as a "Solar Bonus" or "Free Electricity," is a textbook example that deserves a rigorous teardown from the perspective of computer science and physics. The plan—co-developed by former Agora Energiewende director Simon Müller, among others—proposes granting private households an annual quota of up to 600 hours of "free" electricity, primarily during peak solar generation in summer. The stated goal is to incentivize load shifting into times of surplus so renewables don't have to be curtailed and fossil power plants get pushed out at the margins.[^1]

My focus here is strictly on viewing the German power grid as a cyber-physical system (CPS). A CPS is defined by the tight coupling between physical processes and IT control components.

The proposal suggests a seductive algorithmic simplicity—`if (sun_shines) then (price = 0)`—which, upon closer inspection of the system architecture, I can only call **catastrophic**. Let me explain why injecting this deterministic signal into a grid designed around stochastic behavior inevitably leads to what I classify as a "System Failure."

## Physics Fundamentals
### My Issue with Confusing Work and Power
The fundamental misunderstanding I see in this proposal starts with the basic units. Policymakers operate in energy (kWh), whereas as an engineer I know the grid is constrained by power (watts). To me, energy (E) is the capacity to do work, while power (P) is the rate at which it happens.

\[
E = \int_{t_1}^{t_2} P(t) \, dt
\]
\[
P(t) = \frac{dE}{dt}
\]

This isn't nitpicking on my part. A cable doesn't have an energy capacity; it has a power capacity. Infrastructure stress limits are dictated by instantaneous power. When the Solar Bonus promises me 600 hours of energy, the grid couldn't care less. The grid only feels the amplitude of the power draw. The danger here is that we're incentivizing peak power within a narrow time window—pure poison for a grid engineered around statistical averages.

### Simultaneity Factor
In grid planning, engineers rely on the simultaneity factor (SF).
\[
SF = \frac{P_{max, \text{simultaneous}}}{\sum P_{\text{rated}}}
\]
Normally, this factor sits below `0.1`, because the assumption is that not all of my neighbors are turning on their electric stoves or firing up their table saws at the exact same second. The Solar Bonus blows that statistical assumption to smithereens. It synchronizes behavior. When millions of people and I program our EVs to start charging the instant the price hits **zero**, we turn randomness into determinism. SF rockets toward `1`. Plenty of analyses show the grid simply isn't built for that. Others[^2] and I don't see this as merely a theoretical overload—we see a very real threat to physical equipment.

### Ohm's Reality Check
I also feel compelled to remind everyone of Ohm's Law.
\[
\Delta U \approx I \cdot R \cdot \cos \phi + I \cdot X \cdot \sin \phi
\]
If the Solar Bonus triggers everyone on my street to charge at once (high current), voltage plummets (brownout[^3]). Conversely, when the sun blazes and everyone feeds power back in, voltage spikes, and inverters trip offline due to overvoltage (voltage > 253 V).

- Scenario A: Voltage too high \(\rightarrow\) My inverter shuts down \(\rightarrow\) No "free electricity."
- Scenario B: "Free!" signal hits \(\rightarrow\) Load spikes simultaneously \(\rightarrow\) Voltage sags \(\rightarrow\) Equipment fails.

## Thermodynamics
People love to assume power lines are passive components. They aren't. Their lifespan depends directly on temperature.

### The Local Distribution Transformer
The transformer down on my street is usually oil-cooled. Its lifespan[^4] is cut in half for roughly every 6 Kelvin increase in operating temperature. The Solar Bonus concentrates peak load right into midday in the middle of summer—thermodynamically the worst possible moment. If I push the transformer to its absolute limit right then because of a "free electricity" price signal, I risk gas bubbles forming in the oil and hydrolysis degrading the insulating paper. To me, this looks like sacrificing the lifespan of our most expensive grid assets for a short-term pricing gimmick.

### The Invisible Load
Add reactive power and harmonics to the mix. My power electronics (EV chargers, inverters) still load the grid even when my net active power looks like zero on paper.
\[
S = \sqrt{P^2 + Q^2}
\]

## The IT Void
Let's switch disciplines. To bill 600 hours a year accurately, I need data. So I took a look at the status quo.

### Smart Meters
This scheme absolutely requires intelligent metering systems (iMSys). The numbers from Germany's Federal Network Agency (as of 2024/2025) are sobering.  
For me, that translates to: for over 95% of households, this proposal isn't even technically implementable. Without metering, there is no control. Estimating via standard load profiles (SLP) would be pure voodoo and completely defeat the physical purpose of grid stabilization.
Suppose we actually had 40 million smart meters deployed:
\[40,000,000 \times 96 \text{ values/day} \approx 4 \text{ billion records/day}\]
I know what utility IT landscapes look like. Plenty of them are still chugging along on legacy SAP IS-U systems. A flood of data like that would effectively be a self-inflicted DDoS attack. I have serious doubts that those backend systems could handle the latency required for real-time control.
This screams "Thundering Herd" problem. When a central app pushes out the signal "FREE RIGHT NOW," millions of requests slam wallbox manufacturers' APIs at once. I predict API crashes. Even worse: when the grid starts buckling, the "Stop" command arrives too late because of latency. **And who ends up paying for the botched measurements?**

### Cybersecurity
The Solar Bonus pushes us straight into a system of total surveillance. Shout-out to the EU: **busted!**

I know for a fact that high-resolution load profiles can reveal which TV channel I'm watching. That's a classic side-channel attack. The Solar Bonus economically coerces me into handing over that data. I can already see massive centralized databases mushrooming everywhere.

My biggest **security concern**, however, is cyber-kinetic. We're networking millions of high-draw appliances together. If an attacker manages to spoof the central price signal ("Electricity is free!"), they trigger an instant flash crowd. Millions of devices kick on at the exact same moment. I see a very real risk of frequency drops and regional blackouts. **We are literally building the perfect weapon for an adversary.** Greetings to Russia, China, and North Korea...

Sure, the smart meter gateway itself might be "secure" (BSI-certified). My 20-euro Wi-Fi smart plug definitely isn't. The Solar Bonus incentivizes cheap connectivity. I fully expect a tsunami of **insecure IoT junk** sitting right alongside state-blessed smart meters, serving as a wide-open entry point.

## The Deadlock
I spot a blatant logical bug in the design as soon as I look at §14a EnWG...
§14a allows grid operators to throttle me down to 4.2 kW when capacity gets tight. Here, two worlds collide head-on:
1. Market (Solar Bonus): "Charge at full blast right now! It's free!"
2. Physics (§14a): "Whoa! Overload! Throttle it down!"
3. Every computer scientist: Ahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh! Fuck!!!!

I see a classic oscillation problem (hunting) barreling straight toward us: price 0 --> load spikes --> grid saturates --> throttling kicks in --> load drops --> grid clears --> throttling turns off --> load spikes again.
That is the textbook definition of an unstable control loop.

## Closing Thoughts
One last personal pet peeve that makes the hairs on the back of my neck stand up as an engineer: the obsession with the wrong units. It drives me up the wall when policy papers blabber about "electricity consumption in hours." Folks, we pay for energy, not time! Electricity consumption is measured in damn kilowatt-hours (kWh), not hours on a wall clock.

The "600 hours of free electricity" proposal is physical nonsense. An hour spent charging my EV at 22 kW is in a completely different energetic and financial universe than an hour where just my 5-watt LED bedside lamp is glowing. Gifting me "hours" is about as precise as offering "10 minutes of free gas at a flat rate"—regardless of whether I'm dripping fuel in with an eyedropper or jamming a fire hose into the tank.

Anyone who hasn't grasped the difference between the time axis and the area under the curve (work W=P⋅t) should probably crack open a 7th-grade physics textbook[^5] before drafting laws for the energy transition.

[^1]: [Tagesspiegel: Proposal ahead of party conference: Greens want 600 hours of free electricity for everyone](https://www.tagesspiegel.de/politik/vorschlag-vor-parteitag-grune-wollen-600-stunden-gratis-strom-fur-alle-14854589.html)
[^2]: [OutdoorChiemgau: Grid Stability Report 2025 – The Killer for Solar and Wind?](https://youtu.be/RZN0aGpCB4I?si=9xrIJOudrW7pW1pf)
[^3]: [Photovoltaik raymann: Explaining the term Brownout](https://youtu.be/FoZiAq-oMH4?si=50v9uL0L4LAGCLFg)
[^4]: [Announcement 2017 Transformer Aging](https://ront.info/ankundigung-transformatoralterung/)
[^5]: [Strippenstrolch: An Exciting Day of Electricity Lessons in Primary School](https://www.strippenstrolch.de/downloads/Ein_Spannender_Tag.pdf)
