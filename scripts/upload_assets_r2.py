#!/usr/bin/env python3
"""
Lädt die Bilder für den Sonnenfinsternis- & Perseiden-Blogbeitrag
gemäß den Cloudflare R2 Vorgaben sicher nach do3eet-assets hoch.
"""

import os
import subprocess
from pathlib import Path

REMOTE = "DO3EET-r3"
BUCKET = "do3eet-assets"
REMOTE_PREFIX = "posts/Sonnenfinsternis2026"

def find_astro_drive():
    env_path = os.environ.get("ASTRO_DRIVE")
    if env_path and Path(env_path).exists():
        return Path(env_path)
    
    # Auto-Discovery in /run/media/*/Sterne/ or /media/*/Sterne/
    for base in [Path("/run/media"), Path("/media")]:
        if base.exists():
            for p in base.glob("*/Sterne"):
                if p.exists() and p.is_dir():
                    return p
    raise FileNotFoundError("Astro-Festplatte 'Sterne' wurde nicht gefunden. Bitte ASTRO_DRIVE setzen.")

def get_assets_list(drive_path):
    return [
        # SoFi Aufnahmen
        (drive_path / "work/stacked_results/SoFi_2026-08-12_20-10-06_Maximum_Crop2K.jpg", "SoFi_2026-08-12_20-10-06_Maximum_Crop2K.jpg"),
        (drive_path / "work/stacked_results/SoFi_2026-08-12_Phasenverlauf_Composite.jpg", "SoFi_2026-08-12_Phasenverlauf_Composite.jpg"),
        
        # Satellitenspuren Stack
        (drive_path / "work/stacked_results/Satellitenspuren_Stack_58Frames_2026-08-13.jpg", "Satellitenspuren_Stack_58Frames_2026-08-13.jpg"),
        
        # Perseiden Galerie (Feuerkugeln & Meteore)
        (drive_path / "work/2026-08-13_MilkyWay_timelapse/sternschnuppen/jpeg/20260813-002640.jpg", "Perseiden_2026-08-13_Feuerkugel_002640.jpg"),
        (drive_path / "work/2026-08-13_MilkyWay_timelapse/sternschnuppen/jpeg/20260813-005954.jpg", "Perseiden_2026-08-13_Feuerkugel_005954.jpg"),
        (drive_path / "work/2026-08-13_MilkyWay_timelapse/sternschnuppen/jpeg/20260813-002857.jpg", "Perseiden_2026-08-13_Meteor_002857.jpg"),
        (drive_path / "work/2026-08-13_MilkyWay_timelapse/sternschnuppen/jpeg/20260813-004835.jpg", "Perseiden_2026-08-13_Meteor_004835.jpg"),
        (drive_path / "work/2026-08-13_MilkyWay_timelapse/sternschnuppen/jpeg/20260813-004959.jpg", "Perseiden_2026-08-13_Meteor_004959.jpg"),
        (drive_path / "work/2026-08-13_MilkyWay_timelapse/sternschnuppen/jpeg/20260813-005507.jpg", "Perseiden_2026-08-13_Meteor_005507.jpg"),
    ]

def upload_all():
    drive = find_astro_drive()
    assets = get_assets_list(drive)
    print(f"Starte Upload von {len(assets)} Dateien nach Cloudflare R2 ({REMOTE}:{BUCKET}/{REMOTE_PREFIX}/)...")
    for src, target_name in assets:
        if not src.exists():
            raise FileNotFoundError(f"Quelldatei existiert nicht: {src}")
            
        dest = f"{REMOTE}:{BUCKET}/{REMOTE_PREFIX}/{target_name}"
        cmd = [
            "rclone", "copyto",
            str(src), dest,
            "--no-traverse",
            "--no-check-dest",
            "--s3-no-check-bucket",
            "-v"
        ]
        print(f"\n[UPLOAD] {src.name} -> {target_name}")
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            print(f"Fehler bei {target_name}:\n{res.stderr}")
            raise RuntimeError(f"Rclone-Upload fehlgeschlagen für {target_name}")
        else:
            print(f"✓ Erfolgreich hochgeladen: {target_name}")

if __name__ == "__main__":
    upload_all()
