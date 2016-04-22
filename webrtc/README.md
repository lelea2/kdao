### WebRTC (Code school)

* File sharing
* Screen sharing
* Video Conferencing/Telepresense
* Integrated text chat
* Virtual conference
* VOIP calls
* Remote desktop application
* Multiplayers games

========= Future =============

* Facial recognition
* Bitmap effects
* Image capture
* Video recording

Visit: http://iswebrtcreadyyet.com/

##### Architecture

Realworld: webpage (HTML, JS) <==> webpage (HTML, JS)

Needed: webpage (HTML, JS) <==> signaling server (HTTP, websockets -- not part of signaling) <==> webpage(HTML, JS)

##### Security
* Built in, not plugin (updated when browser upgrade)
* Mandatory encryption
* Secure protocols (DTLS, SRTP)

##### Server for webRTC
* Stun
* Turn
* Ice (Interactive connectivity establishment) ==> find ICE candidate

##### Connection

* Server to browser: Socket I/O with nodejs
* Server to Server : SIP with websocket

##### API

* getUserMedia() ==> MediaElement, RTCPeerElement

