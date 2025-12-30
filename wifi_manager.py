import json
import os
import datetime

# --- Konfiguration ---
SOURCE_FILE = "wifi_source.json"       # Deine "Datenbank" (Git-tracked)
EXPORT_FILE = "data/wifi_hotspots.json" # Für Hugo (Generiert)

def load_db():
    """Lädt die JSON Datenbank."""
    if not os.path.exists(SOURCE_FILE):
        print(f"Fehler: {SOURCE_FILE} nicht gefunden. Bitte erstelle sie mit dem Template.")
        return None
    with open(SOURCE_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_db(data):
    """Speichert die JSON Datenbank (formatiert für Git)."""
    with open(SOURCE_FILE, 'w', encoding='utf-8') as f:
        # indent=2 sorgt für schöne Diffs in Git
        # ensure_ascii=False sorgt dafür, dass Kanji/Umlaute lesbar bleiben
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"💾 Datenbank gespeichert: {SOURCE_FILE}")

def get_next_id(data, key):
    """Holt die nächste ID und inkrementiert den Zähler."""
    current = data['meta'][key]
    data['meta'][key] += 1
    return current

def add_hotspot(data):
    print("\n--- Neuen Hotspot anlegen ---")
    ssid = input("SSID: ")
    desc = input("Beschreibung (Ort): ")
    lat = input("Latitude (optional): ")
    lon = input("Longitude (optional): ")
    
    # Neue ID holen
    new_id = get_next_id(data, 'next_hotspot_id')
    
    hotspot = {
        "id": new_id,
        "ssid": ssid,
        "description": desc,
        "latitude": lat if lat else None,
        "longitude": lon if lon else None,
        "created_at": datetime.datetime.now().isoformat(),
        "password": None,     # Standardmäßig leer
        "encryption": "NONE", # Standardmäßig offen
        "roaming_ids": []     # Liste von Provider IDs
    }
    
    # Konfiguration abfragen
    choice = input("Möchtest du (P)asswort, (R)oaming oder (N)ichts hinzufügen? [p/r/n]: ").lower()
    
    if choice == 'p':
        pw = input("Passwort: ")
        enc = input("Verschlüsselung (WPA2/WPA3) [Default: WPA2]: ") or "WPA2"
        hotspot['password'] = pw
        hotspot['encryption'] = enc
        
    elif choice == 'r':
        print("\nVerfügbare Anbieter:")
        for p in data['providers']:
            print(f"[{p['id']}] {p['name']}")
            
        p_ids = input("Anbieter ID(s) (kommagetrennt): ")
        if p_ids:
            # IDs in Integers umwandeln und speichern
            try:
                hotspot['roaming_ids'] = [int(x.strip()) for x in p_ids.split(',')]
            except ValueError:
                print("Ungültige Eingabe, kein Roaming gesetzt.")

    data['hotspots'].append(hotspot)
    save_db(data)
    print(f"✅ Hotspot '{ssid}' angelegt.")

def manage_providers(data):
    print("\n--- Provider Verwaltung ---")
    print("1. Liste anzeigen")
    print("2. Neuen Provider anlegen")
    ch = input("Wahl: ")
    
    if ch == '1':
        for p in data['providers']:
            print(f"ID: {p['id']} | {p['name']} ({p['domain']})")
    elif ch == '2':
        name = input("Name: ")
        domain = input("Domain: ")
        url = input("Info URL: ")
        new_id = get_next_id(data, 'next_provider_id')
        data['providers'].append({
            "id": new_id,
            "name": name,
            "domain": domain,
            "info_url": url
        })
        save_db(data)
        print("Provider angelegt.")

def export_for_hugo(data):
    """
    Erstellt die flache Datei für Hugo.
    Löst 'roaming_ids' [1, 2] in echte Objekte auf: [{'name': 'OpenRoaming'...}, ...]
    """
    export_list = []
    
    # Lookup-Table für Provider für schnelleren Zugriff
    provider_map = {p['id']: p for p in data['providers']}
    
    for spot in data['hotspots']:
        # Tiefe Kopie, damit wir source nicht verändern
        export_spot = spot.copy()
        
        # Roaming IDs auflösen
        resolved_roaming = []
        for rid in spot.get('roaming_ids', []):
            if rid in provider_map:
                resolved_roaming.append(provider_map[rid])
        
        export_spot['roaming'] = resolved_roaming
        
        # Internes Feld entfernen, braucht Hugo nicht
        if 'roaming_ids' in export_spot:
            del export_spot['roaming_ids']
            
        export_list.append(export_spot)
    
    # Sortieren: Neueste zuerst (hohe ID zuerst)
    export_list.sort(key=lambda x: x['id'], reverse=True)
    
    # Verzeichnis sicherstellen
    os.makedirs(os.path.dirname(EXPORT_FILE), exist_ok=True)
    
    with open(EXPORT_FILE, 'w', encoding='utf-8') as f:
        json.dump(export_list, f, indent=2, ensure_ascii=False)
        
    print(f"🚀 Exportiert für Hugo: {EXPORT_FILE} ({len(export_list)} Einträge)")

def main_menu():
    # Beim Start laden
    db_data = load_db()
    if not db_data: return

    while True:
        print("\n--- DO3EET WiFi Manager (JSON Edition) ---")
        print("1. Neuen Hotspot eintragen")
        print("2. Provider verwalten")
        print("3. Exportieren (Updates anwenden)")
        print("q. Beenden")
        
        choice = input("Wahl: ")
        
        if choice == '1':
            add_hotspot(db_data)
        elif choice == '2':
            manage_providers(db_data)
        elif choice == '3':
            export_for_hugo(db_data)
        elif choice == 'q':
            break

if __name__ == "__main__":
    main_menu()