# 🌍 Computer Networks — Introduction

## What is the Internet?

The **Internet** is a massive global network of interconnected computers and devices that communicate with each other using agreed-upon protocols (mainly TCP/IP).

Think of it as a **postal system** but for digital data:
- Your computer is a **house**.
- The **IP address** is your postal address.
- **Routers** are the sorting offices that direct your data to the right destination.
- **Data packets** are the letters/packages.

---

## World Wide Web (WWW) Overview

The **Web** is NOT the Internet — it's a service that runs *on top of* the Internet.

| Internet                        | World Wide Web (WWW)              |
|---------------------------------|-----------------------------------|
| The physical network infrastructure | A system of interlinked documents |
| Cables, routers, hardware       | HTML pages, URLs, HTTP            |
| Invented ~1960s (ARPANET)       | Invented by Tim Berners-Lee, 1991 |

### How the Web works:
1. You type `https://google.com` in a browser.
2. The browser looks up the IP address (via DNS).
3. Browser sends an **HTTP request** to Google's server.
4. Server sends back an **HTML page**.
5. Browser renders it visually.

---

## Data Transferring

Data on the internet doesn't travel as one giant blob — it's broken into **packets**.

### How Packet Switching Works:
```
Original Data (e.g., a photo):
[======= 5MB image file =======]

Split into packets:
[Packet 1][Packet 2][Packet 3]...[Packet N]

Each packet travels independently through the network:
Packet 1 → Router A → Router C → Destination
Packet 2 → Router A → Router B → Router C → Destination
Packet 3 → Router B → Router C → Destination

Reassembled at destination:
[======= 5MB image file =======]  ✅
```

This is efficient because:
- Multiple packets share the same wire.
- If one path fails, packets re-route.

---

## IP Addressing & Port Numbers

### IP Address
An **IP (Internet Protocol) address** is a unique identifier for a device on a network.

**IPv4**: 4 numbers, each 0-255, separated by dots.
```
192.168.1.1       (private/local)
93.184.216.34     (public)
```

**IPv6**: Newer, longer format to accommodate more devices.
```
2001:0db8:85a3:0000:0000:8a2e:0370:7334
```

### Port Numbers
An **IP address** gets data to the right **device**.
A **port number** gets data to the right **application** on that device.

```
192.168.1.5 : 80    → Web server (HTTP)
192.168.1.5 : 443   → Web server (HTTPS)
192.168.1.5 : 3000  → Node.js dev server
192.168.1.5 : 5432  → PostgreSQL database
192.168.1.5 : 27017 → MongoDB database
```

Common well-known ports:
| Port | Protocol   |
|------|------------|
| 20   | FTP (data) |
| 22   | SSH        |
| 25   | SMTP (email)|
| 53   | DNS        |
| 80   | HTTP       |
| 443  | HTTPS      |

---

## Internet Service Providers (ISPs)

An **ISP (Internet Service Provider)** is a company that provides individuals and organizations access to the Internet.

Examples: Jio, Airtel, BSNL (India), Comcast, AT&T (USA)

### How ISPs fit in:
```
Your Device
    |
  Home Router (Wi-Fi)
    |
  ISP Network (Jio, Airtel)
    |
  ISP's Backbone (Regional Internet Exchange)
    |
  Global Internet (Tier 1 Networks)
    |
  Destination Server (e.g., google.com)
```

ISPs have different **tiers**:
- **Tier 1**: Massive backbone providers (AT&T, NTT) — they own physical undersea cables.
- **Tier 2**: Regional ISPs (buy bandwidth from Tier 1).
- **Tier 3**: Local ISPs (what you subscribe to at home).

---

## Routers

A **router** is a networking device that **forwards data packets** between networks, finding the best path for data to reach its destination.

### What Routers Do:
1. **Receive** a packet from one network.
2. **Read** the destination IP address.
3. **Decide** the best next hop (via routing table).
4. **Forward** the packet toward its destination.

```
Your Laptop [192.168.1.10]
        |
   Home Router [192.168.1.1 / 103.21.44.1]
        |
   ISP Router
        |
   Internet Backbone Routers
        |
   Google Server [142.250.182.46]
```

### Router vs Switch vs Hub:
| Device   | Works at         | Function                        |
|----------|------------------|---------------------------------|
| Hub      | Physical layer   | Broadcasts to all ports         |
| Switch   | Data link layer  | Sends to specific device in LAN |
| Router   | Network layer    | Routes between different networks|

---

## Summary

| Concept    | What It Is                                           |
|------------|------------------------------------------------------|
| Internet   | Global network of networks using TCP/IP              |
| WWW        | Web pages and services running over the internet     |
| Data Transfer | Packet switching — data split, routed, reassembled|
| IP Address | Unique device identifier on a network                |
| Port Number| Identifies which app/service on a device             |
| ISP        | Company that connects you to the internet            |
| Router     | Device that routes packets across networks           |
