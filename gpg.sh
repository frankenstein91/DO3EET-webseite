#!/bin/bash
KEYID="83C577D642DFD542"

# 1. GPG-Infos abrufen (Foto-Zeile herausfiltern)
RAW_INFO=$(gpg --list-keys --fingerprint $KEYID | grep -v "jpeg image")

# 2. Notations extrahieren (enthält jetzt auch die Policy-Notation)
NOTATIONS=$(gpg --export $KEYID | gpg --list-packets --verbose 2>/dev/null | grep "notation:" | sed 's/.*notation: //g' | sed 's/)//g' | sort -u)

# 3. Gesamt-Text für Slip und QR-Code bauen (Rein aus dem Key generiert)
FULL_TEXT=$(printf "%s\n\nNotations:\n%s" "$RAW_INFO" "$NOTATIONS")

# 4. QR-Code generieren (Base64)
QR_B64=$(printf "%s" "$FULL_TEXT" | qrencode -t PNG -o - | base64 -w 0)

# 5. HTML-sicher machen (< und > escapen)
KEY_INFO=$(printf "%s" "$FULL_TEXT" | sed 's/</\&lt;/g' | sed 's/>/\&gt;/g')

# 6. HTML-Datei mit exaktem Terminal-Layout bauen
cat <<EOF > DO3EET_keyslips.html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Keyslips DO3EET</title>
<style>
  /* Auf A4-Breite optimiert */
  body { font-family: monospace; max-width: 21cm; margin: 0 auto; padding: 15px; color: #000; }
  .slip { 
    border: 1px dashed #666; 
    padding: 15px 20px; 
    margin-bottom: 25px; 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    page-break-inside: avoid; 
  }
  /* white-space: pre verbietet dem Browser eigene Umbrüche */
  .info { white-space: pre; font-size: 11.5px; line-height: 1.4; }
  .qr img { width: 140px; height: 140px; image-rendering: pixelated; margin-left: 20px; }
</style>
</head>
<body>
$(for i in {1..5}; do 
  echo "<div class='slip'><div class='info'>$KEY_INFO</div><div class='qr'><img src='data:image/png;base64,$QR_B64' alt='QR Code'></div></div>"
done)
</body>
</html>
EOF

# 7. Datei im Browser öffnen
if command -v xdg-open > /dev/null; then
    xdg-open DO3EET_keyslips.html
fi
