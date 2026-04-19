# 🔤 Domain Name System (DNS)

## What is DNS?

**DNS (Domain Name System)** is the internet's **phonebook**.

Humans remember names like `google.com`.
Computers communicate using IP addresses like `142.250.182.46`.

DNS translates human-readable domain names → IP addresses.

```
You type:  www.google.com
DNS says:  → 142.250.182.46
Browser:   connects to 142.250.182.46
```

Without DNS, you'd have to memorize IP addresses for every website!

---

## How DNS Resolves Domain Names

When you type a URL, a whole chain of lookups happens:

```
Step 1: Check Browser Cache
        (Did you visit this site recently? Use stored IP.)

Step 2: Check OS Cache / hosts file
        (Check local system cache.)

Step 3: Ask the Recursive Resolver (your ISP's DNS server)
        (Your router is configured to use this.)

Step 4: Recursive Resolver asks Root DNS Server
        "Who knows about .com domains?"

Step 5: Root Server responds with TLD Server address
        "Ask the .com TLD server."

Step 6: Recursive Resolver asks TLD Server
        "Who knows about google.com?"

Step 7: TLD Server responds with Authoritative DNS Server
        "Ask Google's own DNS server."

Step 8: Recursive Resolver asks Authoritative DNS Server
        "What's the IP for www.google.com?"

Step 9: Authoritative Server responds
        "It's 142.250.182.46"

Step 10: Browser connects to 142.250.182.46
```

---

## DNS Record Types

### A Record (Address Record)
Maps a domain name to an **IPv4** address.
```
www.example.com.   A   93.184.216.34
```

### AAAA Record
Maps a domain name to an **IPv6** address.
```
www.example.com.   AAAA   2606:2800:220:1:248:1893:25c8:1946
```

### CNAME Record (Canonical Name)
Creates an **alias** — points one domain to another domain.
```
blog.example.com.   CNAME   example.com.
```
Use case: `www.google.com` → `google.com`

### MX Record (Mail Exchange)
Specifies which server handles **email** for the domain.
```
example.com.   MX   10   mail.example.com.
```
The number `10` is the priority (lower = preferred).

### TXT Record
Stores arbitrary **text** — used for domain verification, SPF, DKIM.
```
example.com.   TXT   "v=spf1 include:_spf.google.com ~all"
```

### NS Record (Name Server)
Tells which servers are **authoritative** for a domain.
```
example.com.   NS   ns1.example.com.
example.com.   NS   ns2.example.com.
```

---

## DNS Hierarchy

DNS is organized in a hierarchical tree structure:

```
                    . (Root)
                    |
         ┌──────────┼────────────┐
        .com       .org         .in
         |          |
      google.com  wikipedia.org
         |
      www.google.com
```

### Levels:
1. **Root DNS Servers** — There are only 13 sets of root servers globally (operated by ICANN, Verisign, etc.). They know where every TLD server is.
2. **TLD (Top Level Domain) Servers** — `.com`, `.org`, `.net`, `.in`, etc. They know the authoritative servers for every domain under them.
3. **Authoritative DNS Servers** — The final authority for a specific domain (e.g., Google's servers for `google.com`).

---

## Recursive DNS Resolver

The **Recursive Resolver** (also called Recursive DNS Server) is the middleman in the DNS lookup process. It's usually operated by your **ISP** or a third-party like Cloudflare (`1.1.1.1`) or Google (`8.8.8.8`).

### Job of the Recursive Resolver:
1. Receives your DNS query.
2. Queries Root → TLD → Authoritative servers **on your behalf**.
3. Caches the result (so it's faster next time).
4. Returns the IP to your browser.

### TTL (Time to Live)
- DNS records have a **TTL** value (in seconds).
- Resolvers cache the result for that duration.
- After TTL expires, they fetch a fresh result.

```
example.com.   A   93.184.216.34   TTL: 3600
(This result is cached for 1 hour = 3600 seconds)
```

---

## How Browser Queries DNS for Loading a Website

Full end-to-end flow when you visit `https://www.github.com`:

```
1. Browser checks own cache → MISS
2. OS checks /etc/hosts file → MISS
3. OS asks Recursive Resolver (8.8.8.8) → 
4. Resolver checks cache → MISS →
5. Resolver asks Root Server → "Ask .com TLD"
6. Resolver asks .com TLD → "Ask ns1.github.com"
7. Resolver asks ns1.github.com → "IP is 140.82.121.4"
8. Resolver returns 140.82.121.4 to browser
9. Browser initiates TCP + TLS connection to 140.82.121.4
10. Browser sends HTTP GET request
11. Server responds with HTML
12. Page renders ✅
```

---

## Summary Table

| Term                  | Meaning                                                   |
|-----------------------|-----------------------------------------------------------|
| DNS                   | System that maps domain names to IP addresses             |
| A Record              | Domain → IPv4 address                                     |
| CNAME Record          | Domain alias → another domain                             |
| MX Record             | Mail server for a domain                                  |
| TXT Record            | Text data for verification, SPF, DKIM                     |
| Root Server           | Knows where all TLD servers are                           |
| TLD Server            | Knows authoritative servers for `.com`, `.org`, etc.      |
| Authoritative Server  | Final answer for a specific domain's DNS records          |
| Recursive Resolver    | Middleman that queries DNS hierarchy on your behalf       |
| TTL                   | How long a DNS record is cached                           |
