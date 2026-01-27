# Anleitung: Bilder auf Cloudflare R2 auslagern

Diese Anleitung beschreibt, wie du einen Cloudflare R2 Bucket erstellst, ihn für maximales Caching (kostenlos) konfigurierst und deine Bilder migrierst.

## 1. Cloudflare R2 Bucket erstellen

1.  Logge dich in dein [Cloudflare Dashboard](https://dash.cloudflare.com/) ein.
2.  Gehe im linken Menü auf **R2**.
3.  Klicke auf **Create bucket**.
4.  Gib dem Bucket einen Namen (z.B. `do3eet-assets` oder `blog-images`).
    *   *Hinweis: Der Name muss weltweit einzigartig sein.*
5.  Lasse die Location auf `Automatic` (oder wähle `EEUR` für Osteuropa/Deutschland, falls verfügbar und gewünscht).
6.  Klicke auf **Create Bucket**.

## 2. Public Access & Custom Domain einrichten (WICHTIG für CDN!)

Damit die Bilder über das schnelle Cloudflare CDN ausgeliefert werden (und du Traffic bei R2 sparst), müssen wir eine Domain verknüpfen.

1.  Gehe in deinen neuen Bucket.
2.  Klicke auf den Tab **Settings**.
3.  Scrolle runter zu **Public Access**.
4.  Bei **Custom Domains** klicke auf **Connect Domain**.
5.  Gib eine Subdomain ein, die du nutzen möchtest (z.B. `media.do3eet.pages.dev` oder `img.deine-domain.de`).
    *   *Tipp: Da deine Seite auf `do3eet.pages.dev` läuft, ist es am einfachsten, wenn du eine Domain nutzt, die du bereits in Cloudflare verwaltest (z.B. `dreamofjapan.de` -> `media.dreamofjapan.de`). Falls du nur die `pages.dev` Domain hast, musst du "R2.dev subdomain" aktivieren, aber das ist langsamer und hat Nachteile. Besser ist eine eigene Domain.*
6.  Folge den Anweisungen zur DNS-Bestätigung.
7.  **Wichtig:** Stelle sicher, dass der Proxy-Status (die orange Wolke) im DNS-Tab später aktiv ist. Das aktiviert das Caching.

## 3. Caching Regeln optimieren (Optional aber empfohlen)

Damit Bilder nicht jedes Mal vom Bucket geladen werden (was Requests kostet), sagen wir dem Browser und Cloudflare: "Behalt das Bild lange im Speicher".

1.  Gehe in deinem Cloudflare Dashboard auf deine Domain.
2.  Navigiere zu **Caching** -> **Cache Rules**.
3.  Erstelle eine neue Regel (**Create rule**).
4.  **Name:** `Cache R2 Images`
5.  **Expression:**
    *   Field: `Hostname`
    *   Operator: `equals`
    *   Value: `media.deine-domain.de` (Deine gewählte Domain aus Schritt 2)
6.  **Cache eligibility:** `Eligible for cache`
7.  **Edge TTL:** `Ignore origin and use this TTL` -> Wähle z.B. `1 Month` oder `1 Year`.
8.  **Browser TTL:** `Override origin` -> Wähle z.B. `1 Month`.
9.  Klicke auf **Deploy**.

## 4. Bilder hochladen

Du hast mehrere Möglichkeiten:
*   **Web Interface:** Im Bucket auf "Upload" klicken (einfach für einzelne Dateien).
*   **Drag & Drop:** Dateien einfach reinziehen.
*   **Tools:** Nutze Tools wie [rclone](https://rclone.org/) oder S3-kompatible Clients (Cyberduck, Transmit), um ganze Ordner hochzuladen. R2 ist S3-kompatibel!

## 5. Blog-Posts anpassen

Sobald ein Bild hochgeladen ist, ändere den Link in deinem Markdown-File.

**Alt (Lokal):**
```markdown
{{< imgwebp src="mein-bild.jpg" alt="Beschreibung" ... >}}
```

**Neu (R2):**
```markdown
{{< imgwebp src="https://media.deine-domain.de/mein-bild.jpg" alt="Beschreibung" ... >}}
```

## 6. Aufräumen (Später)

Wenn alle Bilder eines Posts migriert sind und alles funktioniert:
1.  Lösche die lokale Bilddatei aus dem `content/post/...` Ordner.
2.  `git add .` und `git commit`.

*Hinweis: Um das Git-Repo wirklich zu verkleinern, muss später die Git-Historie bereinigt werden. Das ist ein separater Schritt, den wir machen, wenn alles umgezogen ist.*
