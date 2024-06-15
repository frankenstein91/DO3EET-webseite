+++
title = 'Dachbodenfund alte Webcam'
date = 2024-06-15T19:36:38+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Hardware",
    "Firmware",
    "WebCam",
    "alt",
]
+++

# Nugriff auf die Kamera
In meiner ersten Ausbildung habe ich mir eine Hootoo HT-IP206 gekauft, um etwas mit Live-Streaming zu experimentieren. Diese habe ich nun staubig auf dem Dachboden wieder gefunden. Auch wenn die Kamera eigentlich steinalt ist, habe ich mich drangemacht um sie wieder in Betrieb zu nehmen.

Der erste Schritt war es die Kamera an das Netzwerk anzubinden, dafür habe ich erst einen Hardwarereset mit Büroklammer durchgeführt. Im Anschluss wurde die Webcam mit einem Labor-VLAN ohne Internet verbunden. Im Netzwerk meldete sich die Kamera gleich als `ipcam_E8ABFA190420`.

Da Web-Interface war schnell gefunden, doch der Browser leider zu neu (zumindest der Firefox, später stellte ich fest Chrome ging). Ich nutzte eine ReactOS-VBox um mit einem veralteten Firefox und VLC auf die Kamera zuzugreifen. Der Zugang erfolgt mit dem Nutzer `admin` und einem leeren Passwort über HTTP-Basic Auth.

Da ich am Anfang Probleme mit der Anmeldung an der WebCam hatte und nun wusste es ist Basic-Auth, versuchte ich den Zugriff auf die Webcam von meinem ArchLinux-System mit der URL `http://admin@192.168.1.2:80/` und stellt fest, auch der aktuelle Firefox kann die Webcam bedienen.

# Firmwareupdate
Im Webinterface gab es eine Möglichkeit die Firmware auf einen neueren Stand zu bringen, das Problem war nur die Dateien zu finden. Die alte Version auf der Kamera war für das System 17.37.2.41 und für die WebUI 20.8.1.132.