+++
title = 'Graphical Desktop with Hyprland'
date = 2024-03-30T15:07:44+01:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
]
+++

For many years, Linux has relied on the X11 server for graphical output, though Wayland has been around as a modern alternative for quite a while now.
Wayland has a cleaner architecture and offers real advantages with certain applications—unfortunately, until now there hadn't been a single Wayland desktop environment I actually liked. My longtime favorite, Cinnamon, has been working on a Wayland port for a few weeks, but sadly it's pretty much unusable right now. In Cinnamon-Wayland, for instance, you can't even change the keyboard layout yet—it's hardcoded to ENG-US. Now, however, I've discovered Hyprland and I'm going to install it on my Framework laptop. I'm writing this post as I go through the setup. Hopefully it'll help Future Frank repeat this installation later on and give other readers a useful look into the process as well.

# Installation
As usual, I'm starting from my default setup: Arch Linux with `pikaur`. In case you don't know `pikaur`, it's an AUR helper / package manager for Arch Linux.
```bash
pikaur -Sy hyprland xdg-desktop-portal-hyprland qt5-wayland qt6-wayland swaync nwg-panel nwg-menu nwg-shell-config swww
```
That should install Hyprland along with all its dependencies.

# Config
## Monitor
```
monitor=eDP-1,preferred,auto,1.333
monitor=,preferred,auto,auto
```
## Keyboard
Configuration lives in `~/.config/hypr/hyprland.conf`.
Important: change the keyboard layout to `kb_layout = de`.

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

## Applications
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
Set the kernel parameter `ibt=off` (otherwise things break) and load the `binder_linux` kernel module.

Then do a `reboot`!

This line fixes networking conflicts with Docker:
```bash
sudo sed -i~ -E 's/=.\$\(command -v (nft|ip6?tables-legacy).*/=/g' /usr/lib/waydroid/data/scripts/waydroid-net.sh
```

```bash
waydroid init
systemctl enable waydroid-container.service
waydroid session start
```
and `waydroid app install F-Droid.apk`.

# Open Issues
- Laptop lid close action
- `blueberry-tray` isn't showing up
- Screen stays black whenever the display changes resolution
- Lockscreen and standby
