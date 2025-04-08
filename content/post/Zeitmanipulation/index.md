+++
title = 'Zeitmanipulation'
date = 2025-04-07T13:58:56+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Open Source",
    "Hardware",
    "GPS",
    "NTP",
    "Zeit",
    ]
+++

Ich glaube jeder Mensch beschäftigt sich mindestens einmal in seinem Leben mit der Zeit. Dabei geht die Faszination nicht nur von Chronométrophilia aus, sondern einfach auch vom normalen Zeit geprägtem Leben. Der eine wartet auf die Liebe seines Lebens am Bahnhof, der andere nur auf den Feierabend. Für beide tickt die Uhr.  
Mich begeistert die Zeit besonders seit einem Artikel auf [sumikai.com](https://sumikai.com/nachrichten-aus-japan/studie-zeigt-dass-zeit-auf-dem-tokyo-skytree-tower-etwas-schneller-vergeht-271550/).  
Die Relativitätstheorie, insbesondere die Allgemeine Relativitätstheorie von Albert Einstein, sagt uns, dass die Zeit nicht für jeden gleich schnell vergeht. Sie hängt davon ab, wie stark das Gravitationsfeld ist und wie schnell sich jemand bewegt. Im Artikel wird dies mit dem Skytree in Tokyo wissenschaftlich nachgewiesen.

Auch im Urlaub ist die Zeit für mich relevant. Auf der einen Seite, um den Zug nicht zu verpassen, doch auch als elementarer Bestandteil von GPS zur Navigation in großen Städten. 

Und die NTP-Zeit ist für mich im beruflichen Leben für die Server administration von Bedeutung. Hier ist es immer wieder eine Anforderung, dass die Server mit einem zentralen Zeitserver in Sync sind und damit die Zeiten gleich sind.

# Warum ist NTP so wichtig?
Nun, Server erledigen unzählige Aufgaben, protokollieren jeden Schritt in Logdateien, speichern Daten in Datenbanken und kommunizieren miteinander. Wenn die Zeit auf diesen Systemen nicht übereinstimmt, entsteht ein heilloses Durcheinander. Zeitstempel in Logdateien werden inkonsistent, was die Fehlersuche zu einem Ratespiel macht. Stell dir vor, ein Fehler tritt auf, und du versuchst anhand der Logs herauszufinden, was passiert ist. Unterschiedliche Zeitangaben machen es unmöglich, die Ereigniskette nachzuvollziehen.  
Auch für die reibungslose Funktion deiner Anwendungen ist eine genaue Zeit entscheidend. Viele Prozesse, wie die Replikation von Datenbanken oder die Synchronisation von Dateien, verlassen sich auf eine konsistente Zeitbasis. Zeitabweichungen können hier zu Datenverlust oder Fehlfunktionen führen. Im Bereich der Sicherheit ist eine genaue Zeit sogar noch kritischer. Die Analyse von Sicherheitsvorfällen, die Gültigkeit von Zertifikaten und die Synchronisation von Sicherheitstoken – all das hängt von präzisen Zeitangaben ab.

# Warum ist die genaue Zeit bei GPS wichtig?
Wir nutzen GPS (Global Positioning System) heute fast täglich – sei es im Auto, auf dem Smartphone oder in der Smartwatch. Im Kern basiert GPS auf einem einfachen physikalischen Prinzip: `Entfernung = Geschwindigkeit × Zeit`. Das GPS-System besteht aus einem Netzwerk von Satelliten, die die Erde umkreisen. Jeder dieser Satelliten sendet kontinuierlich Signale aus. Diese Signale enthalten Informationen über die Position des Satelliten und, ganz entscheidend, die **exakte** Uhrzeit, zu der das Signal gesendet wurde.  
Dein GPS-Empfänger ließt diese Signale von mehreren Satelliten gleichzeitig. Er vergleicht die im Signal kodierte Sendezeit mit der Zeit, zu der er das Signal empfängt. Aus dieser Differenz kann er berechnen, wie lange das Signal unterwegs war. Da wir über Lichtgeschwindigkeit reden, sind diese Zeitunterschiede sehr klein.

Die genaue Positionierung durch GPS ist also untrennbar mit einer extrem genauen Zeitmessung verbunden. Es ist die Fähigkeit, Zeitintervalle im Nanosekundenbereich zu messen und zu verarbeiten, die es uns ermöglicht, unseren Standort so präzise zu bestimmen.

# Welche Angriffe gibt es?
## GPS
Gerade weil die präzise Zeit für GPS so fundamental ist, stellt sie auch ein attraktives Ziel für Angreifer dar. Die Störung oder Manipulation dieser Zeitsignale kann erhebliche Auswirkungen haben.

Jamming... Die einfachste und wahrscheinlich häufigste Form der Störung. Ein Angreifer verwendet einen Sender, um auf den GPS-Frequenzen starkes Rauschen oder Störsignale zu senden. Der Empfänger verliert den Satellitenkontakt und kann keine Position oder genaue Zeit mehr bestimmen. Es handelt sich um einen "Denial of Service"-Angriff. 

Richtig fies ist aber das GPS-Spoofing... Dies ist eine wesentlich raffiniertere Angriffsmethode auf das GPS-Signal. Statt die Signale nur zu blockieren, sendet der Angreifer gefälschte GPS-Signale. Diese Signale imitieren echte Satellitensignale, enthalten aber falsche Informationen – insbesondere eine falsche Zeit und/oder falsche Satellitenpositionen. Der Empfänger berechnet eine falsche Position und/oder eine falsche Uhrzeit, ohne es zu merken. Das System glaubt, es sei woanders oder es sei eine andere Zeit. Dies kann dazu führen, dass Schiffe bzw. Flugzeuge vom Kurs abkommen, Drohnen in falsche Gebiete explodieren oder zeitkritische Systeme gestört werden.

## NTP
Wie bei jedem IT-System sind Denial of Service an der Tagesordnung für NTP-Server und nichts Neues. Daher nutzen Systeme meist mehrere Server bzw. ganze Server-Pools um die aktuelle Uhrzeit zu bestimmen. Besonders perfide bei NTP-Servern ist, dass diese bei falscher Konfig auch für DDoS-Verstärker genutzt werden können.  
Aber auch wie bei GPS gibt es Angreifer die NTP-Pakete ab fangen und die Zeitstempel darin ändern. Der Client berechnet auf Basis der manipulierten Daten eine falsche Zeit.

# Mein Versuch Angriffe zu erkennen...
Meine Idee ist es einen möglichen Angriff auf eines dieser Signale zu erkennen, in dem man den Drift zum anderen Signal überwacht. Natürlich braucht man dafür viele Daten, um für seinen Standort und seine Internetverbindung eine normale Schwankung im Drift von einem Angriff zu unterscheiden. Aber den Anfang habe ich schon geamcht und möchte ihn nicht verstecken.

## Grafische Anzeige
{{< imgwebp src="1.jpg" alt="Die GUI" width="1024" height="1024" >}}
Ganz oben wird die aktuelle Uhrzeit angezeigt, die direkt von einem GPS-Empfänger stammt. Darunter listet das Tool die Uhrzeiten auf, die es von verschiedenen NTP-Servern (Network Time Protocol) erhalten hat. Untenstehend wird die Differenz zwischen der GPS-Zeit und der Zeit jedes einzelnen NTP-Servers berechnet und in Millisekunden (ms) angezeigt. Ein kleiner Drift ist normal und entsteht durch Netzwerklaufzeiten und die Verarbeitungsgeschwindigkeit der Systeme.
```html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GPS/NTP Drift Monitor</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #1a202c; /* Dunkler Hintergrund */
            color: #e2e8f0; /* Helle Schriftfarbe */
        }
        .bg-dark {
            background-color: #2d3748; /* Dunklere Hintergrundfarbe für Container */
        }
        .text-light {
            color: #e2e8f0; /* Helle Schriftfarbe */
        }
        .text-accent {
            color: #63b3ed; /* Akzentfarbe für Titel */
        }
        .logo {
            max-width: 100px; /* Maximale Breite des Logos */
            margin: 0 auto; /* Zentrieren */
            display: block;
        }
    </style>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        'inter': ['Inter', 'sans-serif'],
                    },
                },
            },
        }
    </script>
</head>
<body class="p-6">
    <div class="container max-w-2xl mx-auto bg-dark shadow-md rounded-lg p-8">
        <!-- Logo hinzufügen -->
        <img src="{{ url_for('static', filename='cuteGPS.webp') }}" alt="GPS Logo" class="logo mb-4">
        <h1 class="text-3xl font-semibold text-accent text-center mb-6">GPS/NTP Drift Monitor</h1>
        <div class="mb-6">
            <h2 class="text-xl font-semibold text-light mb-3">GPS Zeit:</h2>
            <div id="gps-time" class="text-lg text-light p-4 bg-gray-700 rounded-md">Lädt...</div>
        </div>
        <div class="mb-6">
            <h2 class="text-xl font-semibold text-light mb-3">NTP Zeiten:</h2>
            <div id="ntp-times" class="space-y-2">
                <!-- NTP Zeiten werden hier dynamisch eingefügt -->
            </div>
        </div>
        <div class="mb-6">
            <h2 class="text-xl font-semibold text-light mb-3">Drift (GPS - NTP):</h2>
            <div id="drifts" class="space-y-4">
                <!-- Drift-Werte werden hier dynamisch eingefügt -->
            </div>
        </div>
        <div class="text-center mt-8">
            <p class="text-gray-400 text-sm">Daten werden alle 5 Sekunden aktualisiert.</p>
        </div>
    </div>

    <script>
        const gpsTimeElement = document.getElementById('gps-time');
        const ntpTimesElement = document.getElementById('ntp-times');
        const driftsElement = document.getElementById('drifts');

        function updateData() {
            fetch('/data')
                .then(response => response.json())
                .then(data => {
                    // GPS Zeit aktualisieren
                    gpsTimeElement.textContent = data.gps_time ? new Date(data.gps_time).toLocaleString() : 'Keine Daten';

                    // NTP Zeiten aktualisieren
                    ntpTimesElement.innerHTML = ''; // Vorherige Inhalte löschen
                    if (data.ntp_times) {
                        for (const server in data.ntp_times) {
                            const ntpTime = data.ntp_times[server] ? new Date(data.ntp_times[server]).toLocaleString() : 'Keine Daten';
                            const ntpDiv = document.createElement('div');
                            ntpDiv.className = 'p-2 bg-gray-700 rounded-md text-light';
                            ntpDiv.textContent = `${server}: ${ntpTime}`;
                            ntpTimesElement.appendChild(ntpDiv);
                        }
                    }

                    // Drifts aktualisieren
                    driftsElement.innerHTML = ''; // Vorherige Inhalte löschen
                    if (data.drifts) {
                        for (const server in data.drifts) {
                            const driftValue = data.drifts[server] !== null ? data.drifts[server].toFixed(2) + ' ms' : 'Keine Daten';

                            const driftDiv = document.createElement('div');
                            driftDiv.className = 'p-2 bg-gray-700 rounded-md text-light';
                            driftDiv.textContent = `${server}: ${driftValue}`;
                            driftsElement.appendChild(driftDiv);
                        }
                    }
                })
                .catch(error => {
                    console.error('Fehler beim Abrufen der Daten:', error);
                    gpsTimeElement.textContent = 'Fehler beim Abrufen der Daten';
                    ntpTimesElement.innerHTML = 'Fehler beim Abrufen der Daten';
                    driftsElement.innerHTML = 'Fehler beim Abrufen der Daten';
                });
        }

        updateData(); // Initiales Update
        setInterval(updateData, 5000); // Aktualisierung alle 5 Sekunden
    </script>
</body>
</html>
```
Dieser HTML-Code redet mit Flask im Backend um die Informationen dem User zu zeigen.

## Backend
Mein Backend ist in Python geschrieben. Es ist so ziemlich für alles mein Favorit, kann mir aber vorstellen es gäbe bessere Sprachen für dieses Projekt. Normalerweise hätte ich `argargparse` von Python genutzt, um die Configuration zu ermöglichen. Für diesen Blog habe ich mich für den Zweck der Nachvollziehbarkeit dagegen entschieden. Gleichzeitig ist es mein erstes Skript mit `asyncio`.

```python
import asyncio
import re
import time
from datetime import datetime, timedelta, timezone
import logging
import ntplib
import serial
from flask import Flask, jsonify, render_template  # Importiere Flask
from tinyflux import Point, TinyFlux  # Importiere TinyFlux und Point
from tinyflux.queries import (FieldQuery, Query, TagQuery,  # Importiere Query
                              TimeQuery)

# Konfiguration der seriellen Schnittstelle für die GPS-Maus
serial_port = "/dev/ttyACM0"
baud_rate = 9600
timeout = 1

# NTP-Server Liste
ntp_servers = ["1.europe.pool.ntp.org", "0.europe.pool.ntp.org"]

# Globale Variablen
latest_gps_time = None
latest_ntp_times = {}
latest_drifts = {}
gps_serial = None

# TinyFlux Datenbank initialisieren
db = TinyFlux("time_data.json")  # Verwende eine Datei zum Speichern der Daten
tag_query = TagQuery()
time_query = TimeQuery()

# Flask App initialisieren
app = Flask(__name__)


# Funktion zur Extraktion der Zeit vom GPS
def get_gps_time():
    """
    Liest Daten von der seriellen Schnittstelle, extrahiert die Zeit aus dem GPRMC-Satz
    und konvertiert sie in ein datetime-Objekt.
    """
    global latest_gps_time, gps_serial
    if gps_serial is None:
        try:
            gps_serial = serial.Serial(serial_port, baud_rate, timeout=timeout)
            logging.info(f"Serielle Verbindung zu {serial_port} hergestellt.")
        except serial.SerialException as e:
            logging.error(f"Fehler beim Öffnen der seriellen Schnittstelle {serial_port}: {e}")
            return None
    try:
        line = gps_serial.readline().decode("utf-8", errors="ignore").strip()
        if line.startswith("$GPRMC"):
            parts = line.split(",")
            if parts[2] == "A":
                try:
                    time_str = parts[1]
                    date_str = parts[9]
                    day = int(date_str[0:2])
                    month = int(date_str[2:4])
                    year = 2000 + int(date_str[4:6])
                    hour = int(time_str[0:2])
                    minute = int(time_str[2:4])
                    second = int(time_str[4:6])
                    microsecond = (
                        int(float(time_str[7:]) * 1000) if len(time_str) > 6 else 0
                    )
                    latest_gps_time = datetime(
                        year,
                        month,
                        day,
                        hour,
                        minute,
                        second,
                        microsecond,
                        tzinfo=timezone.utc,
                    )
                    logging.info(f"GPS Zeit (parsed): {latest_gps_time}")
                    return latest_gps_time
                except ValueError as e:
                    logging.error(f"Error beim Parsen der GPS-Zeit: {e}, Zeile: {line}")
                    latest_gps_time = None
                    return None
            else:
                logging.error("GPS Zeit ungültig (V)")
                latest_gps_time = None
                return None
    except serial.SerialException as e:
        logging.error(f"Fehler beim Lesen von der seriellen Schnittstelle: {e}")
        latest_gps_time = None
        try:
            gps_serial.close()
            gps_serial = serial.Serial(serial_port, baud_rate, timeout=timeout)
            logging.info("Serielle Verbindung wiederhergestellt.")
        except serial.SerialException as e:
            logging.error(f"Fehler beim Wiederherstellen der seriellen Verbindung: {e}")
        return None
    except UnicodeDecodeError as e:
        logging.error(f"Fehler beim Dekodieren der seriellen Daten: {e}, Zeile: {line}")
        latest_gps_time = None
        return None
    except Exception as e:
        logging.error(f"Ein unerwarteter Fehler ist aufgetreten: {e}")
        latest_gps_time = None
        return None


# Funktion zum Abrufen der NTP-Zeit
def get_ntp_time(server):
    """
    Ruft die Zeit von einem NTP-Server ab.
    """
    global latest_ntp_times
    try:
        ntp_time = ntplib.NTPClient().request(server, version=3).tx_time
        ntp_time_datetime = datetime.fromtimestamp(ntp_time, tz=timezone.utc)
        latest_ntp_times[server] = ntp_time_datetime
        logging.info(f"NTP Zeit von {server}: {ntp_time_datetime}")
        return latest_ntp_times[server]
    except Exception as e:
        logging.error(f"Fehler beim Abrufen der NTP-Zeit von {server}: {e}")
        latest_ntp_times[server] = None
        return None


# Funktion zur Berechnung der Zeitabweichung
def calculate_drift(gps_time, ntp_time):
    """
    Berechnet die Zeitabweichung zwischen GPS- und NTP-Zeit in Millisekunden.
    """
    if gps_time is None or ntp_time is None:
        return None
    return (ntp_time - gps_time).total_seconds() * 1000


# Funktion zum Aktualisieren der Daten (wird von Flask aufgerufen)
def update_data():
    """
    Ruft GPS- und NTP-Zeit ab und speichert sie in der Datenbank.
    Berücksichtigt die Zeitverzögerung bei der Drift-Berechnung.
    """
    global latest_gps_time, latest_ntp_times, latest_drifts
    gps_time = get_gps_time()
    if gps_time:
        for server in ntp_servers:
            # Messen der Zeit vor dem Abrufen der NTP-Zeit
            start_time = datetime.now(timezone.utc)
            ntp_time = get_ntp_time(server)
            # Messen der Zeit nach dem Abrufen der NTP-Zeit
            end_time = datetime.now(timezone.utc)

            if ntp_time:
                # Berechnung der mittleren Verzögerung
                processing_delay = (end_time - start_time).total_seconds() / 2
                # Anpassung der NTP-Zeit
                adjusted_ntp_time = ntp_time - timedelta(seconds=processing_delay)

                drift = calculate_drift(gps_time, adjusted_ntp_time)
                if drift is not None:
                    latest_drifts[server] = drift
                    # Speichere die Daten in der TinyFlux Datenbank
                    db.insert(
                        Point(
                            measurement="time_data",
                            tags={"source": "GPS"},
                            fields={
                                "time": gps_time.timestamp()
                            },  # Als Unix-Zeitstempel speichern
                        )
                    )
                    db.insert(
                        Point(
                            measurement="time_data",
                            tags={"source": f"NTP-{server}"},
                            fields={
                                "time": adjusted_ntp_time.timestamp()
                            },  # Als Unix-Zeitstempel speichern
                        )
                    )
                    db.insert(
                        Point(
                            measurement="drift_data",
                            tags={"server": server},
                            fields={"drift": drift},
                            time=datetime.now(
                                timezone.utc
                            ),  # Zeitstempel für den Drift
                        )
                    )
                else:
                    latest_drifts[server] = None
            else:
                latest_drifts[server] = None
    else:
        for server in ntp_servers:
            latest_drifts[server] = None
    return True


@app.route("/")
def index():
    """
    Rendert die Hauptseite der Webanwendung.
    """
    return render_template("index.html")


@app.route("/data")
def get_data():
    """
    Gibt die aktuellen GPS-Zeit, NTP-Zeiten und Abweichungen im JSON-Format zurück.
    """
    global latest_gps_time, latest_ntp_times, latest_drifts
    update_data()
    # Lese die neuesten Daten aus der TinyFlux Datenbank
    gps_data = db.search(tag_query.source == "GPS")
    latest_gps_data = (
        datetime.fromtimestamp(gps_data[-1].fields["time"], tz=timezone.utc)
        if gps_data
        else None
    )

    drift_data_list = db.search(tag_query.server.exists())
    latest_drifts_data = {}
    if drift_data_list:
        for entry in drift_data_list:
            if "drift" in entry.fields:  # Überprüfen, ob 'drift' existiert
                latest_drifts_data[entry.tags["server"]] = entry.fields["drift"]
            else:
                logging.warning(f"Warnung: Eintrag ohne 'drift'-Feld gefunden: {entry}")
    else:
        latest_drifts_data = {}

    latest_ntp_times_data = {}
    for server in ntp_servers:
        ntp_data = db.search(tag_query.source == f"NTP-{server}")
        latest_ntp_times_data[server] = (
            datetime.fromtimestamp(ntp_data[-1].fields["time"], tz=timezone.utc)
            if ntp_data
            else None
        )

    return jsonify(
        {
            "gps_time": latest_gps_data.isoformat() if latest_gps_data else None,
            "ntp_times": {
                server: time.isoformat() if time else None
                for server, time in latest_ntp_times_data.items()
            },
            "drifts": latest_drifts_data,
            "ntp_servers": ntp_servers,
        }
    )


def start_background_task():
    """
    Startet eine Hintergrundaufgabe, um die Daten regelmäßig zu aktualisieren.
    """
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    while True:
        update_data()
        time.sleep(5)
    loop.close()


import threading

if __name__ == "__main__":
    logging.basicConfig(
    level=logging.DEBUG,  # Log-Level (z. B. DEBUG, INFO, WARNING, ERROR, CRITICAL)
    format="%(asctime)s - %(levelname)s - %(message)s",  # Log-Format
    )
    # Starte den Hintergrund-Thread
    background_thread = threading.Thread(target=start_background_task)
    background_thread.daemon = True
    background_thread.start()
    # Starte die Flask-App
    app.run(debug=True, host="0.0.0.0")
```
### GPS-Daten lesen
Die Funktion `get_gps_time` liest Daten von einer seriellen Schnittstelle, extrahiert die Zeitinformationen aus einem GPS-Datensatz im NMEA-Format und konvertiert diese in ein `datetime`-Objekt. Sie ist darauf ausgelegt, mit GPS-Modulen zu arbeiten, die über serielle Kommunikation Daten senden. Die Funktion verwendet globale Variablen wie `latest_gps_time` und `gps_serial`, um den zuletzt erfassten Zeitstempel und die serielle Verbindung zu verwalten.

Zu Beginn überprüft die Funktion, ob die serielle Verbindung (`gps_serial`) bereits initialisiert ist. Falls nicht, wird versucht, eine Verbindung mit den in den Variablen `serial_port`, `baud_rate` und `timeout` definierten Parametern herzustellen. Bei einem Fehler während der Initialisierung wird eine Fehlermeldung protokolliert, und die Funktion gibt `None` zurück.

Die Funktion liest anschließend eine Zeile von der seriellen Schnittstelle, dekodiert sie als UTF-8 und entfernt unerwünschte Leerzeichen. Wenn die Zeile mit `$GPRMC` beginnt, wird sie in ihre Bestandteile zerlegt. Der dritte Teil des Datensatzes (`parts[2]`) gibt an, ob die GPS-Daten gültig sind. Nur wenn dieser Wert `A` ist, werden die Zeit- und Datumsinformationen weiterverarbeitet. Die Zeit (`parts[1]`) und das Datum (`parts[9]`) werden extrahiert und in ihre jeweiligen Komponenten (Stunde, Minute, Sekunde, Tag, Monat, Jahr) zerlegt. Falls die Zeitangabe Millisekunden enthält, werden diese ebenfalls berücksichtigt. Mit diesen Informationen wird ein `datetime`-Objekt erstellt, das die UTC-Zeitzone verwendet, und in der globalen Variable `latest_gps_time` gespeichert.

Falls während der Verarbeitung ein Fehler auftritt, wie z. B. ein ungültiges Zeitformat (`ValueError`), wird eine Fehlermeldung protokolliert, und die Funktion gibt `None` zurück. Ähnliche Fehlerbehandlungsmechanismen existieren für Probleme beim Lesen der seriellen Schnittstelle (`serial.SerialException`), Dekodierungsfehler (`UnicodeDecodeError`) und andere unerwartete Ausnahmen. Bei einem Verbindungsfehler versucht die Funktion, die serielle Verbindung neu zu initialisieren.

Auch sehr wichtig, diese Funktion funktioniert nicht mehr wenn GPSd läuft. Dieses Tool ändert die Ausgabe des GPS-Empfänger in ein anderes Format, welches ich nicht verstehe...