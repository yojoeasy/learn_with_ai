# 🐳 Phase 11: DevOps — Docker, Kubernetes, CI/CD, Nginx

## What is DevOps?

DevOps bridges the gap between **Development** (building software) and **Operations** (deploying and maintaining it).

Goals:
- **Automate** repetitive tasks (deployment, testing, infrastructure)
- **Consistent environments** (code works the same in dev, staging, and prod)
- **Fast, reliable releases** (CI/CD pipelines)
- **Monitoring and observability**

```
Developer writes code → CI/CD pipeline → Build → Test → Deploy → Monitor
                                          ↑
                                    Docker + Kubernetes
```

---

# 🐳 Docker

## What is Docker?
Docker packages your application and ALL its dependencies into a **container** — a lightweight, isolated, portable environment.

```
Your Machine:            Server A:           Server B:
Node v20               Node v18?            Node v21?  ← inconsistency!

WITH DOCKER:
[Container]             [Container]          [Container]
├── Node v20            ├── Node v20         ├── Node v20
├── npm packages        ├── npm packages     ├── npm packages
├── config files        ├── config files     ├── config files
└── Your code           └── Your code        └── Your code
→ Identical everywhere! ✅
```

## Docker Concepts

| Concept              | Meaning                                              |
|----------------------|------------------------------------------------------|
| **Image**            | Snapshot/blueprint (like a class)                    |
| **Container**        | Running instance of an image (like an object)        |
| **Dockerfile**       | Instructions to build a custom image                 |
| **Registry**         | Repository for images (Docker Hub, GitHub Registry)  |
| **Docker Compose**   | Multi-container setup (app + db + redis together)    |
| **Volume**           | Persistent storage (survives container restarts)     |
| **Network**          | Private network between containers                   |

## Dockerfile — Complete Example

```dockerfile
# Use official Node.js image as base
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files FIRST (Docker layer caching optimization!)
# If these don't change, npm install layer is cached
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Build step (if TypeScript or bundling needed)
RUN npm run build

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Document which port the app uses (doesn't actually publish it)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Command to run when container starts
CMD ["node", "dist/server.js"]
```

## .dockerignore
```
node_modules/
dist/
.env
.env.local
*.log
.git/
.DS_Store
```

## Docker Commands
```bash
# Build an image
docker build -t my-app:1.0 .                    # -t = tag name
docker build -t my-app:latest --no-cache .      # skip cache

# Run a container
docker run -p 3000:3000 my-app:latest           # publish port
docker run -p 3000:3000 -d my-app:latest        # -d = detached (background)
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="..." \
  --name api \
  my-app:latest

# Pass environment file
docker run --env-file .env.production -p 3000:3000 my-app

# List running containers
docker ps
docker ps -a              # all (including stopped)

# Container management
docker stop my-container      # graceful stop
docker start my-container     # restart stopped
docker rm my-container        # remove stopped container
docker rm -f my-container     # force remove running

# Docker Logs
docker logs api               # all logs
docker logs -f api            # follow (like tail -f)
docker logs --tail 100 api    # last 100 lines

# Shell into a running container
docker exec -it api sh        # alpine
docker exec -it api bash      # ubuntu/debian

# Image management
docker images                 # list local images
docker rmi my-app:1.0         # remove image
docker pull node:20-alpine    # pull from Docker Hub

# System cleanup
docker system prune           # remove unused containers, images, networks
docker system prune -a        # remove ALL unused (including cached layers)
```

## Docker Compose — Multi-Container Apps

```yaml
# docker-compose.yml
version: "3.9"

services:
  
  # Node.js API
  api:
    build: 
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/mydb
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=supersecretkey123
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - ./src:/app/src         # Mount source for dev hot reload
    restart: unless-stopped
    networks:
      - app-network

  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"            # expose to host for DB tools
    volumes:
      - postgres_data:/var/lib/postgresql/data  # persist data!
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql # initial SQL
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes  # enable persistence
    networks:
      - app-network
  
  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - api
    networks:
      - app-network

volumes:
  postgres_data:  # named volume (persists between restarts)
  redis_data:

networks:
  app-network:    # containers on same network can talk by service name
    driver: bridge
```

```bash
# Start all services
docker compose up -d

# Start and rebuild images
docker compose up -d --build

# Stop all services
docker compose down

# Stop AND remove volumes (WARNING: deletes DB data!)
docker compose down -v

# View logs
docker compose logs -f api

# Scale a service
docker compose up -d --scale api=3  # run 3 API instances
```

---

# ☸️ Kubernetes (K8s)

## What is Kubernetes?
Kubernetes (K8s) is a **container orchestration platform** that automates:
- Deployment (rollout new versions smoothly)
- Scaling (add/remove container instances)
- Self-healing (restart crashed containers)
- Load balancing (distribute traffic)
- Service discovery (containers find each other by name)

## Core Concepts

```
Cluster:              A set of machines (nodes) running K8s
  ├── Control Plane:  The "brain" — manages the cluster
  │   ├── API Server  — entrypoint for all commands (kubectl)
  │   ├── Scheduler   — decides which node runs a Pod
  │   └── etcd        — cluster state database
  └── Worker Nodes:   Machines that run your workloads
      └── Pod:        Smallest deployable unit (1+ containers)
```

## Key Kubernetes Objects

```yaml
# Deployment — manages a set of identical Pods
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3              # run 3 instances
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: my-org/api:1.2.0
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: production
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret    # from a K8s Secret
              key: connection-string
        resources:
          requests:
            memory: "128Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
# Service — exposes Pods within the cluster (or externally)
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  selector:
    app: api              # points to Pods with this label
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP         # internal only (LoadBalancer for external)

---
# Ingress — HTTP routing rules (requires Ingress Controller like Nginx)
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: main-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
```

```bash
# kubectl — command-line tool for K8s
kubectl apply -f deployment.yaml    # apply/deploy
kubectl get pods                    # list pods
kubectl get pods -w                 # watch (live updates)
kubectl get services
kubectl get deployments

kubectl describe pod <pod-name>     # detailed info + events
kubectl logs <pod-name>             # view logs
kubectl logs -f <pod-name>          # follow logs
kubectl exec -it <pod-name> -- sh   # shell into pod

kubectl rollout status deployment/api       # check rollout status
kubectl rollout undo deployment/api         # rollback to previous version
kubectl scale deployment api --replicas=5   # scale to 5 instances

kubectl apply -f .                  # apply all yaml files in current dir
kubectl delete -f deployment.yaml   # delete
```

---

# 🔄 CI/CD — GitHub Actions

## What is CI/CD?
- **Continuous Integration (CI)**: Automatically build and test code on every push
- **Continuous Deployment (CD)**: Automatically deploy to production after tests pass

```
Developer pushes code
    ↓
GitHub Actions triggers
    ↓
Run Tests          (CI)
    ↓
Build Docker Image (CI)
    ↓
Push to Registry   (CI)
    ↓
Deploy to Server   (CD)
    ↓
Health Check       (CD)
```

## Complete GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]        # trigger on push to main
  pull_request:
    branches: [main]        # trigger on PR to main

env:
  NODE_VERSION: "20"
  REGISTRY: ghcr.io         # GitHub Container Registry
  IMAGE_NAME: ${{ github.repository }}  # owner/repo

jobs:
  # ─── JOB 1: Test ─────────────────────────────────────────────
  test:
    name: Test
    runs-on: ubuntu-latest

    services:
      postgres:             # spin up a test database!
        image: postgres:16
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: "npm"           # cache node_modules

    - name: Install dependencies
      run: npm ci

    - name: Run linting
      run: npm run lint

    - name: Run type checking
      run: npm run type-check

    - name: Run tests
      run: npm test -- --coverage
      env:
        DATABASE_URL: postgresql://test:test@localhost:5432/testdb
        JWT_SECRET: test-secret

    - name: Upload coverage
      uses: codecov/codecov-action@v3

  # ─── JOB 2: Build & Push Docker Image ────────────────────────
  build:
    name: Build & Push
    runs-on: ubuntu-latest
    needs: test             # only runs if test passes!
    if: github.ref == 'refs/heads/main'  # only on main branch

    permissions:
      contents: read
      packages: write       # needed to push to GHCR

    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}  # pass to next job

    steps:
    - uses: actions/checkout@v4

    - name: Log in to GitHub Container Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=sha,prefix=sha-    # sha-abc1234
          type=raw,value=latest   # latest

    - name: Build and push
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        cache-from: type=gha     # GitHub Actions cache for faster builds
        cache-to: type=gha,mode=max

  # ─── JOB 3: Deploy ───────────────────────────────────────────
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    environment: production      # manual approval gate

    steps:
    - name: Deploy via SSH
      uses: appleboy/ssh-action@v1
      with:
        host:     ${{ secrets.PROD_HOST }}
        username: ${{ secrets.PROD_USER }}
        key:      ${{ secrets.PROD_SSH_KEY }}
        script: |
          cd /app
          docker pull ghcr.io/${{ env.IMAGE_NAME }}:latest
          docker compose up -d --no-deps api
          docker system prune -f
          echo "Deployment complete!"
```

---

# 🌐 Nginx — Reverse Proxy & Load Balancer

## What is Nginx?
Nginx is a high-performance web server used as:
- **Reverse proxy** (route client requests to backend servers)
- **Load balancer** (distribute requests across multiple servers)
- **Static file server** (serve HTML, CSS, JS, images)
- **SSL terminator** (handle HTTPS, forward plain HTTP internally)

```
Client (HTTPS) → Nginx (SSL termination) → Backend 1 (HTTP)
                                         → Backend 2 (HTTP)
                                         → Backend 3 (HTTP)
```

## Nginx Config — Production Example

```nginx
# /etc/nginx/nginx.conf

worker_processes auto;                 # match number of CPU cores

events {
  worker_connections 1024;
}

http {
  # Basic settings
  sendfile on;
  tcp_nopush on;
  keepalive_timeout 65;
  gzip on;
  gzip_types text/plain text/css application/json application/javascript;

  # Rate limiting zone (define in http block)
  limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

  # Upstream (multiple backend servers for load balancing)
  upstream api_servers {
    least_conn;                        # least connections algorithm
    server api1:3000 weight=1;
    server api2:3000 weight=2;         # gets 2x the traffic
    keepalive 32;                      # persistent connections
  }

  # Redirect HTTP to HTTPS
  server {
    listen 80;
    server_name api.example.com;
    return 301 https://$host$request_uri;
  }

  # Main HTTPS server
  server {
    listen 443 ssl http2;
    server_name api.example.com;

    # SSL Configuration
    ssl_certificate     /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    add_header Content-Security-Policy "default-src 'self'";

    # API proxy with rate limiting
    location /api {
      limit_req zone=api burst=20 nodelay;       # allow bursts

      proxy_pass         http://api_servers;     # forward to upstream
      proxy_http_version 1.1;
      
      # Required for WebSocket support
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      
      # Pass original request info to backend
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;

      # Timeouts
      proxy_connect_timeout 60s;
      proxy_send_timeout    60s;
      proxy_read_timeout    60s;

      # Buffer settings
      proxy_buffering on;
      proxy_buffer_size 128k;
    }

    # Serve static files (React/Next.js build)
    location / {
      root /var/www/html;
      try_files $uri $uri/ /index.html;   # SPA routing!
      
      # Cache static assets
      location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
      }
    }

    # Health check endpoint (no logging, no rate limit)
    location /health {
      proxy_pass http://api_servers;
      access_log off;
    }
  }
}
```
