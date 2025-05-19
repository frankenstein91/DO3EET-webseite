+++
title = 'Befehle über HAM'
date = 2024-04-09T08:50:20+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Sicherheit",
    "Python",
    "Amateurfunk",
]
+++

Durch eine Diskussion bin ich auf ein Problem aufmerksam geworden. Viele Amateurfunkrelaisbetreiber wollen Ihre Station fernsteuern und das am besten ohne Internet über Funk. Es stellt sich nun aber die berechtigte Frage, wie man dies ohne Verschlüsslung sicher umsetzen kann. Man muss bedenken im Amateurfunk ist Verschlüsslung, Verschleierung und geheime Codes verboten. SSH im normalen Setup also auch keine Option über Funk. Da die Befehle aber auch nicht geheim über tragen werden müssen, sondern nur bestätigt werden müssen... bieten sich trotzdem einige Möglichkeiten. Authentication und Authorization sind nach meinem Wissenstand nicht verboten.

Für meine Idee möchte ich mit OTP Arbeiten, wie sie auch im Internet als zweiter Faktor genutzt werden. Als Vorbereitung bedarf es eines leeren Verzeichnis und dieser drei Zeilen:
```bash
python -m venv venv
. ./venv/bin/activate
pip install pyotp
```
Damit steht uns ein unabhäniges Python mit den notwendigen Programmbibliotheken zur Verfügung. 

Ich schlage folgenden Ablauf vor:
| Amateurfunker                           | Richtung | Amateurfunkrelais                                          |
|-----------------------------------------|----------|------------------------------------------------------------|
| Sendet Befehl mit OTP                   | -->      | Speichert Befehl in Datenbank                              |
| Vergleicht Hash                         | <--      | Sendet Befehl und Hash zurück                              |
| Trifft Entscheidung über die Ausführung |          |                                                            |
| Sendet Hash und neuen OTP               | -->      |                                                            |
|                                         | <--      | sendet Befehl zum Hash (damit es keine Verschleierung ist) |
| freut sich                              | <--      | sendet Ausgabe des Befehls                                 |
|                                         |          | kennzeichnet Befehl als ausgeführt                         |

Um eine Kollsion bei mehreren Admins zu vermeiden sollte man sicherstellen, dass nur der letzte Befehl ausführbar ist. Die Übergabe sollte zwischen den zwei Hälften des OTP erfolgen. Für meine Idee braucht es die beiden Protokollbefehle `set` und `run`. Damit hätten wir `123 set shutdown -h now 428` und `979 run ae50c4f2a02f198c09e1f9575b7fe2ef9cae2c70 333`. Der erste Befehl würde bei einer Übereinstimmung mit dem OTP `123428` den Befehl in der Datenbank hinterlegen und entspechend `shutdown -h now ae50c4f2a02f198c09e1f9575b7fe2ef9cae2c70` zurück geben. Somit kann man Übertragunsfehler ausschleißen. Mit dem zweiten Befehl kann der Betreiber den Befehl nun starten und bekommt mindestens `shutdown -h now` zurück.

In Python ist ein solcher OTP schneller erstellt.
```python
import pyotp
key = pyotp.random_base32()
print(pyotp.totp.TOTP(key).provisioning_uri(name='DO3EET', issuer_name='Amateurfunkrelais'))
```
Diesen Key sollte sich die Applikation natürlich merken, aber mit der ausgegeben URL `otpauth://totp/Amateurfunkrelais:DO3EET?secret=OX6TY44W2MMGF3PTHM5DOY7YJ2ZRMFZ7&issuer=Amateurfunkrelais` kann man die meisten OTP-Generatoren füttern.

Die Überprüfung sollte ca. auf diese Art erfolgen. Wir nehmen an der Input kommt in der Variable `HamBefehl`.
```python
import pyotp
import hashlib
totp = pyotp.TOTP(key)
HamTOTP = f"{HamBefehl.split(' ')[0]}{HamBefehl.split(' ')[-1]}"
if totp.verify(HamTOTP):
    if HamBefehl.split(" ")[1] == "set":
        befehl = " ".join(HamBefehl.split(" ")[2:-1])
        print(f"{befehl} {hashlib.sha1(befehl.encode()).hexdigest()}")
        # in Datenbank speichern...
```

Meine Idee kann man nach belieben weiter ausbauen... so wären zum Beispiel unterschiedliche Schlüssel für `set` und `run` denkbar und man könnte damit das Vieraugenprinzip erzwingen. Außerdem müsste man noch überlegen, ob jeder Berechtigte seinen eigenen Key bekommt oder ob man für jede Funkstelle einen shared Key nutzt.

Ein Nachteil ist auf jeden Fall: Man braucht auf beiden Seiten eine genaue Uhrzeit. Mit GPS, GLONASS und GALILEO sicherlich kein Problem, aber es sind zusätzliche Kosten.

Außerdem gibt es im Verlaufe des Jahres 2024 eine [Änderung der Amateurfunkverordnung](https://www.recht.bund.de/bgbl/1/2023/160/VO). In diesem Dokument gibt es auf der Seite 5 eine zum Thema passende Änderung des § 16 Abschnitt 8. Der neue Text erlaubt eine Ausnahme des Verschlüsslungsverbotes für Steuersignale für Erd- und Weltraumfunkstellen, Steuersignale, Remote-Betrieb, anderen fernbedienten oder automatisch arbeitenden Stationen.

## Warum kein fertiger Code?
Bei meiner Idee geht es mir um die Idee. Ich habe selbst keine Amateurfunkrelais und plane auch keinen Betieb solcher Technik. Ob meine Idee mit der neuen Verordnung noch einen Nutzen hat, weiß ich nicht. Außerdem fehlt mir das Wissen, wie ich meine Idee an die entsprechende Technik anbinden könnte. Eine Übertragung über das HamNet, TCP und Telnet wäre aber denkbar.

## Ist die Idee sicher?
Ich bin kein Experte für alle Sicherheitsfragen. Aber da die TOTPs oft auch für die Mehrfaktor-Authentisierung genutzt werden, sind diese geprüft und vertraut. Mit etwas Aufmerksamkeit bei der Hash-Prüfung sollte es wenig Angriffspunkte geben. Da die OTPs einer Hashfunktion ähnlich sind, gibt es natürlich auch hier Kollisionen und ein Angreifer könnte Glück haben. Außerdem wäre es sicherlich möglich den TOTP-Key mit genug öffentlichen Zahlenfolgen zu berechnen oder ihn zu erraten. Dagegen gibt es aber auch wie bei normalen Passwörtern eine einfache Lösung... ab und an wechseln.