# 🖥️ Client-Server Architecture

## Earlier System Architectures

Before client-server, computing used:

### Mainframe Architecture
- One powerful central computer (mainframe).
- All users connected via **dumb terminals** (no processing power).
- All logic and data lived on the mainframe.

```
[Terminal 1] ──┐
[Terminal 2] ──┤──── [Mainframe Computer]
[Terminal 3] ──┘
```

**Problems:**
- Single point of failure.
- Expensive to scale.
- Poor distribution.

---

## Need for Client-Server Architecture

As computers got cheaper and networks emerged, a better model was needed:
- Users wanted **independent machines** (PCs).
- But data and services should be **shared**.

Solution: **Client-Server model** — dedicated servers handle data/logic, clients handle display/interaction.

---

## What is the Client-Server Model?

```
CLIENT                              SERVER
┌─────────────────┐                ┌──────────────────────┐
│  Web Browser    │ ─── Request ──>│  Web Server          │
│  Mobile App     │                │  (Node.js, Apache)   │
│  Desktop App    │ <── Response ──│  Processes & responds│
└─────────────────┘                └──────────────────────┘
```

- **Client**: Any application that makes requests (browser, mobile app, Postman).
- **Server**: A program that listens for requests, processes them, and sends responses.
- They communicate over a **network** using protocols (HTTP, WebSocket, etc.).

### Key Characteristics:
| Client             | Server                    |
|--------------------|---------------------------|
| Initiates requests | Waits and responds        |
| Usually one user   | Serves many clients       |
| UI / UX focused    | Business logic & data     |
| Runs on user device| Runs on remote machine    |

---

## HTTP Request-Response Cycle

Every time you load a webpage, an **HTTP Request-Response cycle** happens:

```
Step 1 — Client sends HTTP Request:
GET /products HTTP/1.1
Host: api.example.com
Authorization: Bearer <token>
Accept: application/json

Step 2 — Server processes request:
- Validates the request
- Queries the database
- Prepares response

Step 3 — Server sends HTTP Response:
HTTP/1.1 200 OK
Content-Type: application/json

{
  "products": [
    { "id": 1, "name": "Laptop", "price": 999 },
    { "id": 2, "name": "Phone",  "price": 499 }
  ]
}
```

### HTTP Request Structure:
```
[METHOD] [PATH] [HTTP VERSION]
[Headers]
[blank line]
[Body (optional)]

Example:
POST /api/login HTTP/1.1
Host: example.com
Content-Type: application/json

{"email": "user@gmail.com", "password": "secret"}
```

### HTTP Methods:
| Method  | Purpose                              |
|---------|--------------------------------------|
| GET     | Retrieve data (no body)              |
| POST    | Send data / create a resource        |
| PUT     | Replace an existing resource         |
| PATCH   | Partially update a resource          |
| DELETE  | Remove a resource                    |

### HTTP Status Codes:
| Range | Meaning       | Examples                              |
|-------|---------------|---------------------------------------|
| 1xx   | Informational | 100 Continue                          |
| 2xx   | Success       | 200 OK, 201 Created, 204 No Content   |
| 3xx   | Redirect      | 301 Moved, 302 Found                  |
| 4xx   | Client Error  | 400 Bad Request, 401 Unauthorized, 404 Not Found |
| 5xx   | Server Error  | 500 Internal Server Error, 503 Service Unavailable |

---

## Web Servers and Web Hosting

### What is a Web Server?
A **web server** is software (or hardware) that:
1. Listens for HTTP/HTTPS requests on a port (usually 80 or 443).
2. Processes the request.
3. Returns a response (HTML, JSON, files, etc.).

**Popular Web Servers:**
- **Nginx** — High-performance, used as reverse proxy, load balancer.
- **Apache** — Older, very common, flexible configuration.
- **Node.js (Express)** — JavaScript runtime to build custom servers.

### Types of Hosting:
| Type             | Description                                      | Example       |
|------------------|--------------------------------------------------|---------------|
| Shared Hosting   | Multiple websites on one server                  | Hostinger     |
| VPS              | Virtual private server — dedicated slice         | DigitalOcean  |
| Dedicated Server | Entire physical server for you                   | AWS EC2 bare  |
| Cloud Hosting    | Scalable, distributed infrastructure             | AWS, GCP, Azure|
| Serverless       | No server management — pay per execution         | Vercel, Netlify|

### Static vs Dynamic Hosting:
- **Static Hosting**: Serves HTML/CSS/JS files as-is. (Vercel, Netlify, GitHub Pages)
- **Dynamic Hosting**: Server runs code (Node.js, Python) to generate responses. (VPS, Cloud)

---

## Summary

```
The Full Picture:

  [User's Browser] 
       │
       │ DNS lookup: "What's the IP of example.com?"
       ▼
  [DNS Resolver] → returns 93.184.216.34
       │
       │ TCP Handshake + TLS
       ▼
  [Web Server at 93.184.216.34]
       │
       │ HTTP GET /page
       ▼
  [Application Server] → queries database → builds response
       │
       ▼
  [HTTP Response: 200 OK + HTML/JSON]
       │
       ▼
  [Browser renders the page] ✅
```
