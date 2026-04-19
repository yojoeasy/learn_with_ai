# 🌐 Internet Protocols

## What are Internet Protocols, and Why are They Needed?

A **protocol** is a set of rules that define how data is sent, received, and interpreted between two systems.

Without protocols:
- Computers would have no standard way to communicate.
- Data would be garbled, lost, or misunderstood.

Protocols ensure **reliability, structure, and compatibility** across different systems.

---

## TCP/IP — The Foundation of the Internet

**TCP/IP** is a suite of two core protocols:

### IP (Internet Protocol)
- Assigns a unique **IP address** to every device.
- Responsible for **routing** packets from source to destination.
- Does NOT guarantee delivery — it's a "best-effort" protocol.

```
Device A [192.168.1.1] --> Router --> Device B [93.184.216.34]
```

### TCP (Transmission Control Protocol)
- Sits on top of IP.
- Breaks data into **packets**, sends them, and **reassembles** them at destination.
- Guarantees **reliable, ordered delivery**.
- Uses **acknowledgements (ACK)** to confirm data received.

---

## SYN, SYN-ACK, and ACK — The TCP Three-Way Handshake

Before any data is transferred, TCP establishes a connection via a **3-way handshake**:

```
Client                        Server
  |                              |
  |-------- SYN ---------------->|   "I want to connect"
  |                              |
  |<------- SYN-ACK -------------|   "OK, I'm ready. You ready?"
  |                              |
  |-------- ACK ---------------->|   "Yes! Let's go."
  |                              |
  |===== Data Transfer ==========|
```

- **SYN** = Synchronize (initiate connection)
- **SYN-ACK** = Synchronize-Acknowledge (server agrees)
- **ACK** = Acknowledge (connection confirmed)

---

## Data Segmentation, Error Checking & Retransmission

### Segmentation
- Large chunks of data are split into **smaller segments** (packets).
- Each packet has a **sequence number** so they can be reassembled in order.

```
File: 10MB
-> Packet 1 [seq: 1] [data: bytes 0-1460]
-> Packet 2 [seq: 2] [data: bytes 1461-2920]
...
```

### Error Checking
- TCP uses a **checksum** field in each packet.
- The receiver computes the checksum and compares — if wrong, the packet is discarded.

### Retransmission
- If the sender doesn't receive an ACK within a timeout, it **retransmits** the packet.
- This ensures no data is permanently lost.

---

## UDP — Datagram-Based Transmission

**UDP (User Datagram Protocol)** is a lightweight alternative to TCP.

| Feature        | TCP              | UDP              |
|----------------|------------------|------------------|
| Reliability    | ✅ Guaranteed     | ❌ No guarantee   |
| Order          | ✅ In order       | ❌ No order       |
| Speed          | Slower           | ✅ Much faster    |
| Connection     | Connection-based | Connectionless   |
| Use Case       | Files, APIs, Web | Video, Games, DNS|

### Why use UDP?
When **speed > reliability**. A dropped frame in a video call is better than a 2-second freeze.

```
UDP Use Cases:
- Live Video Streaming (YouTube Live, Zoom)
- Online Gaming (real-time position updates)
- DNS Lookups
- VoIP (Voice over IP)
```

---

## Reliability vs Speed

- **TCP** = Reliable but slower (handshakes, retransmission, ordering)
- **UDP** = Fast but unreliable (fire-and-forget)

> Real-world apps often mix both:
> - Use **TCP** for critical data (login, payment)
> - Use **UDP** for real-time feeds (video, gaming)

---

## HTTP & HTTPS

### HTTP (HyperText Transfer Protocol)
- An application-layer protocol built on **TCP**.
- Defines how a browser **requests** a resource and how a server **responds**.

```
GET /index.html HTTP/1.1
Host: www.example.com
```

```
HTTP/1.1 200 OK
Content-Type: text/html

<html>...</html>
```

### HTTPS (HTTP Secure)
- Same as HTTP but the data is **encrypted** using TLS.
- Without HTTPS: anyone on the network can read your data (passwords, bank info).
- With HTTPS: data is encrypted end-to-end.

> All modern websites MUST use HTTPS. Browsers mark HTTP sites as "Not Secure".

---

## TLS / SSL

**TLS (Transport Layer Security)** is the encryption protocol behind HTTPS.
SSL is the old name (now deprecated) — people say "SSL" but mean TLS.

### How TLS works (simplified):
1. **Handshake**: Client and Server agree on encryption algorithms.
2. **Certificate**: Server proves its identity with a **digital certificate** (issued by a Certificate Authority like DigiCert, Let's Encrypt).
3. **Key Exchange**: A shared secret key is generated.
4. **Encrypted Communication**: All further data is encrypted with that key.

```
Browser                       Server
  |--- "Hello, what ciphers?" -->|
  |<-- "Here's my certificate" --|
  |--- "I trust you, here's key" >|
  |<======= Encrypted Data =====>|
```

---

## WebSocket

- **HTTP** is a **request-response** model — the client always initiates.
- **WebSocket** is a **full-duplex, persistent** connection — both client and server can send data at any time.

### HTTP vs WebSocket:
```
HTTP:
  Client → Request → Server
  Server → Response → Client
  (Connection closes)

WebSocket:
  Client → Upgrade Request → Server
  (Connection stays OPEN)
  Server → Push data → Client  (anytime!)
  Client → Send data → Server  (anytime!)
```

### Use Cases for WebSocket:
- Live chat applications
- Real-time dashboards
- Online multiplayer games
- Collaborative editors (like Google Docs)

---

## WebRTC

**WebRTC (Web Real-Time Communication)** allows browsers to communicate **directly with each other** (peer-to-peer) without going through a server for the media stream.

- Used for: **Video calls, voice calls, file sharing** between browsers.
- Technologies behind it: ICE, STUN, TURN servers for NAT traversal.

```
Browser A  <==== Peer-to-Peer Media Stream ====>  Browser B
             (Server only used for signaling)
```

> Zoom, Google Meet, and Discord use WebRTC technology under the hood.

---

## Summary Table

| Protocol  | Layer       | Purpose                          |
|-----------|-------------|----------------------------------|
| IP        | Network     | Addressing & routing packets     |
| TCP       | Transport   | Reliable ordered data delivery   |
| UDP       | Transport   | Fast, unreliable delivery        |
| HTTP      | Application | Web requests & responses         |
| HTTPS     | Application | HTTP + TLS encryption            |
| TLS/SSL   | Security    | Encrypts data in transit         |
| WebSocket | Application | Persistent 2-way communication   |
| WebRTC    | Application | Peer-to-peer real-time comms     |
