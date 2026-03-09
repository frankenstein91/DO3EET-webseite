+++
title = 'GPG Policy'
draft = false
author = "Frank Tornack"
+++

## My public GPG key

{{< gpg_key src="keys/do3eet.asc" >}}

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

### Reference to the GPG Policy (Notation)
To improve the discoverability of my certification guidelines, I include the link to this page directly in the key as a **notation**. This allows other users and automated tools to validate the conditions of my signature directly from the key.

Implementation with GnuPG:
`gpg> notation`
`Enter the notation: policy@do3eet.pages.dev=https://do3eet.pages.dev/keysigning/`

This matches my own configuration:
`policy@do3eet.pages.dev=https://do3eet.pages.dev/keysigning/`

### Signing Procedure
To permanently document the context of our meeting (e.g., a specific event or meeting place) within the Web of Trust, I sign keys exclusively using the following command:

`gpg --cert-notation "event@do3eet.pages.dev=<Event name or Meeting Place>" --sign-key <FOREIGN_KEY_ID>`

### Cryptographic Minimum Requirements (Based on BSI TR-02102)
To ensure the long-term security and integrity of the Web of Trust (WoT), I exclusively sign keys that meet current cryptographic standards. Weak signatures within the web of trust do not only weaken the individual user but the entire ecosystem. Therefore, I strictly adhere to the recommendations of the Technical Guideline of the German Federal Office for Information Security (BSI TR-02102-1).

#### Accepted Key Parameters and Algorithms
I support the transition to modern, efficient, and secure methods. The following parameters are a prerequisite for signing:

*   **Elliptic Curves (ECC):** This is my preferred method. I accept key lengths of at least 250 bits. This specifically includes:
    *   **EdDSA:** Ed25519 and Ed448 (modern, performant, and resistant to many side-channel attacks).
    *   **NIST Curves:** P-256, P-384, P-521.
    *   **Brainpool Curves:** brainpoolP256r1, brainpoolP384r1, brainpoolP512r1.
*   **RSA (Rivest-Shamir-Adleman):** Due to advancing computing power and new attack vectors, I only accept RSA keys with a length of **at least 3000 bits**. In practice, these are usually:
    *   3072 bits or 4096 bits.
*   **Hash Algorithms (for Certification Signatures):** The hash functions used for the signature must be collision-resistant according to the current state of the art. The following are accepted:
    *   SHA-256, SHA-384, SHA-512 (SHA-2 family).
    *   SHA3-256, SHA3-512 (SHA-3 family).

#### Rejection of Obsolete and Insecure Standards
I will consistently **not** sign keys based on obsolete or mathematically weakened methods. This specifically includes:

*   **Legacy RSA:** RSA keys with lengths under 3000 bits (e.g., 1024 or 2048 bits) are no longer considered secure for long-term use.
*   **DSA (Digital Signature Algorithm):** Since the classic DSA standard was often implemented with key lengths that are too small or with insecure parameters, I reject them.
*   **Insecure Hash Functions:** Any certifications based on **SHA-1, RIPEMD-160, or MD5** will be rejected. SHA-1 has been considered broken for digital signatures since the "SHAttered" attacks at the latest.

My own primary key is based on modern Elliptic Curves (Ed448/Ed25519) and reflects this high security standard. I recommend that every user uses ECC methods directly when creating new keys to achieve an optimal balance between security and performance.

### Email Verification and Return of the Signature
The verification of an official ID only confirms the identity of the physical person, but not the control over the email address specified in the key. 

Therefore, I never upload keys signed by me directly. Instead, I export the created signature, encrypt it with the recipient's public key, and send it to the email address specified in the User ID. 

It is the recipient's responsibility to decrypt the email, import the signature into their own keyring, and then publish the update themselves. This cryptographically ensures that the person actually has access to the email address.
### Disclaimer and Confidentiality (Legal)
*   **No Liability for Third Parties:** By signing a key, I only confirm the identity of the owner at the time of our meeting. I explicitly assume no responsibility for the subsequent behavior of the persons whose keys I have signed, or for the quality and trustworthiness of signatures that these persons themselves may provide.
*   **Secrecy of Correspondence:** I treat all encrypted messages addressed to me with the necessary care and discretion, analogous to the secrecy of correspondence. I will not grant third parties insight into the contents of this communication unless I am legally required to do so. To comply with such requests, the relevant laws from trustworthy sources must be presented to me.

#### Background: Secrecy of Correspondence
The secrecy of correspondence protects the confidentiality of mail and information from unauthorized access. In my policy, I apply this principle to digital communication:
*   **Encryption as a Digital Envelope:** I treat an encrypted message like a sealed letter. Unauthorized reading or sharing the content without explicit consent is an intrusion into privacy that I strictly reject.
*   **Right to Confidential Communication:** I do not see the use of PGP as a sign of distrust, but as the exercise of the right to a protected privacy, which should be inviolable digitally just as it is with physical mail.
