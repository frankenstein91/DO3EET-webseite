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
In meiner ersten Ausbildung habe ich mir eine Hootoo HT-IP206 gekauft, um etwas mit Live-Streaming zu experimentieren. Diese habe ich nun staubig auf dem Dachboden wieder gefunden. Auch wenn die Kamera eigentlich steinalt ist, habe ich mich dran gemacht um sie wieder in Betrieb zu nehmen.

{{< imgwebp src="PXL_20240615_173019869.jpg" alt="Hootoo HT-IP206" width="1024" height="1024" >}}

{{< imgwebp src="PXL_20240615_173051193~2.jpg" alt="Hootoo HT-IP206" width="1024" height="1024" >}}


Der erste Schritt war es die Kamera an das Netzwerk anzubinden, dafür habe ich erst einen Hardwarereset mit Büroklammer durchgeführt. Im Anschluss wurde die Webcam mit einem Labor-VLAN ohne Internet verbunden. Im Netzwerk meldete sich die Kamera gleich als `ipcam_E8ABFA190420`.

Da Web-Interface war schnell gefunden, doch der Browser leider zu neu (zumindest der Firefox, später stellte ich fest Chrome ging). Ich nutzte eine ReactOS-VBox um mit einem veralteten Firefox und VLC auf die Kamera zuzugreifen. Der Zugang erfolgt mit dem Nutzer `admin` und einem leeren Passwort über HTTP-Basic Auth.

Da ich am Anfang Probleme mit der Anmeldung an der WebCam hatte und nun wusste es ist Basic-Auth, versuchte ich den Zugriff auf die Webcam von meinem ArchLinux-System mit der URL `http://admin@192.168.1.2:80/` und stellt fest, auch der aktuelle Firefox kann die Webcam bedienen.

# Firmwareupdate
Im Webinterface gab es eine Möglichkeit die Firmware auf einen neueren Stand zu bringen, das Problem war nur die Dateien zu finden. Die alte Version auf der Kamera war für das System 17.37.2.41 und für die WebUI 20.8.1.132. Durch den [Blog von Robin](https://blog.moneybag.de/hootoo-wlan-pan-tilt-ip-webcam-ein-erfahrungsbericht/comment-page-6/) bin ich auf den ursprünglichen Hersteller apexis gestoßen. Sowohl Hootoo, als auch apexis, bietet auf Ihren aktuellen Webseiten keine Firmware mehr für diese Kamera an. Also habe ich über web.archive.org versucht den genauen Produktnamen zu bestimmen. Durch einen Bildvergleich bin ich auf den Namen APM-J011 gekommen, konnte aber keine Firmware dafür finden. Auf der [Website im Archiv](https://web.archive.org/web/20150106171303/http://www.apexis.com.cn:80/en/download-1.html) konnte ich aber eine Firmware finden, die von der Versionsnummer ähnlich aussah. Ich habe also die RAR-Datei unter dem Punkt "Firmware of j802.j803.j603.j805_17_37_2_49" heruntergeladen und ganz nach dem Verfahren YOLO installiert. Das Gerät hat die Datei akzeptiert und nach ca. zwei Minuten mit der neuen Version neu gestartet.

Die Firmware und die Weboberfläche sind bei dem Gerät getrennte Dateien, daher habe ich auch noch die Datei unter dem Punkt "Upgrade package of web UI (MJ745)" geladen. Auch hier habe ich erstmal nur geraten durch das "J" im Namen. In der RAR-Datei konnte ich im Pfad `/MJ745_WEBUI通用升级包_20131104/j011-1/` eine WebUI Version finden, die zum Gerät passt. Hier habe ich am Ordnernamen geraten und richtig getippt. Damit ist die Kamera nun auf der neusten Version des Herstellers. 

# Information aus der Firmware
So ganz bin ich mit dem bin-File nicht klar gekommen, doch ich habe gesehen es ist `Linux version 2.4.20-uc0 (root@maverick-linux) (gcc version 3.0) #1924` beim Linux Kernel angegeben. Außerdem scheint er für armv3 erstellt wurden zu sein. Auch ein romfs-Image ist in der Datei, doch leider war es mir nicht möglich dieses Image zu öffnen.
