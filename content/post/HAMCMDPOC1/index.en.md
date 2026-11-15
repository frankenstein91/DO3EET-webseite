+++
title = 'Commands over Ham Radio'
date = 2024-04-09T08:50:20+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Security",
    "Software",
    "Ham Radio",
    "Hobby",
]
+++

A recent discussion got me thinking about a tricky problem. Plenty of amateur radio repeater operators want to remote-control their station—ideally over RF, without touching the internet. Which immediately raises the legitimate question: how do you pull that off securely *without* encryption? Remember, in ham radio, encryption, obfuscation, and secret codes are strictly off-limits. So a standard SSH setup over the air is a no-go. That said, since the commands themselves don't need to be kept secret—they only need to be verified—there are still a few clever options on the table. To the best of my knowledge, authentication and authorization are not prohibited.

For my idea, I want to use OTPs (one-time passwords), just like the second factor you use all over the web. To get started, all we need is an empty directory and these three lines:
```bash
python -m venv venv
. ./venv/bin/activate
pip install pyotp
```
That gives us an isolated Python environment with the required libraries ready to roll.

Here is the workflow I propose:
| Ham Operator                           | Direction | Amateur Radio Repeater                                      |
|----------------------------------------|-----------|-------------------------------------------------------------|
| Sends command with OTP                 | -->       | Stores command in database                                  |
| Compares hash                          | <--       | Sends back command and hash                                 |
| Decides whether to execute             |           |                                                             |
| Sends hash and new OTP                 | -->       |                                                             |
|                                        | <--       | Sends command for the hash (so there's no obfuscation)      |
| Happy camper                           | <--       | Sends command output                                        |
|                                        |           | Marks command as executed                                   |

To avoid collisions when multiple admins are operating at once, you should make sure only the latest command is executable. The handoff should happen right between the two halves of the OTP. My concept needs just two protocol commands: `set` and `run`. That gives us `123 set shutdown -h now 428` and `979 run ae50c4f2a02f198c09e1f9575b7fe2ef9cae2c70 333`. On a valid OTP match (`123428`), the first command stores the instruction in the database and replies with `shutdown -h now ae50c4f2a02f198c09e1f9575b7fe2ef9cae2c70`. That rules out any transmission errors. With the second command, the operator triggers execution and gets at least `shutdown -h now` echoed back.

Generating such an OTP in Python takes no time at all:
```python
import pyotp
key = pyotp.random_base32()
print(pyotp.totp.TOTP(key).provisioning_uri(name='DO3EET', issuer_name='Amateurfunkrelais'))
```
Obviously, the application needs to save that key, and the printed URL `otpauth://totp/Amateurfunkrelais:DO3EET?secret=OX6TY44W2MMGF3PTHM5DOY7YJ2ZRMFZ7&issuer=Amateurfunkrelais` can be fed straight into most standard authenticator apps.

The verification side would look roughly like this, assuming the input arrives in the variable `HamBefehl`:
```python
import pyotp
import hashlib
totp = pyotp.TOTP(key)
HamTOTP = f"{HamBefehl.split(' ')[0]}{HamBefehl.split(' ')[-1]}"
if totp.verify(HamTOTP):
    if HamBefehl.split(" ")[1] == "set":
        befehl = " ".join(HamBefehl.split(" ")[2:-1])
        print(f"{befehl} {hashlib.sha1(befehl.encode()).hexdigest()}")
        # in Datenbank speichern...
```

You can take this idea as far as you like—for instance, using separate keys for `set` and `run` to enforce a two-person rule. You'd also have to decide whether every authorized operator gets their own key or if the station uses a shared key.

There is definitely one catch: both sides need accurate time. With GPS, GLONASS, and GALILEO that's certainly doable, though it does mean extra hardware cost.

On top of that, 2024 brings an [amendment to the German Amateur Radio Ordinance (AFuV)](https://www.recht.bund.de/bgbl/1/2023/160/VO). On page 5 of that document, there's a relevant change to § 16 Section 8. The new wording allows an exemption from the encryption ban for control signals on Earth and space stations, telecommand links, remote operation, and other remotely controlled or automated stations.

## Why no finished code?
For me, this post is really about the concept. I don't own an amateur radio repeater myself and have no plans to run that kind of gear. Whether my idea is even still useful under the updated regulations, I honestly don't know. Plus, I lack the know-how to hook this up to actual repeater hardware. Running it over HamNet, TCP, and Telnet would certainly be conceivable, though.

## Is the idea secure?
I'm no expert on every corner of security. Still, since TOTPs are battle-tested across multi-factor authentication everywhere, they're well-vetted and trustworthy. As long as you're careful with the hash verification, there shouldn't be much of an attack surface. Since OTPs behave somewhat like hash functions, collisions are of course possible and an attacker could get lucky. With enough observed public number sequences, someone could probably also derive or brute-force the TOTP key. Fortunately, just like with regular passwords, there's a dead-simple fix for that: rotate it every now and then.
