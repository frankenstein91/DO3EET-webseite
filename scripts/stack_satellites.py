#!/usr/bin/env python3
"""
Stacking- und Asset-Vorbereitungs-Skript für den Sonnenfinsternis- & Perseiden-Blogbeitrag.
Erstellt den kombinierten Satellitenspuren-Stack aus 58 Subframes und exportiert alle Beitragsbilder.
"""

import os
import sys
from pathlib import Path
import numpy as np
from PIL import Image

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

def generate_satellite_stack(drive_path):
    sat_dir = drive_path / "work/2026-08-13_MilkyWay_timelapse/satellitenspuren/jpeg"
    out_dir = drive_path / "work/stacked_results"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    files = sorted([f for f in sat_dir.glob("*.jpg") if not f.name.endswith("_thn.jpg")])
    print(f"Gefundene Satellitenspuren-Subframes: {len(files)}")
    assert len(files) == 58, f"Erwartet 58 Dateien, gefunden: {len(files)}"
    
    first_img = Image.open(files[0]).convert("RGB")
    stack_arr = np.array(first_img, dtype=np.uint8)
    
    for idx, f in enumerate(files[1:], start=2):
        img = Image.open(f).convert("RGB")
        arr = np.array(img, dtype=np.uint8)
        stack_arr = np.maximum(stack_arr, arr)
        if idx % 10 == 0 or idx == len(files):
            print(f"Gestackt: {idx}/{len(files)} Bilder...")
            
    res_img = Image.fromarray(stack_arr)
    out_file = out_dir / "Satellitenspuren_Stack_58Frames_2026-08-13.jpg"
    res_img.save(out_file, "JPEG", quality=95, optimize=True)
    print(f"Satellitenspuren-Stack erfolgreich gespeichert: {out_file.name}")

def create_eclipse_progression_composite(drive_path):
    exports_dir = drive_path / "work/2026-08-12_Solar-Eclipse/exports"
    out_dir = drive_path / "work/stacked_results"
    
    stages = [
        ("19:14 (Ingress)", exports_dir / "crop_stage_30min_ingress_1800s.png"),
        ("19:45 (Bedeckung)", exports_dir / "crop_stage_50min_partial_3000s.png"),
        ("20:00 (Fortgeschritten)", exports_dir / "crop_stage_60min_advanced_3600s.png"),
        ("20:10 (Maximum 87%)", exports_dir / "crop_stage_74min_peak_maximum_4458s.png")
    ]
    
    images = [Image.open(p).convert("RGB") for _, p in stages]
    h = 800
    resized = [img.resize((int(img.width * (h / img.height)), h), Image.Resampling.LANCZOS) for img in images]
    
    total_w = sum(img.width for img in resized) + (len(resized) - 1) * 8
    comp = Image.new("RGB", (total_w, h), color=(15, 17, 26))
    
    x_offset = 0
    for img in resized:
        comp.paste(img, (x_offset, 0))
        x_offset += img.width + 8
        
    out_file = out_dir / "SoFi_2026-08-12_Phasenverlauf_Composite.jpg"
    comp.save(out_file, "JPEG", quality=95, optimize=True)
    print(f"Phasenverlauf-Composite gespeichert: {out_file.name}")

if __name__ == "__main__":
    drive = find_astro_drive()
    generate_satellite_stack(drive)
    create_eclipse_progression_composite(drive)
