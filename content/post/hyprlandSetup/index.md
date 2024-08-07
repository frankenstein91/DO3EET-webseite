+++
title = 'grafische Oberfläsche mit Hyprland'
date = 2024-03-30T15:07:44+01:00
draft = false
author = "Frank Tornack"
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
#exec-once=waypaper --restore
exec-once=swww-daemon -f xrgb
exec-once=swaync
exec-once=nwg-panel
exec-once=nm-applet
exec-once=blueberry-tray
```

# Waydroid
```bash
pikaur -S binder_linux-dkms waydroid
```
den Kernelparameter `ibt=off` setzen, sonst gibt es Probleme und das Kernelmodule `binder_linux` laden.

Danach ein `reboot`!

Diese Zeile löst Netzwerkprobleme mit Docker
```bash
sudo sed -i~ -E 's/=.\$\(command -v (nft|ip6?tables-legacy).*/=/g' /usr/lib/waydroid/data/scripts/waydroid-net.sh
```

```bash
waydroid init
systemctl enable waydroid-container.service
waydroid session start
```
and `waydroid app install F-Droid.apk`.

# offene Punkte
- Notebookdeckel Aktion
- blueberry-tray wird nicht angezeigt
- Wenn das Display die Auflösung ändert, bleibt es schwarz
- Lockscreen and Standby