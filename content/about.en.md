+++
title = 'About'
draft = false
aliases = ["about-me", "contact", "impressum"]
author = "Frank Tornack"
menu = 'main'
+++

Responsible for the content of this private website, with the exception of comments:

    Frank Tornack
    Badstraße 7
    04668 Grimma

You can best reach me via my email address on the right sidebar.

# Framework
Hugo is a static website framework based on Golang. A static website is a website whose pages consist of a fixed number of pre-made files, consisting of HTML, CSS, and JavaScript. A static website has no server-side processing in the backend and no database.

# Source Code
The source code of this private website is available on Github and can be viewed there. The website is implemented using Hugo, an open-source static site generator. Hugo converts the source code stored on Github into static HTML, CSS, and JavaScript files that are optimized for display in a web browser. This process enables efficient and fast delivery of content while ensuring a clear separation of content and presentation. With regard to the HTML source code, we would like to point out that the person responsible for the content has no direct influence on the generated HTML source code, as it is automatically created by the Hugo generator. The focus of the content manager is primarily on the creation and maintenance of the website's content components. If you have any questions or comments regarding the HTML source code, we recommend contacting the developer or maintainer of the Hugo theme directly.

# HTTP headers
In summary, these headers work together to create a more secure Browse experience by preventing clickjacking attacks, controlling device access rights, protecting against XSS attacks, and restricting where the website can load resources from.

## X-Frame-Options: DENY
This header tells the browser that this website should not be loaded within a frame on another website. This helps prevent clickjacking attacks, where a malicious website tricks you into clicking on something by embedding the legitimate website in its frame. Should you nevertheless see my website in a frame, I would appreciate a message. Excluded from this request for notification is [Archive.org](https://web.archive.org/).

## Permissions-Policy: camera=(), microphone=(), geolocation=()
This header specifies the browser's permission policy for accessing certain functions on your device. In this case, access to the camera, microphone, and geolocation is denied for this website. This ensures that I have no access to this information.

## Referrer-Policy: strict-origin-when-cross-origin
This header controls how the website you visit can access the referrer information. The referrer information tells the website where you came from (the previously visited website). This setting ensures that the referrer information is only sent back to the server if you visit the website from the same origin. This helps protect users' privacy by limiting the amount of information that websites can track about your Browse history. The origin, i.e., the domain, remains visible.

## X-XSS-Protection: 1; mode=block
This header relates to Cross-Site Scripting (XSS) attacks, where malicious scripts are injected into a website. This setting instructs the browser to enable XSS protection in "block" mode. This means that the browser will try to detect and block potential XSS attacks.

## Content-Security-Policy
This is the most complex header and defines a Content Security Policy (CSP). A CSP restricts where the browser can load resources (such as fonts, stylesheets, scripts) from.

## X-Content-Type-Options: nosniff
The HTTP header `X-Content-Type-Options: nosniff` is a security measure that web servers can employ to instruct browsers not to "guess" or change the declared Content-Type of a resource.

## Cross-Origin-Opener-Policy: same-origin
The HTTP header `Cross-Origin-Opener-Policy: same-origin` is a security measure that gives website operators more control over how their website interacts with other websites that it may have opened or that may have opened it. Essentially, this header helps to isolate a website from potentially malicious external websites.

## Cross-Origin-Resource-Policy: same-origin
The HTTP header `Cross-Origin-Resource-Policy: same-origin` is a security policy that web servers can use to control which origins (websites) are allowed to embed or load their resources. When this header is set to `same-origin`, it means that the resource can only be loaded by websites that have the exact same origin (same scheme, same hostname, and same port).

# Comment Function
The comment function on this private website is provided via Github. The operator of the Github platform is responsible for the processing of personal data within the scope of the comment function. Please note Github's privacy policy at:
- [Datenschutzrichtlinien Deutsch](https://docs.github.com/de/site-policy/privacy-policies)
- [Data protection policy English](https://docs.github.com/en/site-policy/privacy-policies)

# Chat Function
The chat function of this website is based on Matrix chat technology and is provided by the Cactus.Chat software. Matrix is an open standard for decentralized, secure, and interoperable real-time communication over the internet. Cactus.Chat uses this advanced Matrix infrastructure to create a secure and user-friendly chat environment. Matrix enables end-to-end encryption, which means that communication between users is confidential and protected. In addition, the Matrix platform offers the possibility to interact via various chat clients, which enables flexible and versatile use. We attach great importance to data protection and security and recommend that users familiarize themselves with the data protection guidelines of Matrix and Cactus.Chat in order to gain a comprehensive understanding of how their data is protected.

Matrix is a decentralized communication protocol in which users can choose their own servers (homeservers). Each homeserver operator can define their own privacy policies and security measures. Since there is no central authority that dictates the privacy policy for all homeservers, it is difficult to offer uniform privacy information. Every user who connects to your Matrix server is subject to the privacy policy of the specific homeserver they choose. It is recommended that users who wish to learn about the privacy policy of their Matrix homeserver contact the operator of the respective homeserver directly or search for the relevant information on the homeserver's website.

# YouTube Embedding
The embedded YouTube videos used on this website are subject to the copyright of YouTube and the respective rights holders. The embedding takes place within the permitted framework of the YouTube terms of use.

On our website, I use embedded YouTube videos to provide you with multimedia content. When you visit a page with an embedded YouTube video, a connection to YouTube's servers is established. YouTube is thereby informed which pages you visit.

Please note that YouTube has its own privacy policy over which I have no influence. When you play a YouTube video, YouTube may store cookies on your end device. However, I have no influence on the type and scope of the data collected by YouTube.

To protect your privacy, I have configured the embedding of YouTube videos to use YouTube's enhanced privacy mode. Please note that YouTube's enhanced privacy mode may not be activated until you play the video. However, data transfer to YouTube can also take place without active video playback.

# PeerTube Embedding
Videos from the PeerTube platform are embedded on this website. PeerTube is a decentralized video platform based on the peer-to-peer principle. This means that the videos are not stored on a central server, but on a network of computers operated by the users of the platform. This function is deactivated to the best of my knowledge and belief. However, the PeerTube server operator will still see your IP and browser data.

## Data processing by PeerTube
 - Your IP address
 - Your browser type and browser settings
 - The operating system of your device
 - The referrer URL (the URL of the website from which you accessed the video)
 - Date and time of video retrieval
 - The duration of video playback
 - Whether you watched the video in its entirety

# Hosting
Cloudflare serves as a Content Delivery Network (CDN), hosting, and provides security and performance improvements for the delivery of this website. Note that Cloudflare's hosting infrastructure is used to optimize the availability and speed of the website. Cloudflare may collect anonymized statistical data about access to this website. For more information on Cloudflare's privacy practices, please refer to their privacy policy:
- [Cloudflare Privacy Policy](https://www.cloudflare.com/privacypolicy/)

# Data Protection in Connection with Cloudflare SSL Certificates
The use of Cloudflare SSL certificates serves to protect the data transmitted between the user and this website. SSL (Secure Sockets Layer) ensures encrypted communication, which guarantees the confidentiality and integrity of the transmitted information. Cloudflare generally undertakes to respect the privacy of users and to comply with applicable data protection regulations. However, when using Cloudflare SSL certificates, certain anonymized information about data traffic may be collected in order to improve the performance, security, and analysis of the website. It is advisable to consult Cloudflare's privacy policy to obtain detailed information about what data is collected, how it is processed, and what protective measures are in place.
- [Cloudflare Privacy Policy](https://www.cloudflare.com/privacypolicy/)

# Disclaimer
The contents of this private website were created with the greatest possible care. However, no guarantee can be given for the correctness, completeness, and topicality of the content. As the operator, I am not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity. Obligations to remove or block the use of information in accordance with general laws remain unaffected by this. However, liability in this regard is only possible from the time of knowledge of a concrete infringement. If I become aware of any such infringements, I will remove the relevant content immediately.