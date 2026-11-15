+++
title = 'CVE-2024-3094 xz/sshd Backdoor – Part 2'
date = 2024-04-08T08:45:40+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Security",
]
+++

A few days ago, I published a quick test script without actually explaining its output. I'd like to make up for that oversight now. We'll walk through the script from [Part 1]({{< ref "/post/xzdoor2024teil1" >}}).

In the first section, my little creation hunts down every executable file (where the owner has execute permissions) named `xz`. I deliberately chose not to limit the search to `$PATH`, since I spotted an `xz` binary tucked inside a Flatpak, for example. Inside the loop, I check the version numbers of the binary and `liblzma` against three states:
1. Is it a directly affected version number? If so, urgent action might be required.
2. My script checks whether it's a version that the suspect contributor Jia Tan worked on. So far there's no proof of additional backdoors, yet I still find it sketchy.
3. Hans Jansen is also suspect... so I flag anything starting from his first commit too.

Next, I scan the system for SSH server binaries named `sshd`. Each executable found is checked against two conditions that, according to current findings, are required for the backdoor to actually trigger:
1. `sshd` is linked against `liblzma`. Based on what we know right now, there's no other way for the backdoor to slip into the server process.
2. The attacker restricted the binary path, meaning `sshd` has to live under `/usr/sbin` for the backdoor to fire.

Plenty of write-ups on the backdoor noted that it fails to activate when `LD_BIND_NOT=1` is set, so I decided to check for that on the system as well. On Linux, `LD_BIND_NOT=1` disables lazy dynamic symbol binding during program execution, resolving all symbols immediately at load time instead. It's handy for debugging, though it should be used carefully since it can hurt performance and trigger weird behavior. Conveniently, the backdoor gets spooked by anything that smells like debugging.

For the exact same reason, the script also checks the environment for `LD_DEBUG` and `LD_PROFILE`.

I still haven't quite figured out why the backdoor refuses to launch when the `TERM` environment variable is set... yet it appears to be a fact. Furthermore, the vulnerability can only be exploited if a `LANG` environment variable is set, so I threw in a check for that too.

Since our actor Jia Tan also contributed to the Linux kernel—including `xz` and `LZMA` code, as far as I know—I added a warning for kernels compiled with that support enabled. Whether there's an exploit hiding there, I have no idea... still, pretty sus.

All in all, I'd say **everyone should interpret my script's output for themselves**, though it gives a solid overview. Of course, your system's security also depends on plenty of other factors (firewalls, jump hosts, etc.).

The [BSI advisory](https://www.bsi.bund.de/SharedDocs/Cybersicherheitswarnungen/DE/2024/2024-223608-1032.html) provides a very thorough rundown of the incident, other detection tools, and mitigations. For Arch Linux users, there's a near-all-clear over in the [Arch Linux News](https://archlinux.org/news/the-xz-package-has-been-backdoored/).

If you still have questions or open points... there's room for them down below ;)
