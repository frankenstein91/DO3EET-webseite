+++
title = 'Offlinetags: Die 6 Privacy-Signale im Überblick'
date = 2026-03-23T20:27:00+01:00
draft = false
author = "Frank Tornack"
tags = [
    "Privacy",
    "Fotografie",
    "Offlinetags",
    "OpenSource",
]
+++

```bash
[frank@do3eet-terminal ~]$ cat /etc/privacy/offlinetags.conf
# Consent Communication Protocol v2.0
# STATUS: ALL 6 TAGS ACTIVE
```

Wer viel auf Barcamps, Hackathons oder Amateurfunk-Treffen unterwegs ist, kennt das Problem: Darf ich dieses Foto jetzt posten? Wer ist da im Hintergrund zu sehen? Und wie signalisiere ich selbst, was mit Bildern von mir passieren soll?

Genau hier setzen die **Offlinetags** an. Sie sind ein soziales Signal an Menschen – und gleichzeitig maschinenlesbare Marker für Algorithmen. Da ich heute einen **Pull-Request** eingereicht habe, um das Set auf **6 Symbole** zu erweitern, gibt es hier den Guide für alle Fotografen und Tag-Träger (inklusive der neuen Vorschläge).

---

<style>
  .ot-row {
    display: flex;
    align-items: flex-start;
    gap: 2rem;
    margin-bottom: 3rem;
  }
  .ot-tag {
    flex: 0 0 150px;
    text-align: center;
  }
  .ot-tag img {
    width: 150px;
    height: auto;
    border: 2px solid var(--terminal-border);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.2);
  }
  .ot-content {
    flex: 1;
  }
  .ot-content h3 {
    margin-top: 0 !important;
  }
  @media (max-width: 40rem) {
    .ot-row {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .ot-tag {
      flex: 0 0 auto;
    }
  }
</style>

<div class="ot-row">
  <div class="ot-tag">
    <img src="TagMe.svg" alt="Tag Me">
  </div>
  <div class="ot-content">
    <h3>1. Tag Me (Grün)</h3>
    <p><i>Das „Rundum-Sorglos-Paket“ für die digitale Verwertung.</i></p>
    <ul>
      <li><strong>Darf:</strong> Fotografieren, veröffentlichen, taggen und Gesichtserkennungsverfahren anwenden.</li>
      <li><strong>Sollte erfragen:</strong> Bei sehr sensiblen Kontexten kurz checken, ob eine spezifische Plattform (z.B. Facebook vs. Mastodon) okay ist.</li>
      <li><strong>Sein lassen:</strong> Eigentlich nichts – hier ist der Wunsch nach digitaler Sichtbarkeit klar formuliert.</li>
    </ul>
  </div>
</div>

<div class="ot-row">
  <div class="ot-tag">
    <img src="UploadMe.svg" alt="Upload Me">
  </div>
  <div class="ot-content">
    <h3>2. Upload Me (Gelb)</h3>
    <p><i>Veröffentlichung ja, Tracking nein.</i></p>
    <ul>
      <li><strong>Darf:</strong> Das Foto machen und es öffentlich ins Netz stellen.</li>
      <li><strong>Sollte erfragen:</strong> Falls man die Person doch namentlich erwähnen will (Credits), sollte man kurz nachhaken.</li>
      <li><strong>Sein lassen:</strong> Manuelles Tagging in sozialen Netzwerken oder das Anreichern mit Metadaten für die Gesichtserkennung.</li>
    </ul>
  </div>
</div>

<div class="ot-row">
  <div class="ot-tag">
    <img src="BlurMe.svg" alt="Blur Me">
  </div>
  <div class="ot-content">
    <h3>3. Blur Me (Blau)</h3>
    <p><i>Präsenz ja, Identität nein.</i></p>
    <ul>
      <li><strong>Darf:</strong> Die Person fotografieren, <strong>sofern</strong> sie vor der Veröffentlichung unkenntlich gemacht wird.</li>
      <li><strong>Sollte erfragen:</strong> Ob eine einfache Verpixelung reicht oder ob das Gesicht komplett „überklebt“ werden soll.</li>
      <li><strong>Sein lassen:</strong> Die Veröffentlichung des Originalbildes ohne Bearbeitung. Gesichtserkennungs-Algorithmen dürfen hier keinesfalls drüberlaufen.</li>
    </ul>
  </div>
</div>

<div class="ot-row">
  <div class="ot-tag">
    <img src="NoPhotos.svg" alt="No Photos">
  </div>
  <div class="ot-content">
    <h3>4. No Photos (Rot)</h3>
    <p><i>Die klare Grenze.</i></p>
    <ul>
      <li><strong>Darf:</strong> Die Kamera in eine andere Richtung schwenken.</li>
      <li><strong>Sollte erfragen:</strong> Nichts. Der Wunsch nach Privatsphäre ist absolut.</li>
      <li><strong>Sein lassen:</strong> Jede Aufnahme der Person. Auch keine „Rückenansichten“ oder „man sieht ja nur ein bisschen was“ – Respekt vor dem Wunsch steht an erster Stelle.</li>
    </ul>
  </div>
</div>

<hr>
<p><i>Neu (Vorschlag via Pull Request):</i></p>
<hr>

<div class="ot-row">
  <div class="ot-tag">
    <img src="NameMe.svg" alt="Name Me">
  </div>
  <div class="ot-content">
    <h3>5. Name Me (Violett)</h3>
    <p><i>Sichtbarkeit gegen Credits.</i></p>
    <ul>
      <li><strong>Darf:</strong> Fotografieren und veröffentlichen.</li>
      <li><strong>Sollte erfragen:</strong> Wie genau die Namensnennung erfolgen soll (Klarname, Rufzeichen oder Spitzname?).</li>
      <li><strong>Sein lassen:</strong> Die Veröffentlichung ohne eindeutige Urheber- oder Abgebildeten-Nennung. Hier ist der „Deal“: Bild gegen Ruhm!</li>
    </ul>
  </div>
</div>

<div class="ot-row">
  <div class="ot-tag">
    <img src="BlurScreen.svg" alt="Blur Screen">
  </div>
  <div class="ot-content">
    <h3>6. Blur Screen (Türkis)</h3>
    <p><i>Der neue Standard für Tech-Events.</i></p>
    <ul>
      <li><strong>Darf:</strong> Den Vordergrund (Personen, Hardware) fotografieren.</li>
      <li><strong>Sollte erfragen:</strong> Wenn man unsicher ist, ob ein Bildschirm im Hintergrund kritische Daten (Code, Passwörter, E-Mails) zeigt.</li>
      <li><strong>Sein lassen:</strong> Unzensierte Bildschirminhalte im Hintergrund mitveröffentlichen. Bevor das Bild online geht, muss jeder Monitor im Bildbereich unkenntlich gemacht werden.</li>
    </ul>
  </div>
</div>

---

Besonders hervorzuheben ist, dass das gesamte Projekt konsequent unter [CC0 1.0 (Public Domain)](https://creativecommons.org/publicdomain/zero/1.0/deed.de) veröffentlicht wurde. Ich finde es hervorragend, dass diese Symbole und die zugrunde liegende Idee damit wirklich jedem bedingungslos zur Verfügung stehen – ohne rechtliche Hürden, ganz im Sinne des Gemeinwohls.

```bash
[frank@do3eet-terminal ~]$ systemctl status privacy-awareness
● privacy-awareness.service - Respect for Human Signals
   Active: active (running) since Mon 2026-03-23 13:37:00 CET
```

Die Offlinetags sind ein mächtiges Werkzeug, um die Diskussion über digitale Privatsphäre aus der Theorie in die Praxis zu holen. Welchen Tag tragt ihr beim nächsten Event?

Haut in die Tasten (oder funkt mich an)!

Ich selbst werde die Tags **Name Me** und **Blur Screen** übrigens definitiv tragen, sobald ich eine gute Möglichkeit gefunden habe, diese als hochwertige Anstecker/Buttons herstellen zu lassen.

---

### 📝 Aufruf: Teilnahme an wissenschaftlicher Umfrage

Passend zum Thema gibt es aktuell eine spannende Online-Umfrage im Rahmen einer Zusammenarbeit der **Universität Salzburg** und der **TU Chemnitz**. Es geht dabei um die Kommunikation von Fotopräferenzen auf öffentlichen Veranstaltungen.

*   **Ziel:** Einstellungen zum Fotografieren/Fotografiert-werden und zur Kommunikation persönlicher Präferenzen verstehen.
*   **Zeitaufwand:** ca. 5 Minuten.
*   **Anonymität:** Die Umfrage ist komplett anonym.
*   **Frist:** Teilnahmen sind bis zum **28.03.2026** möglich.

Wenn ihr das Forschungsprojekt unterstützen wollt, findet ihr hier den Link:
👉 **[Zur Umfrage (Limesurvey)](https://bildungsportal.sachsen.de/umfragen/limesurvey/index.php/232125?lang=de)**

Vielen Dank für eure Unterstützung!

```bash
[frank@do3eet-terminal ~]$ logout
```
