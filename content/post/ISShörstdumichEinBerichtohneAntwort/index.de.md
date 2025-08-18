+++
title = 'ISS, hörst du mich? Ein Bericht ohne Antwort'
date = 2025-08-18T18:13:30+02:00
tags = [
    "ISS",
    "Space",
    "Funk",
    "Mailbox",
]
+++

Es gibt Projekte, die starten mit einer einfachen Idee und entwickeln sich zu einer faszinierenden technischen Reise. Mein Versuch, vor meinem Urlaub in Japan noch Funkkontakt mit einem japanischen Astronauten auf der Internationalen Raumstation (ISS) aufzunehmen, war genau so ein Projekt. Eines mit Höhen, Tiefen, einer Menge Lernfortschritten und einem Ende, das ich so nicht erwartet hätte.

## Die Mission: Ein Gruß nach oben

Alles begann mit dem Plan, dem japanischen JAXA-Astronauten Takuya Onishi (KF5LKS) einen Gruß per Amateurfunk auf die ISS zu senden. Als ich erfuhr, dass seine Zeit an Bord bald enden und er von Kimiya Yui (KG5BPH) abgelöst würde, passte ich mein Ziel an. Die Mission blieb dieselbe: Ein digitaler Händedruck über 400 km Weltraum, gesendet von meinem Standort in Grimma.

Mein Setup dafür: Mein treues Kenwood TH-D75E Handfunkgerät und mein Framework Laptop mit Arch Linux. Eine Kombination, die Flexibilität und Leistung verspricht.

## Die ersten Hürden: Wenn die Software nicht so will wie man selbst

Die Vorbereitung begann am Rechner. Die Installation der nötigen Software (`ax25-tools`) über `pikaur` war schnell erledigt. Doch schon der erste Test brachte eine klassische Linux-Herausforderung: Der Befehl zum Aufbau der Verbindung, den ich aus Anleitungen kannte, existierte auf meinem System nicht. Weder `axcall` noch `ax25_call` wurden gefunden. Nach einiger Recherche stieß ich auf den richtigen Befehl: `call`. Ein kleines, aber entscheidendes Detail.

Die ersten realen Versuche während exzellenter Überflüge mit über 80 Grad maximaler Höhe waren aufregend und ernüchternd zugleich. Mit dem `listen`-Befehl konnte ich die Frequenz auf 145.825 MHz live beobachten. Das Ergebnis war ein digitales Stimmengewirr, ein sogenanntes "Pile-up". Stationen aus ganz Europa versuchten gleichzeitig ihr Glück. In meinem Log sah ich zwar meine eigenen Sendeversuche (`fm DO3EET-9 to RS0ISS-11 ctl SABM+`), was ein riesiger Erfolg war – es bewies, dass meine komplette Sende- und Empfangskette funktionierte! Aber eine Antwort von der ISS blieb aus. Ich wurde einfach nicht gehört im digitalen Gedränge.

## Die Automatisierung: Ein Skript für den Bismarckturm

Einer meiner Lieblingsorte für solche Aktionen ist der Bismarckturm. Tolle Aussicht, freies Schussfeld zum Himmel – aber auch sehr wenig Schatten. Auf dem Laptop-Bildschirm bei voller Sonneneinstrahlung mehrere Befehle in verschiedene Terminals zu tippen, ist quasi unmöglich. Die Lösung: Automatisierung!

Was als einfacher Gedanke begann, wurde zu einer kleinen Odyssee der Skript-Entwicklung:

1.  **Die Basis-Version:** Ein einfaches Skript, das die Befehle für mich ausführt. Problem: Ich musste mehrmals mein `sudo`-Passwort eingeben. Absolut untauglich für den schnellen Einsatz im Freien.
2.  **Die `screen`-Lösung:** Um eine bessere Übersicht zu haben, baute ich das Skript um, sodass es `screen` startet und mir zwei Fenster gibt: eines zum Lauschen (`listen`) und eines zum Senden (`call`). Das war schon viel besser, aber das Kopieren der langen Nachricht fühlte sich immer noch nicht outdoor-tauglich an.
3.  **Die Deluxe-Version:** Der nächste Schritt war ein vertikaler Split in `screen`. Jetzt konnte ich den Funkverkehr und meine Eingabeaufforderung **gleichzeitig** sehen.
4.  **Die Vollautomatik mit `expect`:** Das letzte Problem – das manuelle Kopieren der Nachricht – löste ich mit `expect`, einem Tool zur Automatisierung interaktiver Dialoge. Das Ergebnis war ein vollautomatisches "Dashboard"-Skript. Ich musste es nur noch mit `sudo` starten, und es erledigte alles von allein.

```python
#!/binbin/bash

# ===================================================================
#      ISS PACKET RADIO DASHBOARD
# ===================================================================
# Dieses Skript baut eine geteilte screen-Ansicht auf:
# - Links: Live-Funkverkehr (listen)
# - Rechts: Vollautomatischer Sendeversuch (expect)
# ===================================================================

# --- Konfiguration ---
PORT="1"
TTY_DEVICE="/dev/ttyACM0"
TARGET_CALL="RS0ISS-11"
RECIPIENT_CALL="KG5BPH"
DEIN_CALL="DO3EET"
AUTO_SENDER_SCRIPT="iss_auto_sender.exp"
SCREEN_CONFIG="iss.screenrc"

# --- Skript-Vorbereitung ---
clear
echo "======================================================"
echo "              ISS Packet Radio Dashboard              "
echo "======================================================"
echo

# 1. Sudo-Check
if [ "$EUID" -ne 0 ]; then
  echo "FEHLER: Bitte starte dieses Skript mit 'sudo'."
  exit 1
fi

# 2. Schnittstelle aktivieren
echo ">>> Aktiviere AX.25-Schnittstelle..."
kissattach "$TTY_DEVICE" "$PORT"
sleep 1
# KORREKTUR: 'ifconfig' durch 'ip link show' ersetzt
if ! ip link show "ax$PORT" | grep -q "<UP"; then
    echo "FEHLER: Schnittstelle ax$PORT konnte nicht aktiviert werden."
    exit 1
fi
echo "Erfolg! Schnittstelle ax$PORT ist aktiv."
echo

# 3. Temporäres 'expect'-Skript für den Versand erstellen
cat > "$AUTO_SENDER_SCRIPT" <<-EOF
#!/usr/bin/expect -f
set timeout 360
spawn call $PORT $TARGET_CALL
expect "connected" {
    send_user "\n\nERFOLG: Verbindung zur ISS hergestellt! Sende Nachricht...\n"
} timeout {
    send_user "\n\nFEHLER: Zeitlimit überschritten. Keine Verbindung.\n"
    exit 1
}
sleep 1
send "S $RECIPIENT_CALL\r"
sleep 2
send "Welcome to the ISS!\r"
sleep 2
send "Hello Kimiya-san, welcome to the ISS! Greetings from Grimma, Germany. Hope you have a great mission. 73 de $DEIN_CALL.\r"
sleep 2
send "/EX\r"
sleep 3
send_user "\nNachricht gesendet. Trenne die Verbindung...\n"
send "B\r"
expect eof
EOF
chmod +x "$AUTO_SENDER_SCRIPT"

# 4. Temporäre Konfigurationsdatei für screen erstellen
cat > "$SCREEN_CONFIG" <<-EOF
# Starte 'listen' in der ersten Region (links)
screen -t "LISTEN" 0 listen -ac "$PORT"

# Erzeuge einen vertikalen Split
split -v

# Wechsle den Fokus in die neue, rechte Hälfte
focus

# Starte das Automatik-Skript in der zweiten Region
screen -t "AUTO-CALL" 1 ./"$AUTO_SENDER_SCRIPT"

# Setze den Fokus für den Start zurück nach oben/links
focus up
EOF

# 5. Dashboard starten
echo ">>> Starte 'screen'-Dashboard..."
echo "Steuerung: [Strg]+[A], dann [D] zum Verlassen."
echo
read -p "DRÜCKE [ENTER], um das Dashboard zu starten..."

screen -c "./$SCREEN_CONFIG"

# 6. Aufräumen, nachdem screen beendet wurde
rm "./$AUTO_SENDER_SCRIPT"
rm "./$SCREEN_CONFIG"
echo "Dashboard beendet und temporäre Dateien gelöscht."

```

## Die letzten Versuche: Ein perfektes System trifft auf die Realität

Mit diesem finalen, robusten Skript ging ich in die letzten Versuche. Das Dashboard funktionierte perfekt. Ich konnte live zusehen, wie links die Pakete von Stationen aus ganz Europa einliefen und rechts mein Skript geduldig auf eine Lücke wartete, um einen Verbindungsversuch zu starten.

Leider blieb das Ergebnis dasselbe. Trotz perfekter Überflüge und einem technisch einwandfreien System war der Andrang auf die ISS-Mailbox einfach zu groß.

## Fazit: Erfolgreich gescheitert

Und so muss ich mein Fazit ziehen, kurz bevor es für mich nach Japan geht: Die Mission, einen Kontakt herzustellen, ist **vorerst gescheitert**. Aber das Projekt an sich war ein **voller Erfolg**. Ich habe nicht nur viel über die Tücken des Packet-Radio-Protokolls gelernt, sondern auch ein vollautomatisches, felderprobtes System für Satellitenkommunikation von Grund auf entwickelt und getestet.

Die Jagd ist also nicht vorbei, sie ist nur pausiert. Wenn ich aus Japan zurück bin, werde ich mir einen "unbequemen" Überflug aussuchen – vielleicht spät in der Nacht an einem Dienstag. Wenn weniger los ist. Und dann, mit meinem fertigen Skript im Gepäck, werde ich es wieder versuchen.
