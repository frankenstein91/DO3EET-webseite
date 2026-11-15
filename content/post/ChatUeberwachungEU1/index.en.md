+++
title = 'Why Chatting in the EU Could Soon Be Like Encrypting with a NULL Cipher'
date = 2024-06-05T12:37:54+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Privacy",
    "Tracking",
    "Chat",
    "Messenger",
    "Encryption",
]
+++

More and more news outlets are reporting on plans by an EU[^1] working group pushing for tighter surveillance of chat apps. Much of the target is the end-to-end encryption used by modern messaging apps. The group's goal is to force vendors into building an "access-by-design" mechanism—essentially because surveillance authorities don't want to fly blind through strong encryption. In the past, politicians mostly focused on messaging apps with these proposals, but now every digital device (including cars and IoT gadgets like motion sensors) is supposed to ship with a master key deposited with the manufacturer.

Since the working group's published paper even puts a real-time access mechanism on its wish list, this effectively turns what used to be fairly trustworthy communication into a postcard. Every spare key handed over to a third party turns the conversation into a glass house for the people actually talking. You can illustrate that nicely with this Linux command:

```bash
echo "Hallo Leser" | openssl enc -e -null -nosalt -nopad -base64 -pbkdf2 | tee -a Chat.log | openssl enc -d -null -nosalt -nopad -base64 -pbkdf2
```
1. `echo "Hallo Leser"`: Simply outputs the text `"Hallo Leser"`.
2. `openssl enc -e -null -nosalt -nopad -base64 -pbkdf2`: Launches `openssl` with the `enc` subcommand for encryption—while disabling the use of a symmetric key, initialization vector, and padding.
3. `tee -a Chat.log`: This pipe splits the output of `openssl enc` in two directions.
4. `openssl enc -d -null -nosalt -nopad -base64 -pbkdf2`: Decryption on the recipient's side.

Since the holder of the second key is an outside party, I used `-null` in this example. `-null` disables the use of any key at all. That means the encryption is **completely useless**—anyone can decrypt the message.

**This command is strictly meant to illustrate the problem and should never be used for actual encryption. Always use proper, secure encryption!!!**

Whether the interception happens directly on the end devices or, as in older proposals, on the provider's servers, confidential legal communication becomes impossible under these measures. You only have to remember the Microsoft incident in 2023, where the provider lost control of its cloud master key.

```goat
              +---------------+               
+---------+   |               |  +------------+
|         |   | +----------+  |  |            |
|  Sender +---+-+ Provider +--+->+ Recipient  |
|         |   |               |  |            |
+---------+   |               |  +------------+
              +---------------+               
                                    
                    VS.

              +---------------+               
+---------+   |               |  +------------+
|         |   | +----------+  |  |            |
|  Sender +---+-+ Provider +--+->+ Recipient  |
|         |   |            |  |  |            |
+---------+   |            |  |  +------------+
              +------------+--+
                           |          
                           v                  
                  +---------------+           
                  |               |     
                  | State/Police  |           
                  |               |           
                  +---------------+           
                  |  and others   |
                  +---------------+         

```


# Potential Dangers
Back in 2011, the CCC[^2] already warned that state authorities had gone way too far in their surveillance frenzy. Those concerns are more relevant than ever as the technical possibilities for monitoring online communication keep expanding.

If such a key ever falls into the wrong hands, the fallout is impossible to contain. Governments—or whoever else gets hold of it—could intercept sensitive information like political opinions, private conversations, or trade secrets, and use it to blackmail, persecute, or discriminate against people.

[^1]: European Union
[^2]: Chaos Computer Club
