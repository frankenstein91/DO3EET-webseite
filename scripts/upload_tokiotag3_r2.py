#!/usr/bin/env python3
"""
Uploads the 13 selected images for Tokio Tag 3 to Cloudflare R2.
Follows the exact restricted-permissions rclone flags:
--no-traverse --no-check-dest --s3-no-check-bucket -v
"""

import subprocess
from pathlib import Path

REMOTE = "DO3EET-r3"
BUCKET = "do3eet-assets"
REMOTE_PREFIX = "posts/JapanNovember2026-TokioTag3"
SOURCE_DIR = Path("/home/ftornack/ramdisk")

IMAGES = [
    "PXL_20261110_223526633.jpg",
    "PXL_20261110_230540069.jpg",
    "PXL_20261111_001931277.jpg",
    "PXL_20261111_011835833.jpg",
    "PXL_20261111_015735708.jpg",
    "PXL_20261111_040145757.jpg",
    "PXL_20261111_042219816.jpg",
    "PXL_20261111_043053372~2.jpg",
    "PXL_20261111_043556724.jpg",
    "PXL_20261111_050521842.jpg",
    "PXL_20261111_063921055.jpg",
    "PXL_20261111_071620189.jpg",
    "PXL_20261111_080002794.jpg",
    "PXL_20261111_093414837.jpg",
]

def main():
    print(f"Uploading {len(IMAGES)} images to {REMOTE}:{BUCKET}/{REMOTE_PREFIX}/...")
    for filename in IMAGES:
        src = SOURCE_DIR / filename
        if not src.exists():
            raise FileNotFoundError(f"Source file not found: {src}")
        dest = f"{REMOTE}:{BUCKET}/{REMOTE_PREFIX}/{filename}"
        cmd = [
            "rclone", "copyto",
            str(src), dest,
            "--no-traverse",
            "--no-check-dest",
            "--s3-no-check-bucket",
            "-v"
        ]
        print(f"\n[UPLOAD] {filename} -> {dest}")
        res = subprocess.run(cmd, text=True)
        if res.returncode != 0:
            raise RuntimeError(f"Upload failed for {filename} with code {res.returncode}")
        print(f"✓ Uploaded {filename}")

if __name__ == "__main__":
    main()
