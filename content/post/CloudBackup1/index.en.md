+++
title = 'Backing Up Data to the Cloud'
date = 2024-05-20T16:40:35+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Filesystem",
    "Backup",
    "Cloud",
]
+++

For this walkthrough, I'm spinning up a fresh Arch Linux VM. My goal is to provide a solid starting guide for setting up a secure cloud backup—naturally to the best of my knowledge, with no guarantees attached.
<!--more-->
# Accessing the AUR
Even though accessing the AUR[^1] is possible without extra tools, helper utilities make life much easier. I like using [pikaur](https://github.com/actionless/pikaur), which is written in Python. Installation is straightforward and takes just a few lines on the command line:
```bash
sudo pacman -Sy --needed base-devel git pyalpm
git clone https://github.com/actionless/pikaur.git
cd pikaur
python3 ./pikaur.py -Sy pikaur
```
That last step installs `pikaur` onto the system. Along the way it will ask whether you want to view or edit the PKGBUILD—you can safely answer "No" here. When it asks whether to proceed with the installation, "Yes" is obviously the right call.
Afterward, you can clean up with these two lines:
```bash
cd ..
rm -rf pikaur
```

# Accessing Google Drive
To access cloud storage, I went with the [rclone](https://rclone.org/) project. I originally wanted to use [google-drive-ocamlfuse](https://astrada.github.io/google-drive-ocamlfuse/), but kept running into brick walls during installation.
Right away, `pikaur` gets its first real workout...
```bash
pikaur -Sy rclone
```
Setting up the connection to Google Cloud requires a browser on the system. It doesn't really matter which one you pick; for this example, I installed Google Chrome with `pikaur -Sy google-chrome`.

Now you can set up your Google connection with `rclone config`. It's a guided wizard, so there's no need for a detailed play-by-play. For a more secure setup, I recommend choosing scope `3` for Google Drive—that way `rclone` can only see the files and folders it creates itself. Right after configuring the remote, I'd go ahead and create a dedicated backup folder with `rclone mkdir GoogleDrive1:/Backup1`.

Locally, we still need a mount directory and a place for the config files:
```bash
mkdir -p ~/.config/systemd/user/
mkdir .backups
cd .backups/
mkdir googlemount
mkdir -p .cache-dir/googlemount
```
Optional, but very handy: `loginctl enable-linger`. With this little tweak to the user account, `systemd` can act on the user's behalf and run things in the background even when nobody is logged in.

Next, we hop into our text editor and create a `systemd` mount unit. This unit will mount Google Drive directly into our filesystem.
`code /home/funker/.config/systemd/user/home-funker-.backups-googlemount.mount`... you can easily generate the proper unit filename using `systemd-escape -p --suffix=mount "/home/funker/.backups/googlemount"`.
```
[Unit]
Description=Mount for /home/funker/.backups/googlemount
[Mount]
Type=rclone
What=GoogleDrive1:Backup1
Where=/home/funker/.backups/googlemount
Options=rw,_netdev,args2env,vfs-cache-mode=writes,config=/home/funker/.config/rclone/rclone.conf,cache-dir=/home/funker/.backups/.cache-dir/googlemount
```

# Encrypting Files on Google
Sensitive data shouldn't sit unencrypted in the cloud, even if you trust the provider. Tools like `gocryptfs`, `cryfs`, and `Tomb` are great options here. On Arch Linux, `gocryptfs` installs cleanly as `gocryptfs`.
We continue working inside `/home/funker/.backups`, where we create a `.config` directory as well.
Since we want mounting to be automated, we'll generate a password file right away and initialize the encrypted container:
```bash
pikaur -Sy pwgen
pwgen -ys 256 1 > .config/fs1.passwd
systemctl --user start home-funker-.backups-googlemount.mount
gocryptfs -init -config /home/funker/.backups/.config/fs1.conf -passfile /home/funker/.backups/.config/fs1.passwd /home/funker/.backups/googlemount
```
Make sure to back up the master key and config file onto an external storage medium and keep them somewhere safe.
```bash
mkdir /home/funker/.backups/googledecry
code /home/funker/.config/systemd/user/home-funker-.backups-googledecry.mount
```
```
[Unit]
Description=Mount for /home/funker/.backups/googledecry
Requires=home-funker-.backups-googlemount.mount
[Mount]
Type=fuse./usr/bin/gocryptfs
What=/home/funker/.backups/googlemount
Where=/home/funker/.backups/googledecry
Options=passfile=/home/funker/.backups/.config/fs1.passwd,config=/home/funker/.backups/.config/fs1.conf
```

From here, you can mount your backup for a first test with `systemctl --user start home-funker-.backups-googledecry.mount`, and unmount it again with `systemctl --user stop home-funker-.backups-googledecry.mount`.

# Status Check So Far
With these lines in place, you've got an encrypted backup sitting on Google's cloud. As long as your account isn't hacked, deleted, or compromised, the only remaining risk is Google Drive ending up in the [Google Graveyard](https://gcemetery.co/) or Google shutting down altogether. Both scenarios are wildly unlikely—then again, I wouldn't have bet on Google Cloud Print getting axed either.

# Adding a Second Cloud as a Mirror
To eliminate even that risk, it pays to hook up a second cloud provider. A local NAS or something similar would work well here too. For this example, we'll use S3 storage instead. To test it out, I'll quickly spin up a MinIO server in Docker:
```bash
docker run -p 9000:9000 -p 9001:9001 --name minio -e "MINIO_ROOT_USER=admin" -e "MINIO_ROOT_PASSWORD=toortoor123" quay.io/minio/minio server /data --console-address ":9001"
```
This Docker container is just for testing, of course, not for production use.

You'll find the setup again in `rclone config` under option `4` and then `18`—just answer the prompts as usual.
Then create an S3 bucket with `rclone mkdir MinIO1:/backup1`.

And now for a few more lines of Bash:
```bash
mkdir /home/funker/.backups/s3mount/
mkdir /home/funker/.backups/s3decry/
mkdir /home/funker/OnlineBackup
mkdir /home/funker/.backups/.cache-dir/s3mount/
pwgen -ys 256 1 > /home/funker/.backups/.config/fs2.passwd
code /home/funker/.config/systemd/user/$(systemd-escape -p --suffix=mount "/home/funker/.backups/s3mount/")
```
Then in the text editor:
```
[Unit]
Description=Mount for /home/funker/.backups/s3mount
[Mount]
Type=rclone
What=MinIO1:backup1
Where=/home/funker/.backups/s3mount
Options=rw,_netdev,args2env,vfs-cache-mode=writes,config=/home/funker/.config/rclone/rclone.conf,cache-dir=/home/funker/.backups/.cache-dir/s3mount
```
With that, accessing the S3 bucket should work smoothly, so we can move on to securing this side as well.

# Encrypting Files on the Second Target
Here too, we need to initialize an encrypted container:
```bash
systemctl --user start home-funker-.backups-s3mount.mount
gocryptfs -init -config /home/funker/.backups/.config/fs2.conf -passfile /home/funker/.backups/.config/fs2.passwd /home/funker/.backups/s3mount
code /home/funker/.config/systemd/user/$(systemd-escape -p --suffix=mount "/home/funker/.backups/s3decry/")
```
And again, add the unit config in the editor:
```
[Unit]
Description=Mount for /home/funker/.backups/googledecry
Requires=home-funker-.backups-s3mount.mount
[Mount]
Type=fuse./usr/bin/gocryptfs
What=/home/funker/.backups/s3mount
Where=/home/funker/.backups/s3decry
Options=passfile=/home/funker/.backups/.config/fs2.passwd,config=/home/funker/.backups/.config/fs2.conf
```

# Another Quick Checkpoint
At this stage, you now have two encrypted locations for your backups, encrypted with separate passwords across different providers. As things stand, though, you still have to keep the data in sync manually.

# Mirroring with `union`
For this step, we manually extend `/home/funker/.config/rclone/rclone.conf`:
```
[spiegel]
type = union
upstreams = /home/funker/.backups/s3decry:writeback /home/funker/.backups/googledecry
action_policy = all
create_policy = all
search_policy = ff
```

And again, it's best to wrap this in a `systemd` unit file:

`code /home/funker/.config/systemd/user/$(systemd-escape -p --suffix=mount "/home/funker/OnlineBackup")`
```
[Unit]
Description=Mount for /home/funker/OnlineBackup
Requires=home-funker-.backups-s3decry.mount
Requires=home-funker-.backups-googledecry.mount
[Mount]
Type=rclone
What=spiegel:
Where=/home/funker/OnlineBackup
Options=rw,_netdev,args2env,config=/home/funker/.config/rclone/rclone.conf
```
You can now mount the mirror with `systemctl --user start home-funker-OnlineBackup.mount` and unmount it with `systemctl --user stop home-funker-OnlineBackup.mount`. When stopping it, the automatically started dependency mounts stay active—which isn't exactly ideal, though it might come in handy for debugging.

# Backup Path

```goat
                  .---------------.
                  | Backup Folder |
                  '-------+-------'
                          |
         .----------------+----------------.
         |                                 |
.--------+---------.            .----------+-----------.
|   S3 decrypted   |            |   Google decrypted   |
'--------+---------'            '----------+-----------'
         |                                 |
.--------+---------.            .----------+-----------.
|   S3 encrypted   |            |   Google encrypted   |
'--------+---------'            '----------+-----------'
         |                                 |
.--------+---------.            .----------+-----------.
| S3 Cloud Storage |            | Google Cloud Storage |
'------------------'            '----------------------'
```

# Wrapping Up
As always, questions are very welcome...

[^1]: Arch User Repository
