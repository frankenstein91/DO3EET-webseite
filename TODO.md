# ToDo

## Videos auf PeerTube migrieren

- [ ] **Kōriyama Abendverkehr-Video auf PeerTube hochladen**
  - **Beitrag:** `content/post/JapanNovember2026-KoriyamaAizu/index.de.md`
  - **Aktuell gehostet auf Cloudflare R2:** `DO3EET-r3:do3eet-assets/posts/JapanNovember2026-KoriyamaAizu/PXL_20261124_084804283.mp4` (1080p AV1, 4,0 MiB, ohne Ton/Metadaten)
  - **Aufgaben:**
    1. Video auf PeerTube (`tube.tchncs.de`) hochladen.
    2. Den `<video>`-Block in `content/post/JapanNovember2026-KoriyamaAizu/index.de.md` durch das PeerTube-`<iframe>` ersetzen (mit `p2p=0`, wie in den anderen Beiträgen).
    3. Danach die Videodatei auf R2 löschen, um Free-Tier-Speicher und Requests zu sparen:
       ```bash
       rclone deletefile DO3EET-r3:do3eet-assets/posts/JapanNovember2026-KoriyamaAizu/PXL_20261124_084804283.mp4 --s3-no-check-bucket
       ```

- [ ] **Utsunomiya Nacht-Zeitraffer auf PeerTube hochladen**
  - **Beitrag:** `content/post/JapanNovember2026-Utsunomiya/index.de.md`
  - **Aktuell gehostet auf Cloudflare R2:** `DO3EET-r3:do3eet-assets/posts/JapanNovember2026-Utsunomiya/PXL_20261123_075050956.mp4` (1080p AV1, 3,58 MiB, ohne Ton/Metadaten)
  - **Aufgaben:**
    1. Video auf PeerTube (`tube.tchncs.de`) hochladen.
    2. Den `<video>`-Block in `content/post/JapanNovember2026-Utsunomiya/index.de.md` durch das PeerTube-`<iframe>` ersetzen (mit `p2p=0`, wie in den anderen Beiträgen).
    3. Danach die Videodatei auf R2 löschen, um Free-Tier-Speicher und Requests zu sparen:
       ```bash
       rclone deletefile DO3EET-r3:do3eet-assets/posts/JapanNovember2026-Utsunomiya/PXL_20261123_075050956.mp4 --s3-no-check-bucket
       ```
