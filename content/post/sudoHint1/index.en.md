+++
title = 'Linux sudo Tip for Switchers'
date = 2024-04-26T21:52:52+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Security",
]
+++

Anyone switching from Windows to Linux will quickly bump into the `sudo` command. It stands for "superuser do"... loosely translated, "admin, make it happen."
Often when you run it, you have to enter your password. While typing, you'll immediately notice there's no visual feedback like the asterisks you're used to on Windows.

If you'd like to change that, open the config file with `sudo visudo`. You should never edit it directly with a plain text editor—using `visudo` gives you much better safety and convenience compared to hacking on the `sudoers` file directly. Inside that file, simply add the line `Defaults pwfeedback`. To type text in `vi`, press `i` to enter insert mode. Once you've made your edit, hit the **ESC** key and type `:wq` to save and quit.
