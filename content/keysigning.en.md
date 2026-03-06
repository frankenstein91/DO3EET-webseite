+++
title = 'GPG Policy'
draft = false
author = "Frank Tornack"
+++

## Identity Verification and Physical Presence
To ensure the integrity of the Web of Trust, I sign PGP keys exclusively after a personal, face-to-face meeting. Identity verification via video call, telephone, or email is not conducted.

### Official Identification Documents
Verification is performed by presenting a valid, original, government-issued photo ID. I accept the following:
*   Passport
*   National ID card

Non-official documents or IDs without sufficient government security features will **not** be accepted. This includes, but is not limited to:
*   Health insurance cards
*   Supplementary IDs (e.g., dgti)
*   Student IDs
*   Driver's licenses (as they are not primarily intended as a legal proof of identity in many jurisdictions, including Germany)

I reserve the right to refuse signing if there are any doubts regarding the identity or the authenticity of the document presented.

### Special Provisions for Radio Amateurs
If the key to be signed shows a connection to amateur radio (for example, by including a callsign in the User ID or email address), I perform an additional validation step. In such cases, I either cross-reference the provided callsign with the official databases of the relevant national authority (in Germany, the Federal Network Agency/BNetzA) or, alternatively, accept the presentation of the physical license (Zuteilungsurkunde) in conjunction with an official photo ID. The key will only be signed if the name on the official photo ID matches the name of the callsign holder in the license database or on the physical license beyond any doubt. This process ensures that the radio identity claimed in the key can be reliably attributed to the physical person.

### Recommended Identification for Radio Amateurs (Notations)
Since the encryption of content is not permitted in the amateur radio service (according to international regulations and the German AfuV), I prefer a clear separation and identification of the radio identity within the PGP key.

I therefore recommend not only optionally including the callsign in the name part of the User ID but also explicitly storing it as a **notation**. This allows for a structured and machine-readable assignment, focusing on digital signatures and authentication (as encryption over the air is prohibited).

Example implementation with GnuPG (in `gpg --edit-key` mode):
`gpg> notation`
`Enter the notation: callsign@do3eet.pages.dev=YOUR_CALLSIGN`

This adds a proof to the key that matches my own configuration:
`callsign@do3eet.pages.dev=DO3EET`

### Signing Procedure
To permanently document the context of our meeting (e.g., a specific event or meeting place) within the Web of Trust, I sign keys exclusively using the following command:

`gpg --cert-notation "event@do3eet.pages.dev=<Event name or Meeting Place>" --sign-key <FOREIGN_KEY_ID>`

### Email Verification and Return of the Signature
The verification of an official ID only confirms the identity of the physical person, but not the control over the email address specified in the key.

Therefore, I never upload keys signed by me directly to a public keyserver. Instead, I export the created signature, encrypt it with the recipient's public key, and send it to the email address specified in the User ID.

It is the recipient's responsibility to decrypt the email, import the signature into their own keyring, and then publish the update on the keyservers themselves. This cryptographically ensures that the person actually has access to the email address.

### Disclaimer and Confidentiality (Legal)
*   **No Liability for Third Parties:** By signing a key, I only confirm the identity of the owner at the time of our meeting. I explicitly assume no responsibility for the subsequent behavior of the persons whose keys I have signed, or for the quality and trustworthiness of signatures that these persons themselves may provide.
*   **Secrecy of Correspondence:** I treat all encrypted messages addressed to me with the necessary care and discretion, analogous to the secrecy of correspondence. I will not grant third parties insight into the contents of this communication unless I am legally required to do so. To comply with such requests, the relevant laws from trustworthy sources must be presented to me.

#### Background: Secrecy of Correspondence
The secrecy of correspondence protects the confidentiality of mail and information from unauthorized access. In my policy, I apply this principle to digital communication:
*   **Encryption as a Digital Envelope:** I treat an encrypted message like a sealed letter. Unauthorized reading or sharing the content without explicit consent is an intrusion into privacy that I strictly reject.
*   **Right to Confidential Communication:** I do not see the use of PGP as a sign of distrust, but as the exercise of the right to a protected privacy, which should be inviolable digitally just as it is with physical mail.
