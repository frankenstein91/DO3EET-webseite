+++
title = 'BTRFS Best Practices'
date = 2024-03-28T13:04:18+01:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Filesystem",
]
+++

BTRFS[^1] is a modern filesystem known for its versatility, fault tolerance, and performance, and it's under active development. The operating systems with BTRFS support that I know of are GNU/Linux and ReactOS—though my enthusiasm is definitely aimed more at Linux.

In this guide, I'll walk through a few best practices for using BTRFS. As usual in the Open Source world, these are just suggestions based on my own experience—take them as friendly pointers. We'll cover topics like:
- Partitioned vs. partitionless setups
- Subvolume structure
- Compression
- Troubleshooting, maintenance, backups, and recovery

# LinuxFilesystemHierarchyBasics
The Filesystem Hierarchy Standard (FHS) defines a directory layout for Linux filesystems. It ensures that important files and directories can be found in predictable places, making system administration and day-to-day use much easier. Most developers stick to this convention so they can rely on things being where they expect them.

The VFS[^2] is structured as a tree and doesn't use drive letters like Windows does. Everything starts at the root directory (`/`), from which all other directories branch off.

- **Standard directories:** Key directories like `/bin`, `/etc`, `/home`, `/usr`, and `/var` each serve a specific purpose.
- **Consistency:** The directory layout is the same across Linux distributions, as long as they adhere to the FHS.
- **Extensibility:** The FHS can be extended with additional directories and files.
- **Recommendation:** You don't *have* to follow the hierarchy, though you should expect trouble if you don't.

## Key Directories in the FHS

* `/bin`: Contains executable binaries available to all users.
* `/boot`: Contains the system's boot files, and on modern systems EFI stubs as well. Usually formatted as FAT32.
* `/dev`: Contains device drivers and device files.
* `/etc`: Contains configuration files for the system and installed applications.
* `/home`: Contains user home directories.
* `/lib`: Contains libraries used by applications. On systems supporting multiple CPU architectures, there can be several folders here, such as `lib32` and `lib64`.
* `/media`: Contains mount points for removable media like CDs and DVDs.
* `/mnt`: Contains temporary mount points for filesystems.
* `/opt`: Contains optional software packages.
* `/proc`: Contains information about running processes.
* `/root`: The home directory of the root user.
* `/run`: Contains files needed for the running system that may change dynamically.
* `/sbin`: Contains executables intended for system administrators.
* `/sys`: Contains information about the system, such as kernel modules and devices.
* `/tmp`: Contains temporary files.
* `/usr`: Contains most program files and libraries.
* `/var`: Contains variable data, such as log files and databases.

# Partitioned vs. Partitionless
One feature of BTRFS I find particularly interesting is running it in partitionless mode. Here, the block device isn't carved up into partitions at all; instead, the filesystem is written straight onto the raw device. That means no GPT and no MBR.
You do trade away compatibility with some older systems and software, but in return you get more efficient space usage and greater flexibility. Especially in virtualized environments where a virtual disk can easily be grown, you don't have to shuffle partitions around just to expand a volume.

Creating a BTRFS drive with a partition:
```bash
sfdisk --wipe=always /dev/sdx << EOF
type=83
write
EOF
mkfs.btrfs --csum xxhash /dev/sdx1
```
And now without the overhead:
```bash
mkfs.btrfs --csum xxhash /dev/sdx
```
So you can save yourself a few lines whenever you want to use the whole disk and don't need a small separate partition for booting.

# Subvolume Layout
Another feature I rely on heavily across my systems is subvolumes. They let you split a single BTRFS filesystem into many logical units that still share the same pool of storage. To users and applications, subvolumes look just like regular folders or mount points (you can mount individual subvolumes at different locations in the VFS).

Just like with the Linux filesystem hierarchy, there are only conventions here for how to organize your BTRFS layout. As far as I know, aside from pure "chaos," two main camps have emerged: on one side the `@` naming convention, and on the other (my camp) the `__` (double underscore) layout. So here's how I structure my BTRFS drive, along with the commands to get there.

```bash
mkfs.btrfs --csum xxhash /dev/sdx
mkdir /run/btrfs-sdx
mount /dev/sdx /run/btrfs-sdx -o compress-force=zstd:5,autodefrag,subvolid=5
mkdir /run/btrfs-sdx/__current /run/btrfs-sdx/__snapshot /run/btrfs-sdx/__documentation
```
These lines format the entire disk and mount it with options that compress every block and automatically improve performance via defragmentation. Finally, I create three directories at the root of the filesystem:
- **__current**: where all active subvolumes will live
- **__snapshot**: a home for all read-only snapshots
- **__documentation**: a place to document the setup and any changes made, making it easy to retrace your work later.

```bash
btrfs subvolume create /run/btrfs-sdx/__documentation/btrfs
date +"%Y-%m-%d %T" > /run/btrfs-sdx/__documentation/btrfs/creation.txt
```
Once I've built the basic structure, I start documenting right away. I write the creation timestamp into the file via command line, and fill in the rest using `nano` or `vi`—for example, noting which subvolumes I plan to create and what each one is for (inside `__documentation`).
After writing the documentation and finishing the setup, I always take a snapshot of that subvolume:
```bash
btrfs subvolume snapshot -r /run/btrfs-sdx/__documentation/btrfs /run/btrfs-sdx/__snapshot/doc_btrfs_$(date +"%Y-%m-%d")
```
In the end, a layout like this might look something like:
```
.
├── __current
│   ├── home
│   ├── rootfilesystem
│   └── var
├── __documentation
│   └── btrfs
└── __snapshot
    └── doc_btrfs_2024-03-28
```
Since snapshots are no substitute for backups... on to the next point...

# Troubleshooting & Maintenance
Because BTRFS also stores checksums in its metadata, you can spot hardware errors quickly, easily, and still too late (unless you're using BTRFS's RAID features). Notice in my examples I switched the checksum from 32-bit CRC32C to 64-bit xxhash, which drastically lowers the odds of hash collisions.

Our filesystem of choice exposes error counters for monitoring via `btrfs device stats /run/btrfs-sdx/`. Like in my example below, these should all be 0—otherwise you've got trouble.
```
[/dev/sdx].write_io_errs    0
[/dev/sdx].read_io_errs     0
[/dev/sdx].flush_io_errs    0
[/dev/sdx].corruption_errs  0
[/dev/sdx].generation_errs  0
```
The commands `btrfs scrub start /run/btrfs-sdx/` and `btrfs scrub status /run/btrfs-sdx/` also help keep the filesystem healthy. This kicks off a pass over all data and metadata and verifies every checksum. Since the scrub runs in the background, you check its progress with `status`. While a scrub is still running, it looks like this...
```
Scrub started:    Thu Mar 28 16:05:02 2024
Status:           running
Duration:         0:00:15
Time left:        0:00:49
ETA:              Thu Mar 28 16:06:08 2024
Total to scrub:   139.03GiB
Bytes scrubbed:   32.08GiB  (23.08%)
Rate:             2.14GiB/s
Error summary:    no errors found
```
and once it finishes, it will hopefully look like this—meaning completely error-free...
```
Scrub started:    Thu Mar 28 16:05:02 2024
Status:           finished
Duration:         0:00:59
Total to scrub:   139.03GiB
Rate:             2.36GiB/s
Error summary:    no errors found
```

## RAID
BTRFS splits data into 3 containers:
1. Data
2. Metadata
3. Systemdata

You can configure separate storage profiles for each of these categories. By default, Data uses `single`, while Metadata and Systemdata use `DUP`.

| **RAID Level** | **Description** |
|:---:|:---:|
| Single | Contents are stored with no extra copy |
| DUP | Contents are written twice onto the same drive |
| RAID1 | Contents are stored twice across different drives |
| RAID1C3 | Contents are stored 3 times across different drives |
| RAID1C4 | Contents are stored 4 times across different drives |
| RAID0 | Contents are striped across two different drives to boost speed |
| RAID10 | A combination of RAID1 and RAID0 |

Every RAID* level except RAID0 requires a pool of multiple BTRFS devices, which you add using `btrfs device add`.

If you want to convert your system to BTRFS RAID1 after adding another disk, for instance, run:
```bash
btrfs balance start -dconvert=raid1 -mconvert=raid1 /run/btrfs-sdx/
```

Still, RAID won't protect you against ransomware...

## BTRFS Backup
For backups the BTRFS way, make sure both your source system and your backup target use BTRFS filesystems—otherwise it simply won't work.

It's also crucial to create a snapshot first before backing up, ensuring you're copying a consistent state. Once the backup finishes successfully, you can delete that snapshot.

Since backups are critical and deserve proper attention, I'll just point you to the two commands `btrfs send` and `btrfs receive`. They work together as a pair and can even run across different machines over SSH.

[^1]: B-tree Filesystem
[^2]: Virtual Filesystem Switch
