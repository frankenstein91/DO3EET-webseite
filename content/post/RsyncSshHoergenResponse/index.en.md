+++
title = "Response to hoergen: Torture-Testing rsync over SSH – Benchmarks, Myths, and Best Practices 2026"
date = "2026-09-03T15:53:30+02:00"
draft = false
author = "Frank Tornack"
tags = [
    "rsync",
    "SSH",
    "Linux",
    "Benchmark",
    "Performance",
    "Backup",
    "Sysadmin"
]
description = "A technical deep dive and benchmark torture test of modern rsync and SSH pipelines: why legacy tuning myths like arcfour or blanket compression bans no longer hold up on modern multi-core CPUs with AES-NI."
summary = "A technical deep dive and benchmark torture test of modern rsync and SSH pipelines: why legacy tuning myths like arcfour or blanket compression bans no longer hold up on modern multi-core CPUs with AES-NI."
+++

> **Note:**  
> This post is a constructive technical response to the worthwhile article [“rsync über SSH – Hochperformante Backups und Synchronisation”](https://hyperblog.de/hoergen/posts/2026/2026-09-01-rsync-ssh/) by **hoergen** from September 1, 2026, which I spotted via [planet.ubuntuusers.de](https://planet.ubuntuusers.de/).  
> I really appreciate hands-on posts from the Linux community—it's articles like these that push me to question my own setup, take measurements, and learn something new. Since some of the flags recommended there (especially `arcfour`, `--no-compress`, and GNU `parallel`) hide unexpected performance traps from a modern hardware and kernel perspective, I spun up a scientific test lab to put those claims through their paces under controlled conditions.

---

## Why I'm Rethinking rsync and SSH in 2026

15 to 20 years ago, the world of system administration looked completely different: {{< fire >}}Single-core CPUs started sweating the moment data was compressed or encrypted.{{< /fire >}} RAM was scarce, NICs pushed 100 Mbps over unshielded Cat.5 cables, and hardware crypto accelerators were practically exclusive to eye-wateringly expensive PCI cards in banking data centers.

From that era come plenty of rules of thumb that still haunt blog posts and forums today:
1. *“Use arcfour / RC4 for SSH—sure it's insecure, but it's way faster!”*
2. *“Never compress on fast networks—the CPU only bottlenecks throughput!”*
3. *“Parallelize everything with GNU parallel to force higher throughput!”*

Today, in 2026, the hardware landscape looks fundamentally different: CPUs pack highly specialized silicon instruction sets like **Intel AES-NI**, **AVX2/AVX-512 vector units**, massive L3 caches, and blazing-fast DDR5 memory. Meanwhile, modern, ultra-lightweight algorithms like **`lz4`**, **`zstd`**, and **`xxh3`** have been baked deep into `rsync`.

To find out what actually speeds up modern backup pipelines—and what quietly kneecaps them—I built an uncompromising test lab.

---

## The Test Setup: A Scientific Zero-I/O Lab

To eliminate measurement noise from fluctuating NVMe write caches, flash controller throttling, or filesystem fragmentation 100%, the entire experiment was built inside a **pure RAM disk (`tmpfs`)**.

```goat
.-----------------------------------------------------------------------.
|                         HOST SYSTEM (RAM-DISK)                        |
|               Intel Core i7-1370P (14 Cores / 20 Threads)             |
|                                                                       |
|   .-------------------------.           .-------------------------.   |
|   |     lab-ssh-client      |           |     lab-ssh-server      |   |
|   |   CPUs: 8, 9, 10, 11    |           |   CPUs: 4, 5, 6, 7      |   |
|   |   (P-Cores 4 & 5)       |           |   (P-Cores 2 & 3)       |   |
|   |                         |           |                         |   |
|   |  Source: /daten/ (tmpfs)|           |  Dest: /backup/ (tmpfs) |   |
|   '------------+------------'           '------------^------------'   |
|                |                                     |                |
|                '------> Docker Bridge (MTU 65535) ---'                |
|                         Throughput: 75.5 Gbps                         |
'-----------------------------------------------------------------------'
```

### Key Lab Specs:
* **CPU:** 13th Gen Intel Core i7-1370P (14 cores, 20 threads, up to 5.2 GHz turbo).
* **Core Pinning (Zero Thread Contention):**  
  * `lab-ssh-client` runs isolated on performance cores **8, 9, 10, 11** (P-Cores 4 & 5).
  * `lab-ssh-server` runs isolated on performance cores **4, 5, 6, 7** (P-Cores 2 & 3).
  * Host processes, desktop, and I/O run separately on the E-cores (CPUs 12–19).
  * This physically eliminates any CPU contention between sender and receiver.
* **Virtual Network:** Docker bridge with jumbo frames (**MTU 65535**).  
  * Measured baseline bandwidth with `iperf3`: **75.5 Gbps** (87.9 GB in 10 seconds with only 3 retransmissions).
* **Telemetry:**  
  * Timing: Nanosecond precision via Python's `time.perf_counter()`.
  * CPU accounting: Direct Linux kernel readings from `/sys/fs/cgroup/cpu.stat` (cgroups v2).
  * Statistical rigor: **1 warmup run + 5 validated runs** per data point with mean ($\mu$) and standard deviation ($\sigma$). The destination directory was wiped completely before each run.

---

## The `arcfour` Fallacy: Why Old Myths Are Actually Slower

In his [Performance Tuning](https://hyperblog.de/hoergen/posts/2026/2026-09-01-rsync-ssh/#performance-tuning) section, hoergen writes:

> *“Faster connection: [-e "ssh -c arcfour"](https://hyperblog.de/hoergen/posts/2026/2026-09-01-rsync-ssh/#performance-tuning:~:text=ssh%20%2Dc%20arcfour) (less secure, but faster)”*

### The Problem on Modern Linux:
Anyone running that command on a current Linux system gets a rude awakening:
```text
Unknown cipher type 'arcfour'
```
OpenSSH **completely ripped out** the RC4 stream cipher `arcfour` back in version 7.6, because the cipher is cryptographically broken and can be decrypted by intelligence agencies in real time.

### The Torture Test: What Happens If I Bring `arcfour` Back?
Rather than dismissing hoergen's claim on theory alone, I spun up an older OpenSSH 7.4 (Debian Stretch) inside a Docker container where `arcfour` is still compiled in. Then I pitted `arcfour` directly against modern ciphers on identical hardware using 1 GB of binary data:

| Encryption Algorithm | Duration ($\mu \pm \sigma$) | Effective Throughput | Client CPU | Verdict / Hardware Effect |
| :--- | :---: | :---: | :---: | :--- |
| **`aes256-gcm@openssh.com`** | **2.03s $\pm$ 0.02s** | **504.9 MB/s** | **29.8%** | 🏆 **Winner** (Intel AES-NI hardware acceleration) |
| **`aes128-gcm@openssh.com`** | **2.03s $\pm$ 0.02s** | **503.8 MB/s** | **29.6%** | 🏆 **Winner** (Intel AES-NI hardware acceleration) |
| **`chacha20-poly1305@openssh.com`** | 3.04s $\pm$ 0.09s | 337.0 MB/s | 36.3% | Software stream cipher without crypto hardware |
| **`arcfour256` (RC4 256-bit)** | 3.14s $\pm$ 0.03s | 326.6 MB/s | 37.3% | Software stream cipher (+55% longer runtime) |
| **`arcfour` (RC4 128-bit)** | **3.19s $\pm$ 0.03s** | **320.6 MB/s** | **37.3%** | 🐌 **57% SLOWER & +26% MORE CPU than AES!** |

### Why Is `arcfour` So Slow Today?
1. **No hardware instructions:**  
   `arcfour` (RC4) simply does not exist in the modern x86_64 instruction set. Every single byte has to be painfully shuffled through general-purpose CPU registers in software.
2. **Intel AES-NI runs straight in silicon:**  
   Modern CPUs have dedicated hardware pipelines (`aesenc`, `vaes`) that crunch AES-GCM autonomously and in parallel with other instructions.
3. **Bottom line:** Recommending `arcfour` isn't just wildly insecure—on any CPU built in the last 15 years, it's **over 50% slower than secure AES-GCM**!

---

## The Compression Myth: `--no-compress` on Fast Networks

Under the flags section, the original post advises:
> *“No compression --no-compress (on fast networks)”*

The intuition seems solid: if the network is fast enough, compressing only wastes CPU time. **Does that still hold true on modern multi-core CPUs?**

I benchmarked three datasets (1 GB each) across three network tiers (75.5 Gbps RAM net, 1 Gbps LAN, and 100 Mbps WAN) with different compression methods:

### Test Case: 1 GB of Text & Server Logs on a 75.5 Gbps Network
| Compression Method | Duration | Throughput | Wire Data Sent | Client CPU |
| :--- | :---: | :---: | :---: | :---: |
| **`--no-compress` (No compression)** | 1.40s | 734.5 MB/s | 1024.3 MB | 25.5% |
| **`rsync zlib (-z)` (Classic)** | 0.75s | 1368.3 MB/s | 0.1 MB | 13.3% |
| **`rsync zstd` (Modern default)** | 0.71s | 1441.1 MB/s | 0.1 MB | 12.8% |
| **`rsync lz4` (High-speed)** | **0.56s** | **1827.0 MB/s** | 19.1 MB | 15.7% |

**Finding:** Even at an absurd **75.5 Gbps** (where the network is practically infinitely fast), `lz4` is **2.4x faster than `--no-compress`**!  
Why? Because modern P-cores shrink data at over 2.5 GB/s—and for the Linux kernel, shoving 19 MB across a socket is simply faster than pushing 1,024 MB of raw bytes down the pipe!

### Test Case: Real 930 MB Project Directory over 1 Gbps LAN
| Compression Method | Duration | Effective Throughput | Client CPU |
| :--- | :---: | :---: | :---: |
| **`--no-compress`** | 7.82s | 118.7 MB/s | 5.8% |
| **`rsync zlib (-z)`** | 4.55s | 204.0 MB/s | 7.9% |
| **`rsync zstd`** | 4.54s | 204.8 MB/s | 8.0% |
| **`rsync lz4`** | **4.47s** | **207.8 MB/s** | 7.6% |

**Finding:** On a typical gigabit LAN, `lz4` cuts backup time nearly in half—from almost 8 seconds down to **4.47 seconds**!

### When Is the Blogger Right?
Strictly when transferring **pure, already-compressed media files** (JPEGs, MP4 videos, `.tgz` archives). There, compression saves 0% bandwidth while costing ~5% CPU inspection overhead. In that case, `--no-compress` is the right call.

---

## The Hidden Trap: Why SSH Compression (`-o Compression=yes`) Is Disastrous

In his high-performance script, hoergen explicitly sets `-o Compression=no`. **Here, the author is 100% spot-on—and for a dramatic reason!**

Plenty of admins think: *“If compression is good, I'll just turn it on in SSH with `ssh -C` or `-o Compression=yes`!”*

I measured exactly that—with shocking results:

| Test Case (75.5 Gbps Net) | Mode | Duration | Throughput | Impact |
| :--- | :--- | :---: | :---: | :--- |
| **1 GB Binary Data** | **rsync `--no-compress` (SSH `Compression=no`)** | **1.31s** | **781.7 MB/s** | **Baseline** |
| 1 GB Binary Data | **SSH `Compression=yes` only** | **24.66s** | **41.5 MB/s** | 🐌 **19x collapse!** |
| **Mixed Project** | **rsync `lz4` (SSH `Compression=no`)** | **0.91s** | **1023.5 MB/s** | **Baseline** |
| Mixed Project | **SSH `Compression=yes` only** | **13.92s** | **66.8 MB/s** | 🐌 **15x slower!** |

### Why Does SSH Compression Tank So Brutally?
OpenSSH runs its `zlib@openssh.com` compression filter **strictly synchronously inside the socket's single-threaded event loop**. When incompressible data hits it, that single thread pegs at 100%, stalls the socket buffers, and caps throughput at a pathetic **40 to 60 MB/s**—no matter how fast your network is!

**Golden Rule:** Keep SSH compression strictly disabled (`-o Compression=no`). Compression belongs solely at the application layer in `rsync` via `--compress-choice=lz4`!

---

## Deeper Research: CPU Cache Splitting & the GNU Parallel Trap

Inspired by my CPU's cache hierarchy (`lscpu`: L1d = 48 KiB, L2 = 1.25 MiB, L3 = 24 MiB), I wondered:  
*Does it make a difference if 1 GB of data is split before transfer so the chunks fit squarely inside the CPU caches?*

Furthermore, hoergen's post recommends:
> `find /daten -type f | parallel -j 8 rsync ...`

So I sliced 1 GB of data into cache-sized chunks and transferred them both **sequentially** and with **GNU Parallel**:

| Cache Tier & Split | Mode | Duration | Throughput | Client CPU | Finding |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **L3 Cache (64x 16 MiB)** | **Sequential (`rsync -a`)** | **1.24s** | **824.5 MB/s** | 26.0% | 🏆 **All-time record! (+23 MB/s faster than 1 GB unsplit)** |
| **Baseline (1x 1024 MiB)** | Sequential (`rsync -a`) | 1.28s | 801.3 MB/s | 24.4% | Unsplit reference |
| **L1d Cache (21,846x 48 KiB)** | Sequential (`rsync -a`) | 1.28s | 803.5 MB/s | **31.8%** | ⚠️ **Syscall overhead:** 21,846 inodes push CPU up +30% |
| **L3 Cache (64x 16 MiB)** | **Parallel (`parallel -j 4`)** | **5.51s** | **185.8 MB/s** | 20.1% | 4.4x slower due to 64 SSH handshakes |
| **L2 Cache (820x 1.25 MiB)** | **Parallel (`parallel -j 4`)** | **41.75s** | **24.5 MB/s** | **13.7%** | <span class="squashed-snail" title="As fast as a squashed snail">🐌</span> **32x SLOWER due to 820 SSH handshakes!** |

### Why 16 MiB (L3 Cache) Wins:
16 MiB fits completely inside the i7-1370P's blazing-fast **24 MB L3 cache** during encryption without forcing the memory controller to evict cache lines to DRAM. At the same time, 64 files are few enough that metadata overhead barely registers.

### The Meltdown of GNU Parallel with Many Files:
Running `find | parallel rsync` spawns a **brand-new SSH process for every single file**!  
With 820 files, the system spends over **40 seconds** doing nothing but negotiating 820 TCP handshakes, Diffie-Hellman key exchanges, and public-key signatures.  
A plain sequential `rsync -a` streams all files through **one single persistent SSH connection** and finishes **32 times faster**!

---

## The Pseudo-Terminal (`-T`): A Hidden Lever for Stability & Speed

An often overlooked SSH switch is **`-T`** (*Disable pseudo-terminal allocation*).  
What happens if you accidentally force a TTY (`-t -t`) or omit `-T`?

* **With forced PTY (`-t -t`):** The `rsync` transfer **crashes immediately with exit code 2**!  
  *Why?* The Linux kernel interprets binary control bytes inside the `rsync` data stream (`0x03` = Ctrl+C, `0x04` = EOF, `0x11` = XOFF) as terminal signals and tears the transfer apart.
* **With explicit `-T`:** Latency drops measurably because no `pty-req` packets or terminal dimensions have to be negotiated. On my 930 MB project, throughput jumped from 916 MB/s to **1,052 MB/s**!

---

## Head-to-Head Showdown: Blog Command vs. My Ultimate Modern rsync

I pitted the final command from hoergen's article directly against my tuned version:

```bash
# hoergen's command from the article:
find /daten -type f | parallel -j 8 rsync -avzP --delete -e "ssh -p 2222 -c aes128-gcm@openssh.com -o Compression=no" {} benutzer@server:/backup/{} --no-compress --bwlimit=10000
```
*(Note: The command also contains conflicting flags like `-z` and `--no-compress` at the same time, plus an artificial throttle of `--bwlimit=10000` = 10 MB/s).*

### Benchmark Results on My Real-World 930 MB Project Directory:

| Approach | Duration | Throughput | Difference |
| :--- | :---: | :---: | :--- |
| **Command from original article** | 23.47s | 39.6 MB/s | Baseline |
| **Standard rsync (`rsync -a`)** | 2.01s | 461.6 MB/s | 11.7x faster |
| **My Ultimate Modern rsync** | **1.03s** | **905.7 MB/s** | <span class="shaking-rocket" title="Maximum acceleration: 22.8x faster!">🚀</span> **22.8x FASTER!** |

---

## Side Quest: rsync Over a Pure OpenSSL Tunnel (`socat` & `stunnel`)

A recurring idea that pops up in discussions is: *“Can't you run rsync over a pure OpenSSL or TLS tunnel to bypass SSH's supposed overhead altogether, or to secure an rsync daemon?”*

> **Spoiler up front: For normal use, it's completely not worth it!**  
> An external OpenSSL tunnel noticeably complicates your infrastructure and, in practice, cuts your transfer rate in half compared to modern SSH.

Since `rsync` has no built-in OpenSSL support, you have to rely on external tunneling tools like **`socat`** (for ad-hoc connections) or **`stunnel`** (for persistent background services). The pattern is always the same: an unencrypted `rsync` daemon (`rsync --daemon`) listens on `localhost` on the server. The tunnel tool wraps that port in TLS toward the outside world, and the client unwraps it locally again.

### The Two Approaches in Practice

#### Option 1: The Ad-Hoc Route with `socat`
1. **Generate a self-signed certificate on the server:**
   ```bash
   openssl req -new -x509 -days 365 -nodes -out server.crt -keyout server.key -subj "/CN=backup-server"
   cat server.key server.crt > server.pem
   chmod 600 server.pem
   ```
2. **Start the tunnel on the server** (listens on TLS port 8443 and forwards to local `rsyncd` port 873):
   ```bash
   socat OPENSSL-LISTEN:8443,reuseaddr,pf=ip4,fork,cert=server.pem,verify=0 TCP4:127.0.0.1:873 &
   ```
3. **Open the tunnel on the client & run rsync:**
   ```bash
   socat TCP4-LISTEN:8730,reuseaddr,pf=ip4,fork OPENSSL:SERVER_IP:8443,verify=0 &
   rsync -a /lokale/daten/ rsync://localhost:8730/backup/
   ```

#### Option 2: The Persistent Service with `stunnel`
On the server, `stunnel` accepts encrypted TLS connections on port 8731 and forwards them to `127.0.0.1:873`. On the client, `stunnel` runs with `client = yes` and exposes a local endpoint at `127.0.0.1:8731`. `rsync` then syncs transparently via `rsync://localhost:8731/backup/`.

### Hard Numbers from the Lab (RAM Disk, 75.5 Gbps)

I pitted both tunnel setups inside my Docker RAM disk against unencrypted `rsyncd` and our tuned SSH setup:

| Transfer Method | 1 GB Binary Data | Real 930 MB Project | 1 GB Logs with `lz4` | Verdict |
| :--- | :---: | :---: | :---: | :--- |
| **Unencrypted (`rsyncd` TCP)** | **1.24s** (826 MB/s) | **0.94s** (989 MB/s) | **0.52s** (1969 MB/s) | Physical ceiling without encryption |
| **Modern SSH (`aes128-gcm`)** | **1.33s** (770 MB/s) | **1.02s** (912 MB/s) | **0.55s** (1862 MB/s) | 🏆 **Test winner (only 7% crypto overhead)** |
| **OpenSSL via `socat`** | 2.57s (398 MB/s) | 2.01s (463 MB/s) | 0.81s (1264 MB/s) | 🐌 **48% slower than SSH** |
| **OpenSSL via `stunnel`** | 2.62s (391 MB/s) | 2.08s (447 MB/s) | 0.84s (1219 MB/s) | 🐌 **49% slower than SSH** |

### Why Does OpenSSL Lose So Badly to OpenSSH?

Even though OpenSSL uses the exact same CPU AES-NI hardware acceleration as OpenSSH, throughput drops by half. The reason is purely architectural:

```goat
.-----------------------------------------------------------------.
|   OpenSSL Tunnel Architecture: 4x TCP Sockets & Buffer Copies   |
|                                                                 |
|   [ CLIENT ]                                                    |
|   .---------------------------------------------------------.   |
|   | rsync (Client Process)                                  |   |
|   '----------------------------+----------------------------'   |
|                                | TCP Loopback (127.0.0.1:8730)  |
|                                v                                |
|   .---------------------------------------------------------.   |
|   | socat / stunnel (Encryption via OpenSSL / TLS 1.3)      |   |
|   '----------------------------+----------------------------'   |
|                                |                                |
|                                | Virtual Network (Port 8443)    |
|                                v                                |
|   [ SERVER ]                                                    |
|   .---------------------------------------------------------.   |
|   | socat / stunnel (Decryption via OpenSSL)                |   |
|   '----------------------------+----------------------------'   |
|                                | TCP Loopback (127.0.0.1:873)   |
|                                v                                |
|   .---------------------------------------------------------.   |
|   | rsync Daemon (rsync --daemon)                           |   |
|   '---------------------------------------------------------'   |
'-----------------------------------------------------------------'
```

1. **Kernel pipes vs. 4x socket overhead:**  
   OpenSSH is spawned directly by `rsync` as a child process. Data flows through an anonymous kernel pipe straight into the SSH process and right out to the NIC.  
   With `socat` or `stunnel`, every single byte has to be pushed through **four separate TCP sockets and user-space buffers** (see the architecture diagram above).
2. **Syscall storm:**  
   Every extra socket hop forces additional `poll()`, `read()`, and `write()` syscalls. Even with tuned TCP buffers (`so-rcvbuf=1MB`), the user-space event loop caps throughput around 400 MB/s.
3. **SSH overhead is negligible today:**  
   With `aes128-gcm`, SSH's encryption overhead compared to completely unencrypted `rsyncd` is a tiny **7%**. An external tunnel saves nothing—it just doubles CPU time.

### When Is an OpenSSL Tunnel Still Useful?

An OpenSSL tunnel isn't a performance tweak—it's a **specialized admin tool** for very specific edge cases:
* **No shell access allowed:** When security policy forbids running an SSH daemon or shell on a locked-down backup appliance or inside unprivileged containers.
* **Firewall restrictions:** When port 22 is blocked and backup traffic must be disguised as HTTPS over port 443.
* **Legacy rsync daemon infrastructure:** When you need to lock down an existing, sprawling `rsyncd` farm from the outside without managing SSH keys for every client.

---

## Interactive rsync & SSH Command Generator

So you don't have to painstakingly copy-paste every flag by hand, I built an interactive terminal-style generator. Just pick your scenario or tweak the paths:

{{< rsync_generator >}}

---

## Summary: The Golden Rules for 2026

If you want to tune `rsync` and SSH for maximum speed today, keep these core rules in mind:

1. **Stay away from `arcfour`:** It's insecure, deleted from OpenSSH, and thanks to Intel AES-NI, **57% slower than `-c aes128-gcm@openssh.com`**.
2. **Compression belongs in rsync, not SSH:** Use `--compress-choice=lz4 -z` on gigabit LANs (cuts transfer time in half!) and `zstd` over slow WAN links. Turn SSH compression ruthlessly off (`-o Compression=no`).
3. **No SSH handshake storms with GNU Parallel:** Stick to standard `rsync -a` to push all files through one persistent tunnel instead of triggering an SSH handshake per file.
4. **Use modern flags:** `--checksum-choice=xxh3` (30 GB/s vectorized hashing), `--inplace` (skip temporary file renames), `--whole-file` (skip delta calculation on fast networks), and `ssh -T` (zero PTY overhead).

---

### Sources & Licensing Notes
* Reference article: [„rsync über SSH - Hochperformante Backups und Synchronisation“](https://hyperblog.de/hoergen/posts/2026/2026-09-01-rsync-ssh/) by **hoergen** (Published 2026-09-01, discovered via [planet.ubuntuusers.de](https://planet.ubuntuusers.de/), accessed 2026-09-03 at 09:06 CEST).
* License of referenced content: [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
* All benchmark measurements and scripts presented in this article were run in my lab on my Framework laptop (Intel Core i7-1370P) in a 100% RAM-disk environment.
* *Transparency Notice:* Almost no emojis were harmed in the making of this article. Consequently, this post cannot be considered digitally vegan or digitally vegetarian.
* *Workplace Safety Notice:* Several Docker containers were forced to work under inhumane conditions during these benchmark runs. 🐳👮👷
