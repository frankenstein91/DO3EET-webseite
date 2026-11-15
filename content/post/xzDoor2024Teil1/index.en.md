+++
title = 'CVE-2024-3094 xz/sshd Backdoor'
date = 2024-04-02T09:56:58+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Security",
]
+++

Shocked, paranoid, and exhausted—that's how the open-source community is emerging from the long Easter weekend. Someone planted a "mole" inside one of the most ubiquitous projects around, `xz`, and by extension indirectly inside `sshd`. The full technical breakdown is all over the internet by now and is sure to keep getting regular updates...

In the meantime, I wanted to share my first detection script—it simply checks for all the indicators of the issue I know of so far.
<!--more-->
```bash
#! /bin/bash

for file in $(find / -type f -name "xz" -perm /u+x 2> /dev/null); do
    echo "Testing $file"
    version=$($file --version)
    while IFS= read -r line; do
        echo -n "Checking version: $line  "
        if [[ $line =~ (5\.6\.1|5\.6\.0)$ ]]; then
            echo -e "\e[31m⚠\e[0m" # Print ⚠ in red
        else
            echo -e "\e[32m🗹\e[0m" # Print 🗹 in green
        fi

        # check if xz is a newer version than 5.2.5
        # check if xz is a version than 5.2.*
        if [[ $line =~ (5\.2\.[6-9]) ]]; then
            echo -e "xz is a newer version than 5.2.5  \e[31m⚠ Jia Tan worked on it\e[0m"
        elif [[ $line =~ (5\.[3-9]\.[0-9]) ]]; then
            echo -e "xz is a newer version than 5.2.5  \e[31m⚠ Jia Tan worked on it\e[0m"
        else
            echo -e "xz is not a newer version than 5.2.5  \e[32m🗹\e[0m"
        fi

        # check if xz is a newer version than 5.4.4
        # check if xz is a version than 5.4.*
        if [[ $line =~ (5\.4\.[5-9]) ]]; then
            echo -e "xz is a newer version than 5.4.4  \e[31m⚠ Hans Jansen worked on it\e[0m"
        elif [[ $line =~ (5\.[5-9]\.[0-9]) ]]; then
            echo -e "xz is a newer version than 5.4.4  \e[31m⚠ Hans Jansen worked on it\e[0m"
        else
            echo -e "xz is not a newer version than 5.4.4  \e[32m🗹\e[0m"
        fi

    done <<< "$version"
done

for file in $(find / -type f -name "sshd" -perm /u+x 2> /dev/null); do
    echo "Testing $file"
    ldd_output=$(ldd "$file")
    if [[ $ldd_output == *liblzma* ]]; then
        echo -e "Linked to liblzma  \e[31m⚠\e[0m"
    else
        echo -e "Not linked to liblzma  \e[32m🗹\e[0m"
    fi
    
    if [[ $file == "/usr/sbin/sshd" ]]; then
        echo -e "sshd in /usr/sbin  \e[31m⚠\e[0m"
    else
        echo -e "sshd not in /usr/sbin  \e[32m🗹\e[0m"
    fi

done
if ! pgrep -x "sshd" > /dev/null; then
    echo -e "No sshd running  \e[32m🗹\e[0m"
else
    echo -e "sshd is running  \e[31m⚠\e[0m"
fi

if [[ $LD_BIND_NOT == 1 ]]; then
    echo -e "LD_BIND_NOT is 1  \e[32m🗹\e[0m"
else
    echo -e "LD_BIND_NOT is not 1  \e[31m⚠\e[0m"
fi

if [[ -z $LD_DEBUG ]]; then
    echo -e "LD_DEBUG environment variable not set  \e[31m⚠\e[0m"
else
    echo -e "LD_DEBUG environment variable set  \e[32m🗹\e[0m"
fi

if [[ -z $LD_PROFILE ]]; then
    echo -e "LD_PROFILE environment variable not set  \e[31m⚠\e[0m"
else
    echo -e "LD_PROFILE environment variable set  \e[32m🗹\e[0m"
fi

if [[ -z $TERM ]]; then
    echo -e "TERM environment variable not set  \e[31m⚠\e[0m"
else
    echo -e "TERM environment variable set  \e[32m🗹\e[0m"
fi

if [[ -n $LANG ]]; then
    echo -e "LANG environment variable set  \e[31m⚠\e[0m"
else
    echo -e "LANG environment variable not set  \e[32m🗹\e[0m"
fi

# Concatenate the output of zgrep XZ_DEC /proc/config.gz and zgrep LZMA /proc/config.gz
config_output=$(zgrep XZ_DEC /proc/config.gz && zgrep LZMA /proc/config.gz)

if [[ $? -eq 0 ]]; then
    config_array=()
    kernel_status=false
    while IFS= read -r line; do
        config_array+=("$line")
    done <<< "$config_output"
    # print all array elements
    for element in "${config_array[@]}"
    do
        if [[ ! $element =~ ^# ]]; then
            if [[ $element =~ =y$ ]]; then
                kernel_status=true
            fi
        fi
    done
    if $kernel_status; then
        echo -e "Kernel is compiled with XZ_DEC and/or LZMA support  \e[31m⚠ Jia Tan worked on it\e[0m"
    else
        echo -e "Kernel is not compiled with XZ_DEC and/or LZMA support  \e[32m🗹\e[0m"
    fi
else
    echo -e "Kernel check failed  \e[33m☠\e[0m"
fi
```
