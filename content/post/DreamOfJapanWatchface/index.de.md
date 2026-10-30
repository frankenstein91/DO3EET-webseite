+++
title = 'Vom Frust zum eigenen Zifferblatt: Dream of Japan Torii GMT'
date = "2026-10-30T14:58:22+01:00"
draft = false
author = "Frank Tornack"
tags = [
    "Smartwatch",
    "Wear OS",
    "Amateurfunk",
    "Japan",
    "Android",
    "Open Source",
    "Python",
    "Linux",
]
+++

Wer eine Smartwatch im Alltag trägt, weiß: Das Zifferblatt ist die wichtigste Schnittstelle am Handgelenk. Es soll auf einen flüchtigen Blick genau die Informationen liefern, die man gerade braucht – übersichtlich, zuverlässig und ästhetisch ansprechend. 

Doch genau hier fing bei mir der Frust an. Bei meinem bisherigen Watchface kam es immer wieder vor, dass Zahlen in den Komplikationen abgeschnitten wurden oder Werte schlicht nicht lesbar waren. Zudem fehlte mir ein Zifferblatt, das meine Leidenschaften und meine Identität wirklich widerspiegelt: Eine Symbiose aus **Amateurfunk** (mein Rufzeichen [DO3EET](https://do3eet.pages.dev)), meiner tiefen Verbundenheit zu **Japan** und dem visuellen Stil meines Blogs.

Also fasste ich den Entschluss: Wenn es das perfekte Watchface nirgends gibt, baue ich es mir eben selbst. Das Ergebnis ist das **Dream of Japan · Torii GMT** für die Google Pixel Watch – umgesetzt mit Googles modernem, rein deklarativem **Watch Face Format (WFF v2)**.

<!--more-->

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/DreamOfJapanWatchface/torii_gmt_wrist.jpg" alt="Das fertige Dream of Japan Torii GMT Watchface auf der Pixel Watch am Handgelenk" width="1400" height="1093" >}}

---

## Das Konzept: Wenn Funkraum-Uhr auf Miyajima trifft

Ein Standard-Zifferblatt reichte für meine Anforderungen bei weitem nicht aus. Ich wollte eine vollwertige GMT- und Funkraum-Uhr, kombiniert mit Japan-Reisefeatures und Blog-Ästhetik.

### 1. Amateurfunk & Weltzeit im Zentrum
- **Äußere 24h-Lünette mit Zulu-Krone (`Z`):** Auf der 24/00-Uhr-Position thront das `Z` für Zulu-Zeit (UTC). Ein roter 24h-Pfeilzeiger läuft genau einmal am Tag um das gesamte Zifferblatt und zeigt stets die aktuelle UTC-Zeit auf der Lünette an – unverzichtbar für Logbucheinträge und Bandöffnungen im Amateurfunk.
- **Funkstille-Sektoren:** Auf dem Minutenkranz sind die klassischen internationalen Funkstille-Sektoren (Minuten `00–03`, `15–18`, `30–33` und `45–48`) farblich dezent hervorgehoben – eine Hommage an traditionelle maritime Funkraum-Uhren.
- **Skelettierte Zeiger (noch WIP):** Die Idee war, den Schäften von Stunden- und Minutenzeiger Aussparungen zu verpassen, damit darunterliegende Komplikationen und Digitalanzeigen lesbar bleiben. In der Praxis ist das allerdings noch eine echte Baustelle (Work in Progress): Bei ungünstigen Zeigerstellungen ist das Durchlesen durch die Aussparungen aktuell noch ziemlich fummelig – hier werde ich an Rahmenbreiten, Transparenzen und Ausschnittsgeometrien definitiv noch feilen müssen. Funktional ist der Zeigersatz aber schon voll einsatzbereit: Der Stundenzeiger lässt sich in den Einstellungen wahlweise als **24h-Funkraum-Uhr** (1 Umdrehung = 24 Stunden, Direktablesung des Zeitzonen-Offsets zum UTC-Zeiger) oder als **klassische 12h-GMT** betreiben.

### 2. Japan-Reisebegleiter & Terminal-Ästhetik
- **Dual-Digital-Konsole:** Unterhalb der 12-Uhr-Position befindet sich eine zweigeteilte Digitalanzeige. Links läuft die UTC/Zulu-Zeit, rechts die Zeit für Tokio (`Asia/Tokyo`, JST). Ein dynamischer Tag/Nacht-Indikator (`☀` / `☾`) für Tokio steht als Erweiterung zwar schon im XML-Code, wird im aktuellen Rendering aber noch nicht angezeigt und braucht noch Zuwendung.
- **Datum mit Kanji-Wochentag:** Die Datumszeile zeigt neben Tag und Monat auch das traditionelle japanische Wochentags-Kanji (`日, 月, 火, 水, 木, 金, 土`).
- **Miyajima O-Torii & Seigaiha-Wellen:** Im unteren Bereich steht die Silhouette des berühmten schwimmenden Torii von Itsukushima (Miyajima) mit Kasagi-Querbalken, Ryōbu-Stützen und feiner Wasserspiegelung. Dahinter breitet sich das klassische Seigaiha-Wellenmuster aus konzentrischen Bögen aus – für mich zugleich ein Symbol für die Ausbreitung elektromagnetischer Funkwellen.
- **Typografie & Scanlines:** Sämtliche Ziffern und Beschriftungen nutzen die Schriftart `OpenDyslexicMono`, direkt entlehnt aus der Gestaltung dieses Blogs, kombiniert mit feinen horizontalen CRT-Scanlines.
- **6 flexible Komplikationen:** Akku, Sonnenlauf, Schritte, Weltzeit, Termine und Wochentag fügen sich nahtlos in ovale und abgerundete Instrumenten-Rahmen ein – ohne dass jemals wieder eine Ziffer abgeschnitten wird!

---

## Unter der Haube: Die 4 technischen Hürden & Aha-Momente

Google hat mit Wear OS 5 das neue **Watch Face Format (WFF)** zur Pflicht für sparsame Zifferblätter gemacht. WFF ist rein deklaratives XML (`hasCode="false"` im Android-Manifest) – es läuft kein eigener Java- oder Kotlin-Service im Hintergrund, was enorm Akku spart. 

Doch wer glaubt, reines XML sei trivial, erlebt bei der Wear OS Runtime schnell sein blaues Wunder. Hier sind die vier spannendsten Hürden, die ich bei der Entwicklung gemeistert habe:

### 1. Die Eigenheiten der DWF-Runtime (Wear OS 5 & 6)
Die Wear OS Runtime (`DeclarativeWatchFaceRuntime`) parst das XML gnadenlos strikt. Fehler führen nicht etwa zu einer hilfreichen Warnung, sondern oft zum stillen Absturz oder Ignorieren von Elementen:

- **`<ComplicationSlot>` zwingend direkt unter `<Scene>`:** Man könnte versucht sein, Komplikationen logisch in `<Group>`-Container zu packen, um sie gemeinsam zu verschieben oder zu skalieren. Die Runtime verlangt jedoch zwingend, dass alle `<ComplicationSlot>`-Tags **direkte Kinder von `<Scene>`** sind!
- **Zickige Bounding-Boxen:** Für berührungsempfindliche Bereiche kennt Wear OS zwar abgerundete Rechtecke, akzeptiert im WFF-Schema jedoch nur `<BoundingRoundBox cornerRadius="14">` – wer aus Gewohnheit `<BoundingRoundRect>` schreibt, wundert sich, warum der Parser den Slot verwirft.
- **Zeitzonen in der DigitalClock:** Eine zweite Digitaluhr für Tokio lässt sich nicht einfach über formatierte Strings lösen. Die Lösung ist das `<Localization>`-Tag direkt innerhalb von `<DigitalClock>`:

```xml
<DigitalClock x="228" y="99" width="82" height="42">
    <Localization timeZone="Asia/Tokyo" />
    <TimeText format="hh:mm" hourFormat="24" align="CENTER">
        <Font family="opendyslexic_mono" size="13" color="#C0CAF5" weight="BOLD" />
    </TimeText>
</DigitalClock>
```
*Wichtig:* `<TimeText>` akzeptiert Zeitformate ausschließlich in Kleinbuchstaben (`format="hh:mm"`).

### 2. Leichtgewichtige Toolchain statt Gradle-Monster
Um ein WFF-Watchface zu bauen, benötigt man kein gigantisches Android Studio mit Gigabytes an Gradle-Plugins, Build-Dämonen und Kotlin-Compilern. Da WFF kein ausführbares Java/Kotlin enthält, lässt sich das gesamte APK in knapp zwei Sekunden direkt mit den Android SDK Build-Tools kompilieren!

Mein Build-Skript `build_apk.sh` führt die Schritte blitzschnell aus:

```bash
#!/usr/bin/env bash
set -euo pipefail

SDK_DIR="${ANDROID_HOME:-$HOME/Android/Sdk}"
BUILD_TOOLS="$SDK_DIR/build-tools/36.1.0"
PLATFORM_JAR="$SDK_DIR/platforms/android-36/android.jar"

# 1. Grafiken und Preview rendern
python3 ./scripts/generate_assets.py

# 2. Android-Ressourcen mit aapt2 kompilieren
"$BUILD_TOOLS/aapt2" compile --dir ./app/src/main/res -o ./build/compiled_res/

# 3. APK linken (de.dreamofjapan.watchface)
"$BUILD_TOOLS/aapt2" link \
    -I "$PLATFORM_JAR" \
    --manifest ./app/src/main/AndroidManifest.xml \
    --min-sdk-version 33 \
    --target-sdk-version 36 \
    --auto-add-overlay \
    -o ./build/unaligned.apk \
    ./build/compiled_res/*.flat

# 4. Zipalign & Signieren
"$BUILD_TOOLS/zipalign" -f -p 4 ./build/unaligned.apk ./build/aligned.apk
"$BUILD_TOOLS/apksigner" sign --ks ./build/debug.keystore --out ./dist/dreamofjapan-torii-gmt.apk ./build/aligned.apk
```

Keine 2 Sekunden später liegt ein installierbares, signiertes APK im `dist/`-Verzeichnis.

### 3. Asset-Engineering: 4x-Supersampling mit Python & PIL
Auf dem 450×450 Pixel Display der Pixel Watch Gen 4 fallen unsaubere Kanten oder Treppeneffekte bei feinen Skalenstrichen und konzentrischen Bögen sofort ins Auge. 

Statt Grafiken mit Inkscape oder Photoshop von Hand zu zeichnen, generiert ein Python-Skript (`generate_assets.py`) alle Ebenen – von der 24h-Lünette über die Funkstille-Sektoren bis zum Torii und den Zeigern – mathematisch präzise mit trigonometrischen Polar-Berechnungen:

```python
# 4x Supersampling: 1800x1800 px interne Zeichenebene -> Lanczos Downsampling auf 450x450 px
SIZE = 450
SCALE = 4
SS = SIZE * SCALE

def polar(angle_deg: float, radius: float, cx: float = 225.0, cy: float = 225.0):
    rad = math.radians(angle_deg - 90.0)
    x = cx + radius * math.cos(rad)
    y = cy + radius * math.sin(rad)
    return int(round(x * SCALE)), int(round(y * SCALE))

def downsample(img: Image.Image) -> Image.Image:
    return img.resize((SIZE, SIZE), Image.Resampling.LANCZOS)
```

Durch das Zeichnen bei 1800×1800 Pixeln und das anschließende Herunterskalieren mittels **Lanczos-Filterung** entstehen makellos weiche Kanten und ein gestochen scharfes Schriftbild.

### 4. Drahtloses Deployment via ADB & Smartphone-Hotspot
Das Übertragen auf die Uhr über USB ist bei der Pixel Watch ohne speziellen Lade-Puck mit Datenpins gar nicht möglich. Wear OS bietet glücklicherweise *Debugging über WLAN*.

Da die Uhr im Heimnetzwerk gerne mal die IP wechselt oder mDNS-Anfragen verschluckt werden, nutze ich unterwegs oder am Schreibtisch einen genial einfachen Trick:

1. Auf dem **Pixel 9 Pro XL** kurz den mobilen WLAN-Hotspot aktivieren (sowohl Laptop als auch Pixel Watch 4 verbinden sich automatisch).
2. Auf der Pixel Watch 4 unter *Entwickleroptionen → Debugging über WLAN* aktivieren.
3. Da die TLS-Schlüsselpaarung einmalig registriert wurde (`_adb-tls-connect._tcp`), verbindet sich ADB ohne erneute Code-Eingabe:

```bash
# Automatischer Verbindungsaufbau und APK-Installation
adb connect "$WATCH_IP:$WATCH_PORT"
adb install -r ./dist/dreamofjapan-torii-gmt.apk
```

In weniger als 10 Sekunden ist eine neue Zifferblatt-Version direkt auf der Uhr aktiv.

---

## Das Ergebnis am Handgelenk

Das Zifferblatt ist buchstäblich heute erst entstanden und begleitet mich nun seit ein paar Stunden am Handgelenk – quasi noch warm aus dem Compiler. Über das Zahnrad-Menü auf der Uhr lassen sich vier Farbschemata (vom dunklen *Tokyo Night Terminal* über *Miyajima Vermilion* bis zu *Neo-Tokyo Cyber*), verschiedene Datumsformate und der Zeigermodus jederzeit umschalten.

Natürlich ist so ein DIY-Projekt nie zu 100 % abgeschlossen. Wie erwähnt sind die skelettierten Zeiger noch ein klares Work in Progress – wenn der Minutenzeiger direkt über einer Digitalziffer steht, braucht es aktuell noch etwas Fantasie beim Ablesen. Doch das Fundament steht felsenfest, und die nächsten Optimierungen sind nur ein schnelles Python-Scripting und ein kurzes ADB-Kommando entfernt.

Was mich aber am meisten begeistert: Es funktioniert im Alltag genau so, wie ich es mir vorgestellt habe. Keine abgeschnittenen Zahlen mehr in den Komplikationsrahmen, die UTC-Zeit ist beim Funken immer präsent, der Blick nach Tokio zaubert mir ein Lächeln ins Gesicht – und das gute Gefühl, etwas völlig Eigenes geschaffen zu haben, begleitet mich mit jedem Blick auf die Uhr.
