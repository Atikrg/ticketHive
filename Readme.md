# Video


https://github.com/user-attachments/assets/e42fc388-39fc-4248-bce4-8f3934c1a44d




# Dockerized Full-Stack Application (Nginx + TypeScript + Zod)

This is a full-stack application containerized using **Docker** and **Docker Compose**.

✅ **Frontend runs on port 80**  
✅ **Backend runs on port 5000**  
✅ **Nginx serves frontend and proxies backend APIs**  
✅ **TypeScript used across the stack**  
✅ **Zod used for schema validation**

---

## Tech Stack

### Frontend
- TypeScript
- SPA framework (React / Vite / etc.)
- Served via **Nginx on port 80**

### Backend
- Node.js + TypeScript
- **Zod** for request & response validation
- Runs on **port 5000**

### Infrastructure
- Nginx (reverse proxy + static file serving)
- Docker
- Docker Compose

---

## Architecture

---

## Running Locally

### Build and start containers
```bash
docker-compose up --build
