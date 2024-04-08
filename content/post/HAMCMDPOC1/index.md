+++
title = 'Befehle über HAM'
date = 2024-04-09T21:24:20+02:00
draft = false
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

Um eine Kollsion bei mehreren Admins zu vermeiden sollte man sicherstellen, dass nur der letzte Befehl ausführbar ist.