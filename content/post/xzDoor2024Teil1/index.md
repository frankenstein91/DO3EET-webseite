+++
title = 'CVE-2024-3094 xz/sshd Backdoor'
date = 2024-04-02T09:56:58+02:00
draft = false
+++

Geschockt, misstrauisch und erschöpft geht die OpenSource-Community aus dem verlängerten Osterwochenende. Es gab einen "Maulwurf" in einem der verbreitesten Projekte xz und damit auch indirekt in sshd. Die genauen Informationen sind im Internet weit verbreitet und werden sicher noch regemäßig mit Updates versehen...

Ich möchte aber mein erstes Erkennungsskript teilen, es scheckt einfach alle mir bekannten Infos zum Problem ab.

```bash
#! /bin/bash

for file in $(find / -type f -name "xz" -perm /u+x 2> /dev/zero); do
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
            echo -e "xz is a newer version than 5.2.5  \e[31m⚠ worked on it\e[0m"
        elif [[ $line =~ (5\.[3-9]\.[0-9]) ]]; then
            echo -e "xz is a newer version than 5.2.5  \e[31m⚠ worked on it\e[0m"
        else
            echo -e "xz is not a newer version than 5.2.5  \e[32m🗹\e[0m"
        fi
    done <<< "$version"
done

for file in $(find / -type f -name "sshd" -perm /u+x 2> /dev/zero); do
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
```