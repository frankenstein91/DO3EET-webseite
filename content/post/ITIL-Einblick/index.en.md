+++
title = 'A Peek into ITIL'
date = 2024-09-18T19:58:00+02:00
draft = false
author = "Frank Tornack"
tags = [
    "IT",
]
+++

For a few years now, I've been mentoring young newcomers in computer science and IT, sharing whatever wisdom I've picked up along the way. With the new apprenticeship year and university semester kicking off, I figured I'd take the opportunity to give a quick introduction to the Information Technology Infrastructure Library—ITIL for short. For seasoned IT pros, these workflows are already baked into daily muscle memory, but for fresh-faced IT heroes, this foundational tome is brand-new territory.

# What is ITIL?
ITIL, across all its iterations, is a widely adopted set of guidelines and best-practice recommendations for IT Service Management and IT Process Management. It gives organizations a framework for delivering efficient and effective IT services. That said, ITIL is no "one-size-fits-all" silver bullet. Organizations need to carefully evaluate whether ITIL suits their actual needs and tailor the implementation to their specific requirements. That last sentence also explains (in my view) why I can only offer a snapshot from my own professional life.

# Why was ITIL invented?
ITIL was originally developed by the British government—well before my time in IT. The goal was to rein in ballooning IT costs and wildly inconsistent IT practices. Back then, clearly defined standards for delivering IT services simply didn't exist, and systems were rarely aligned with what customers actually needed. London realized that standardized processes and best practices were crucial for effective, cost-efficient IT service delivery. Those involved spotted several clear benefits:

 - ITIL improves communication and collaboration between IT teams and the rest of the business.
 - Cutting out redundancies and inefficiencies drives higher productivity.
 - Better documentation helps prevent errors and outages.

# Are there downsides?
On paper, that all sounds great and worth adopting—but every medicine has side effects. An overly rigid or bloated ITIL implementation can lead to sluggish processes and a mountain of bureaucracy, which is why you'll always find staff (especially folks coming from smaller shops) pushing back against being boxed into these workflows.
Rolling out ITIL purely as a technical checklist while ignoring company culture and the people doing the work is doomed to fail. In recent years, it's become clear that the focus shouldn't be on blindly following processes, but on achieving the desired outcomes (buzzword alert: agile working).

# ITIL Modules

## Change Management
Change Management deals with managing and controlling modifications to the IT infrastructure and its associated services and interfaces. Its goal is to keep the negative impact of changes on live operations as small as possible. It does this through a clearly defined, controlled process covering planning, approval, implementation, and documentation of changes. That gives teams tighter control over their infrastructure and boosts transparency around past and upcoming changes—reducing risk and improving cross-team coordination in the process.

## Incident Management
Incident Management is the process aimed at restoring normal IT service as quickly as possible while minimizing the impact on business operations. It bundles the tools, concepts, and procedures needed to resolve disruptions fast and efficiently within agreed Service Level Agreements (SLAs).

## Problem Management
Problem Management aims to permanently eliminate recurring disruptions (incidents). It distinguishes between reactive and proactive problem management—though in my corner of the industry, reactive problem management is what you mostly see in practice.

Reactive problem management investigates the underlying causes of incidents and comes up with measures to prevent similar incidents from happening again.

Preventing incidents before they even occur, on the other hand, is the job of proactive problem management—something experienced engineers often end up doing instinctively without thinking about the label.

In Problem Management, you hunt down the underlying causes, commonly called the root cause. The official industry term here is Root Cause Analysis (RCA).

# Is ITIL the only game in town?
Even though ITIL is the big standard in IT Service Management, there are plenty of alternative frameworks out there. Especially for rising tech talent, it's important to look beyond the familiar horizon.

## YaSM
Built on a similar naming pun to the YaCy search engine, YaSM stands for *Yet another Service Management*. It's a hands-on service management framework designed to be a leaner, more intuitive alternative to ITIL. YaSM offers a simpler process structure and gets by with far fewer buzzwords and concepts.

## COBIT
COBIT is a framework for IT governance aimed at aligning IT with business objectives. The acronym stands for *Control Objectives for Information and Related Technologies*.

## Others...
 - CMMI-SVC
 - FitSM
 - SIAM
 - USMBOK
 - VeriSM

# Where does Service Management really matter?
Companies can get audited and certified against international standards. Even though I don't have a copy of ISO 20000 sitting on my desk, you definitely feel its ripple effects in day-to-day work. ISO 20000 defines minimum requirements for service management and, like every ISO standard, consists of multiple parts.

Unlike ITIL—which certifies individuals—ISO 20000 allows an entire organization to be certified.

# Disclaimer
Since I'm writing from my own experience and these handbooks are highly customizable, not every description or tip here will match every reader's workplace. I've been working with ITIL across various teams since 2012.

# Package Insert
Yes, the topic is dry enough to double as a sleeping pill... yet it's indispensable in any modern IT environment.
