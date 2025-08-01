+++
title = 'Amateurfunk vs. AST Spacemobile'
date = 2025-08-01T12:40:00+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Space",
    "Funk",
    "Satelliten",
    "5G",
    "FCC",
    "70cm-Band"
    "Interferenz",
    "Regulierung",
]
+++

> Houston, wir haben ein Problem

Ein texanisches Startup will mit riesigen Satelliten 5G vom Himmel regnen lassen. Klingt cool, oder? Blöd nur, dass sie dafür ausgerechnet in unserem digitalen Sandkasten parken wollen – dem 70cm-Band.

## Die glorreiche Zukunft aus dem All... mit einem kleinen Haken
Als Space-Nerd und Computer-Freak muss ich zugeben: Die Vision von AST SpaceMobile hat schon was. Stellt euch eine Welt vor, in der Funklöcher ein Relikt aus der Steinzeit des Internets sind. Kein verzweifeltes Suchen nach Empfangsbalken mehr auf einer Wanderung, kein „Kein Netz“ mehr mitten auf See. Genau das verspricht das texanische Unternehmen: Ein globales Mobilfunknetz aus dem Weltraum, das sich direkt mit jedem handelsüblichen, unmodifizierten Smartphone verbindet. Einfach das Handy aus der Tasche ziehen und mit 4G- oder 5G-Geschwindigkeit surfen, egal wo auf diesem Planeten.

Die Technologie dahinter ist, um es mal salopp auszudrücken, verdammt beeindruckend. Wir reden hier nicht von irgendwelchen CubeSats in Schuhkartongröße. Der Prototyp, BlueWalker 3, entfaltete im Orbit eine Phased-Array-Antenne von 64 Quadratmetern – das ist größer als eine durchschnittliche Einzimmerwohnung und eines der größten kommerziellen Kommunikationsarrays, das je in einer erdnahen Umlaufbahn (LEO) stationiert wurde. Die neuen „BlueBird“-Satelliten sollen sogar noch größer und leistungsfähiger werden. Respekt, wo Respekt gebührt. Das ist eine technische Meisterleistung.

Doch bei all der Faszination für die Technik schrillen bei mir als Funkamateur die Alarmglocken. Denn um eine riesige Konstellation von über 240 dieser Giganten im All zu steuern, zu überwachen und zu kommandieren, braucht man Frequenzen. Und genau hier liegt der Showstopper, der diesen Artikel überhaupt erst notwendig macht. Anstatt auf etablierte, kommerzielle Frequenzbänder zurückzugreifen, hat sich AST SpaceMobile für ihre TT&C-Links einen ganz "besonderen" Bereich ausgesucht. Einen, der uns Funkamateuren betrifft.

Hier zeigt sich ein fundamentaler Widerspruch. Um die Verbindung zu einem winzigen, leistungsschwachen Smartphone auf der Erde herzustellen, müssen die Satelliten selbst gigantisch sein und mit enormer Sendeleistung und Empfangsempfindlichkeit arbeiten. Genau diese technische Notwendigkeit macht sie zu einer potenziellen Störquelle von epischem Ausmaß. Ihre größte Stärke ist gleichzeitig die größte Gefahr für alle anderen, die sich den Luft teilen. Es wirkt, als ob ein milliardenschweres Hightech-Unternehmen mit Partnern wie Vodafone und AT&T zwar die Mittel für riesige Satelliten hat, aber bei der grundlegenden Infrastruktur für deren Steuerung auf eine Lösung zurückgreift, die eher an ein Low-Budget-CubeSat-Projekt erinnert, das teure kommerzielle Lizenzen umgehen will. Die „Move fast and break things“-Mentalität des Silicon Valley mag für Software-Startups funktionieren, aber im globalen Frequenzspektrum kann sie verheerende Folgen haben.

## Unser digitaler Sandkasten
Bevor wir ins Detail gehen, warum ASTs Frequenzwahl so problematisch ist, müssen wir über den Tatort sprechen: das 70-Zentimeter-Band. Für Nicht-Funker sind das nur Zahlen: 430 MHz bis 440 MHz. Für uns Funkamateure in Deutschland und ganz Europa (der sogenannten ITU-Region 1) ist dieser Bereich jedoch weit mehr. Er ist eine primäre Zuweisung (das ist schon selten) für den Amateurfunkdienst. Das bedeutet, wir sind hier **keine** geduldeten Gäste, sondern die **Hauptnutzer** mit verbrieften Rechten.

Eh jetzt der erste kommt und mich korregieren will... Natürlich sind wir nicht ganz allein. Im ISM-Bereich um 433 MHz tummeln sich Autoschlüssel, Funkthermometer und Garagentoröffner. Aber die Regeln sind hier klar definiert: Diese Geräte sind sekundäre Nutzer und müssen Störungen durch den primären Amateurfunkdienst hinnehmen, nicht umgekehrt. Wir sind es gewohnt, den Raum zu teilen, aber nach klaren Spielregeln.

Und dieses Zuhause ist alles andere als eine leere, ungenutzte Frequenzwüste. Das 70cm-Band ist das Schweizer Taschenmesser unter den Amateurfunkbändern, ein pulsierender, vielseitiger und unverzichtbarer Teil unseres Hobbys:

- Von der schnellen Absprache mit dem Handfunkgerät beim Fieldday bis hin zu weiträumigen Verbindungen über ein dichtes Netz von Relaisfunkstellen, die ganze Regionen abdecken – das 70cm-Band hält uns lokal und regional vernetzt.
- Dies ist der Punkt, an dem die Ironie **schmerzhaft** wird. Das 70cm-Band ist das zentrale Band für die Kommunikation mit **Amateurfunksatelliten**. 
- Hier tummelt sich eine riesige Vielfalt an Betriebsarten. Von klassischen digitalen Modi wie RTTY und Slow Scan Television bis hin zu modernen digitalen Sprachnetzwerken wie DMR. Außerdem ist es das unterste Frequenzband, auf dem wir Amateurfunkfernsehen betreiben dürfen.
- In Deutschland ist das 70cm-Band eines der wichtigsten und am leichtesten zugänglichen Bänder für Einsteiger mit der Klasse-N-Lizenz. Es ist für viele der erste Schritt in die faszinierende Welt des Amateurfunks.

## Der ungebetene Gast
Kommen wir also zum Kern unseres Problems. Was genau macht AST SpaceMobile in unserem Band? Es ist keine vage Befürchtung, es sind klare, kalte, harte Fakten. Das Unternehmen betreibt bereits fünf seiner kommerziellen blauen Vögel, die für ihre TT&C-Verbindungen gezielt Frequenzen mitten in unserem 70cm-Band nutzen. Und um das unmissverständlich klarzustellen: Dies sind **keine** Amateurfunksatelliten, das sind große komerzelle fliegende Kühlschränke mit der Rechenpower eines kleinen Rechenzentrum. 

Die wahre Dimension der Bedrohung wird aber erst klar, wenn man auf die Zukunft blickt. Es geht nicht um die fünf Satelliten, die jetzt schon da oben fliegen. Der Plan von AST SpaceMobile umfasst eine Konstellation von insgesamt 243 Satelliten. Rechnen wir mal kurz nach: Bei einer so großen Anzahl von Satelliten in einer niedrigen Erdumlaufbahn wird statistisch gesehen fast immer mindestens einer, wenn nicht sogar mehrere, am Himmel über Deutschland sichtbar sein. Das bedeutet, wir reden nicht über gelegentliche, kurze Störungen, sondern über eine potenziell permanente Lärmglocke, die über dem gesamten 70cm-Band liegt.

Um das zu veranschaulichen, stellen wir uns eine Analogie vor: Das Kerngeschäft von AST SpaceMobile, der Mobilfunk aus dem All, findet auf anderen, dafür vorgesehenen kommerziellen Frequenzen statt. Das ist ihr Firmengelände, ihr riesiges Logistikzentrum. Die Nutzung unseres 70cm-Bandes dient ausschließlich der internen Betriebsorganisation – dem Steuern ihrer Satelliten. Das ist, als würde eine riesige Spedition mit hunderten von LKWs beschließen, dass es billiger und einfacher ist, ihre gesamte Flotte nicht auf dem eigenen Betriebshof, sondern in den engen Straßen eines ruhigen Wohngebiets zu parken. Sie blockieren Einfahrten, machen Lärm zu jeder Tages- und Nachtzeit und erklären den Anwohnern, sie sollen sich doch nicht so anstellen, sie würden ja nur kurz halten. Genau das passiert hier!

## Ein kleiner Ausflug ins Frequenzrecht für Nicht-Juristen
Jetzt fragt sich natürlich jeder vernünftige Mensch: 
> Wie kann das sein? Wie kann ein kommerzielles Unternehmen einfach so in einem primär dem Amateurfunk zugewiesenen Band funken?

Die Antwort ist ein Paradebeispiel für regulatorische Lücken und die Taktik des vollendeten Tatsachenschaffens. Der Ursprung des Übels liegt in den **USA** (auch bekannt als Weltpolizei), bei der Federal Communications Commission. Diese hat AST SpaceMobile eine Genehmigung für eine „begrenzte, nicht konforme Nutzung“ des 430-440 MHz-Bandes erteilt – allerdings explizit nur für den Betrieb außerhalb der Vereinigten Staaten. Man beachte das Wording: „nicht konform“. Die Behörde gibt also selbst zu, dass diese Nutzung eigentlich **nicht** den Regeln entspricht.

Schauen wir etwas tiefer in diese Genehmigung, die auf den ersten Blick beruhigend klingt: 
> AST SpaceMobile darf keine schädlichen Störungen verursachen und keinen Schutz vor schädlichen Störungen beanspruchen, die von einer Station verursacht werden, die in Übereinstimmung mit den ITU-Funkvorschriften betrieben wird.

In der Praxis ist dieser Satz eine regulatorische Falle. Er **kehrt die Beweislast um**. Nicht das milliardenschwere Unternehmen muss nachweisen, dass es nicht stört, sondern der Hobby Funkamateur am Boden muss eine flüchtige Störung durch einen schnell vorbeiziehenden Satelliten gerichtsfest dokumentieren und melden. Bei einer Konstellation von hunderten Satelliten ist das eine Sisyphusaufgabe. Es ist ein System, das dem Verursacher erlaubt, so lange ungestraft zu agieren, bis ihm das Gegenteil bewiesen wird – ein Beweis, den das Opfer kaum erbringen kann.

Dieses Muster der nonchalanten Missachtung wird durch die Tatsache untermauert, dass der ursprüngliche Antrag von AST bei der FCC von vielen Seiten als vage und unzureichend kritisiert wurde. Man beantragt einfach mal den Zugang und hofft, dass es niemand merkt.

Aber die Amateurfunk-Community hat es gemerkt. Und sie nimmt das nicht einfach so hin. Was hier passiert, ist keine stille Übernahme, sondern ein Kampf, der auf globaler Ebene geführt wird. Dies ist kein Protest von ein paar wenigen, sondern eine organisierte, faktenbasierte Gegenwehr. An vorderster Front stehen die internationalen und nationalen Amateurfunkverbände. Die International Amateur Radio Union (IARU), die weltweite Dachorganisation, hat eine offizielle Position veröffentlicht und ihre Mitgliedsverbände, darunter den DARC in Deutschland, aufgefordert, bei ihren nationalen Regulierungsbehörden auf die Gefahren hinzuweisen. Das ist auch bitter nötig, denn es handelt sich hier nicht um eine theoretische Gefahr. Es gibt bereits konkrete Beweise für Störungen. So wurde dokumentiert, dass der Prototyp BlueWalker-3 den wissenschaftlichen Satelliten InspireSAT-1 gestört hat. Die „keine schädlichen Störungen“-Klausel der FCC wurde also bereits verletzt. Das zeigt, dass die Zusicherungen des Unternehmens wenig wert sind, wenn es hart auf hart kommt.

Was sich hier abspielt, ist eine moderne David-gegen-Goliath-Geschichte. Auf der einen Seite steht ein milliardenschweres, börsennotiertes Unternehmen mit mächtigen Partnern. Auf der anderen Seite steht eine globale Gemeinschaft von Freiwilligen, die in ihrer Freizeit mit ehrenamtlich betriebenen Messstationen die Daten sammeln, um die Rechte ihrer Community zu verteidigen. Es ist ein beeindruckendes Zeugnis für die Stärke und Professionalität des Amateurfunks.

## Was nun, DO3EET?
Ein kommerzielles Unternehmen mit einer brillanten Geschäftsidee, aber einer fragwürdigen Umsetzungsethik, nutzt regulatorische Schlupflöcher, um sich aus reiner Bequemlichkeit und Kostengründen in einem weltweit anerkannten, nicht-kommerziellen Frequenzband breitzumachen. Damit gefährdet es nicht nur unzählige Anwendungen, sondern auch die Zukunft des Amateurfunks auf einem seiner wichtigsten Bänder.

Hier geht es um mehr als nur ein paar Kilohertz. Es geht ums Prinzip. Soll ein Funkdienst, der seit über einem Jahrhundert für technisches Experimentieren, Bildung, Völkerverständigung und Notfallkommunikation steht, einfach beiseite geschoben werden, weil ein kommerzieller Anbieter seine Betriebskosten optimieren will? Meine Antwort darauf ist ein klares und lautes „**Nein!**“.

Bleibt neugierig, bleibt auf Sendung. Der Kampf ist noch nicht vorbei. Die Satelliten werden gerade erst gebaut und gestartet. Die Bedrohung wächst mit jedem weiteren Start. 