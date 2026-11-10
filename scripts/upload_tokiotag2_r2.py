#!/usr/bin/env python3
"""
Uploads the 8 selected images for Tokio Tag 2 to Cloudflare R2.
Follows the exact restricted-permissions rclone flags:
--no-traverse --no-check-dest --s3-no-check-bucket -v
"""

import subprocess
from pathlib import Path

REMOTE = "DO3EET-r3"
BUCKET = "do3eet-assets"
REMOTE_PREFIX = "posts/JapanNovember2026-TokioTag2"
SOURCE_DIR = Path("/home/ftornack/ramdisk")

IMAGES = [
    "PXL_20261109_210701137.jpg",
    "PXL_20261109_231910567.jpg",
    "PXL_20261110_010342291.jpg",
    "PXL_20261110_014620659.jpg",
    "PXL_20261110_022054151.jpg",
    "PXL_20261110_033857916.PANO.jpg",
    "PXL_20261110_080714863.jpg",
    "PXL_20261110_085020264.jpg",
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
