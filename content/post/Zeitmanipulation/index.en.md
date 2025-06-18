+++
title = 'Chronokinesis'
date = 2025-04-08T10:07:00+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Open Source",
    "Hardware",
    "GPS",
    "NTP",
    "Time",
    ]
+++

I believe everyone contemplates time at least once in their life. This fascination doesn't just stem from Chronométrophilia, but also simply from a normal life shaped by time. One person might be waiting for the love of their life at the train station, another just for the workday to end. For both, the clock ticks on.  
My fascination with time was particularly sparked by an article on [sumikai.com](https://sumikai.com/nachrichten-aus-japan/studie-zeigt-dass-zeit-auf-dem-tokyo-skytree-tower-etwas-schneller-vergeht-271550/).  
The theory of relativity, particularly Albert Einstein's General Theory of Relativity, tells us that time does not pass at the same rate for everyone. It depends on the strength of the gravitational field and how fast someone is moving. The article scientifically demonstrates this using the Tokyo Skytree.

Time is also relevant to me on vacation. On the one hand, to avoid missing the train, but also as a fundamental component of GPS for navigating in large cities.

And in my professional life, NTP time is important for server administration. Here, it is a constant requirement that the servers are in sync with a central time server, ensuring that their times are consistent.

# Why is NTP so important?
Well, servers perform countless tasks: they log every step in log files, save data in databases, and communicate with each other. If the time on these systems doesn't match, it creates utter chaos. Timestamps in log files become inconsistent, which turns troubleshooting into a guessing game. Imagine an error occurs, and you're trying to figure out what happened from the logs. Conflicting timestamps make it impossible to trace the sequence of events.  
Accurate time is also crucial for the smooth operation of your applications. Many processes, such as database replication or file synchronization, rely on a consistent time base. Time discrepancies here can lead to data loss or malfunctions. When it comes to security, accurate time is even more critical. The analysis of security incidents, the validity of certificates, and the synchronization of security tokens—all of these depend on precise timekeeping.

# Why is accurate time important for GPS?
We use GPS (Global Positioning System) almost daily—whether in our cars, on our smartphones, or on our smartwatches. At its core, GPS is based on a simple physical principle: `Distance = Speed × Time`. The GPS system consists of a network of satellites orbiting the Earth. Each of these satellites continuously transmits signals. These signals contain information about the satellite's position and, crucially, the **exact** time at which the signal was sent.  
Your GPS receiver reads these signals from multiple satellites simultaneously. It compares the transmission time encoded in the signal with the time it receives the signal. From this difference, it can calculate how long the signal was traveling. Since we are talking about the speed of light, these time differences are minuscule.

Precise positioning with GPS is therefore inextricably linked with extremely accurate time measurement. It is the ability to measure and process time intervals in the nanosecond range that allows us to determine our location so precisely.

# What Kinds of Attacks Are There?
## GPS
Precisely because accurate time is so fundamental to GPS, it's also an attractive target for attackers. The disruption or manipulation of these time signals can have significant consequences.

Jamming... This is the simplest and probably most common form of interference. An attacker uses a transmitter to broadcast strong noise or disruptive signals on GPS frequencies. The receiver loses satellite contact and can no longer determine its position or the accurate time. This constitutes a Denial of Service (DoS) attack.

GPS Spoofing, however, is particularly nasty... This is a much more sophisticated method of attack on the GPS signal. Instead of just blocking the signals, the attacker broadcasts counterfeit GPS signals. These signals imitate real satellite signals but contain false information—specifically, an incorrect time and/or incorrect satellite positions. The receiver then calculates a wrong position and/or an incorrect time without realizing it. The system believes it is somewhere else or that it is a different time. This can cause ships and aircraft to go off course, lead to drones being misdirected into incorrect areas, or disrupt time-critical systems.

## NTP
As with any IT system, Denial of Service attacks are commonplace for NTP servers and are nothing new. Therefore, systems usually use multiple servers or even entire server pools to determine the current time. What's particularly insidious about NTP servers is that, if misconfigured, they can also be exploited for DDoS amplification attacks.

But just as with GPS, there are also attackers who intercept NTP packets and alter the timestamps within them. The client then calculates an incorrect time based on this manipulated data.

# My Attempt to Detect Attacks...
My idea is to detect a potential attack on one of these signals by monitoring its drift relative to the other signal. Of course, this requires a lot of data to differentiate the normal drift fluctuations for a specific location and internet connection from an actual attack. But I've already made a start, and I don't want to hide it.

## GUI
{{< imgwebp src="1.jpg" alt="Die GUI" width="1024" height="1024" >}}
At the very top, the current time is displayed, sourced directly from a GPS receiver. Below that, the tool lists the times it has received from various NTP (Network Time Protocol) servers. Further down, the difference between the GPS time and the time from each individual NTP server is calculated and displayed in milliseconds (ms). A small amount of drift is normal and is caused by network latency and system processing speeds.
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
This code talks to the flask backend.

## Backend
My backend is written in Python. It's my favorite for just about everything, though I can imagine there might be better languages for this specific project. Normally, I would have used Python's `argparse` module to handle configuration. For this blog post, however, I decided against it for the sake of clarity and to make the code easier to follow. This is also my first script using `asyncio`.

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
### Reading GPS Data
The `get_gps_time` function reads data from a serial port, extracts time information from a GPS data sentence in NMEA format, and converts it into a `datetime` object. It is designed to work with GPS modules that transmit data via serial communication. The function uses global variables like `latest_gps_time` and `gps_serial` to manage the most recently captured timestamp and the serial connection.

Initially, the function checks if the serial connection (`gps_serial`) is already initialized. If not, it attempts to establish a connection using the parameters defined in the `serial_port`, `baud_rate`, and `timeout` variables. If an error occurs during initialization, an error message is logged, and the function returns `None`.

The function then reads a line from the serial port, decodes it as UTF-8, and strips any unwanted whitespace. If the line starts with `$GPRMC`, it is split into its components. The third part of the data sentence (`parts[2]`) indicates whether the GPS data is valid. Only if this value is `A` is the time and date information processed further. The time (`parts[1]`) and the date (`parts[9]`) are extracted and broken down into their respective components (hour, minute, second, day, month, year). If the time string includes milliseconds, these are also taken into account. With this information, a `datetime` object using the UTC timezone is created and stored in the global `latest_gps_time` variable.

If an error occurs during processing, such as an invalid time format (`ValueError`), an error message is logged, and the function returns `None`. Similar error-handling mechanisms exist for problems reading from the serial port (`serial.SerialException`), decoding errors (`UnicodeDecodeError`), and other unexpected exceptions. In case of a connection error, the function attempts to re-initialize the serial connection.

Also very important: this function will not work if `gpsd` is running. This tool changes the output of the GPS receiver to a different format, which this script is not designed to parse.

### Fetching NTP Time
The `get_ntp_time` function is built to communicate with NTP servers using the appropriate Python libraries. For my tool, I didn't want to rely on the system time and system configuration; I hope that wasn't a mistake. Since ready-made libraries for NTP already exist, this section of the code is naturally much shorter than the GPS section.

### Database
TinyFlux is an open-source database library designed specifically for storing and querying time-series data in Python. You can think of it as a greatly simplified, file-based alternative to larger time-series databases like InfluxDB. Instead of a complex server, TinyFlux stores its data in a single file, typically in JSON format. This significantly simplifies setup and management, especially for smaller projects or local applications.

## Future Ideas...
I would like to network this script... By that, I mean creating a central database for the time drift. Perhaps it would also be possible in the future to integrate this tool into the honeypot from Deutsche Telekom Security GmbH. This attack monitoring solution is already openly available on [GitHub](https://github.com/telekom-security/tpotce).

Another idea for such a solution would be a distributed database, similar to the Yacy search engine or other P2P services.

Supporting multiple GPS receivers also sounds tempting, but I currently lack the necessary hardware for it.

My final future idea is to make this available for mobile phones. Old phones are often just lying around, but they offer a large number of interfaces and sensors. This usually includes a very good GPS receiver, which would be great for this project.