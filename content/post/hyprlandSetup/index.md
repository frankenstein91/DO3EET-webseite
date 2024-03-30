+++
title = 'grafische Oberfläsche mit Hyprland'
date = 2024-03-30T15:07:44+01:00
draft = false
tags = [
    "Linux",
    "Wayland",
]
+++

Seit vielen Jahren nutzt Linux den X11-Server für die grafische Ausgabe, seit einiger Zeit gibt es aber Wayland als Alternative.
Wayland ist moderner geschrieben und bietet mit einigen Applikationen vorteile, nur leider gab es bis jetzt keine Desktop Environments die mir auf Wayland gefallen haben. Mein Favorit Cinnamon baut seit einigen Wochen an einer Wayland-Version, doch leider ist diese ziemlich unnutzbar. Bei Cinnamon-Wayland kann man zum Beispiel das Keyboardlayout noch nicht anpassen und es ist auf ENG-US festeingestellt. Nun habe ich aber Hyprland gefunden und will es auf meinem Framework-Notebook installieren. Diesen Artikel schreibe ich in Parallelität zur Installation. Ich hoffe er wird Zukunftsfrank helfen diese Installation erneut durchzuführen und auch anderen Lesern einen Einblick geben

# Installation
Wie immer gehe ich von meinem default System aus. Dabei nutze ich ArchLinux und pikaur. Wer pikaur nicht kennt, es ist ein Paketmanager für das ArchLinux AUR.
```bash
pikaur -Sy hyprland xdg-desktop-portal-hyprland qt5-wayland qt6-wayland swaync nwg-panel nwg-menu nwg-shell-config swww
```
Damit sollte Hyprland und alle Abhänigkeiten installiert werden.

# Konfig
## Monitor
```
monitor=eDP-1,preferred,auto,1.333
monitor=,preferred,auto,auto
```
## Keyboard
Die Konfig läuft in der Datei `~/.config/hypr/hyprland.conf`.
Wichtig das Keyboardlayout zu `kb_layout = de` ändern.

### Keybinds
```
bind = $mainMod, T, exec, $terminal
bind = $mainMod ALT, 1, focusworkspaceoncurrentmonitor, 1
bind = $mainMod ALT, 2, focusworkspaceoncurrentmonitor, 2
bind = $mainMod ALT, 3, focusworkspaceoncurrentmonitor, 3
bind = $mainMod ALT, 4, focusworkspaceoncurrentmonitor, 4
bind = $mainMod ALT, 5, focusworkspaceoncurrentmonitor, 5
bind = $mainMod ALT, 6, focusworkspaceoncurrentmonitor, 6
bind = $mainMod ALT, 7, focusworkspaceoncurrentmonitor, 7
bind = $mainMod ALT, 8, focusworkspaceoncurrentmonitor, 8
bind = $mainMod ALT, 9, focusworkspaceoncurrentmonitor, 9
bind = $mainMod ALT, 0, focusworkspaceoncurrentmonitor, 10
```

## Anwendungen
```
$terminal = tilix
$fileManager = nemo
```

```
exec-once=/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1
exec-once=swaync
exec-once=swww-daemon -f xrgb
exec-once=nm-applet
exec-once=blueberry-tray
```

# offene Punkte
- Notebookdeckel Aktion
- blueberry-tray wird nicht angezeigt
- Wenn das Display die Auflösung ändert, bleibt es schwarz
- Lockscreen and Standby