#!/usr/bin/env python3
import xml.etree.ElementTree as ET
import subprocess
import urllib.request
import os
import sys

# --- Konfiguration ---
RSS_URL = "https://do3eet.pages.dev/wifi/index.xml"
PREFIX = "DO3EET_" 
DRY_RUN = False    

def log(msg):
    # Einfaches Logging für systemd journal
    print(f"[WiFi-Sync] {msg}")

def get_nm_connections():
    """Holt alle Verbindungen, die mit dem Prefix starten."""
    # nmcli -t -f NAME,UUID connection show
    cmd = ["nmcli", "-t", "-f", "NAME,UUID", "connection", "show"]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    except subprocess.CalledProcessError:
        return {}

    connections = {}
    for line in result.stdout.splitlines():
        if not line: continue
        parts = line.split(":")
        if len(parts) < 2: continue
        
        name = parts[0]
        uuid = parts[1]
        
        if name.startswith(PREFIX):
            connections[name] = uuid
    return connections

def delete_connection(name, uuid):
    log(f"Lösche veraltetes Netzwerk: {name}")
    if not DRY_RUN:
        subprocess.run(["nmcli", "connection", "delete", uuid], check=False)

def add_or_update_connection(ssid, password, encryption):
    con_name = f"{PREFIX}{ssid}"
    
    # Check ob Connection existiert
    existing_cons = get_nm_connections()
    if con_name in existing_cons:
        # Existiert schon -> nichts tun
        return

    log(f"Lege neues Netzwerk an: {con_name} ({encryption})")
    
    if DRY_RUN:
        return

    # Basis-Befehl
    cmd = ["nmcli", "connection", "add", 
           "type", "wifi", 
           "con-name", con_name, 
           "ifname", "*", 
           "ssid", ssid]

    # Security Einstellungen
    if encryption == "WPA2" or encryption == "WPA3":
        cmd.extend(["wifi-sec.key-mgmt", "wpa-psk"])
        cmd.extend(["wifi-sec.psk", password])
    elif encryption == "NONE":
        pass # Offenes WLAN
    else:
        log(f"Überspringe {ssid}: Verschlüsselung '{encryption}' nicht implementiert.")
        return

    # User Permissions: Damit du als User das Netz nutzen/bearbeiten darfst
    user = os.environ.get('USER')
    if user:
         cmd.extend(["connection.permissions", f"user:{user}"])

    try:
        subprocess.run(cmd, check=True, capture_output=True)
        log(f"Erfolg: {con_name}")
    except subprocess.CalledProcessError as e:
        log(f"Fehler bei {con_name}: {e.stderr.decode('utf-8').strip()}")

def fetch_and_sync():
    log(f"Starte Sync mit {RSS_URL}")
    try:
        # Timeout setzen, damit der Service nicht hängt
        with urllib.request.urlopen(RSS_URL, timeout=30) as response:
            xml_data = response.read()
    except Exception as e:
        log(f"Netzwerkfehler beim Abrufen des Feeds: {e}")
        sys.exit(1)

    try:
        root = ET.fromstring(xml_data)
        # Namespace Map (Muss mit RSS Template übereinstimmen)
        ns = {'wifi': 'http://do3eet.pages.dev/ns/wifi'}
        
        channel = root.find('channel')
        if channel is None:
            log("Ungültiges RSS Format: Kein Channel gefunden.")
            sys.exit(1)

        feed_ssids = set()

        # 1. Neue Netzwerke anlegen
        for item in channel.findall('item'):
            # Zugriff auf die Custom Tags via Namespace
            ssid_elem = item.find('wifi:ssid', ns)
            pass_elem = item.find('wifi:password', ns)
            enc_elem = item.find('wifi:encryption', ns)
            
            if ssid_elem is None: continue
            
            ssid = ssid_elem.text
            encryption = enc_elem.text if enc_elem is not None else "NONE"
            password = pass_elem.text if pass_elem is not None else None
            
            # Wir bauen den Namen, wie er im NM stehen sollte
            con_name = f"{PREFIX}{ssid}"
            feed_ssids.add(con_name)
            
            # Nur hinzufügen, wenn PW da ist oder Encryption NONE
            if password or encryption == "NONE":
                add_or_update_connection(ssid, password, encryption)

        # 2. Alte löschen (Cleanup)
        # Wir löschen alles, was mit DO3EET_ beginnt, aber NICHT mehr im Feed ist.
        current_cons = get_nm_connections()
        for name, uuid in current_cons.items():
            if name not in feed_ssids:
                delete_connection(name, uuid)
                
    except ET.ParseError:
        log("Konnte XML nicht parsen.")
        sys.exit(1)

if __name__ == "__main__":
    fetch_and_sync()