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

```
                    ┌──────────────────────────────┐
   browser ── :80 ──▶  nginx (edge)                │
                    │   /            → client:8080│  static SPA bundle
                    │   /api/        → backend:5000
                    │   /socket.io/  → backend:5000
                    └──────────────────────────────┘

  client   :8080  internal only  — nginx:alpine serving the built Vite bundle
  backend  :5000  internal only  — Node + TypeScript, Socket.IO + MongoDB
  mongo    :27017 published      — MongoDB 7 (host port kept for Compass)
```

Only nginx publishes a port. `client` and `backend` are reachable on the compose
network only, so all traffic goes through the edge.

### Why the socket URL is empty at build time

`client/src/utils/socket.ts` resolves its URL in this order:

1. `VITE_SOCKET_URL` if set
2. otherwise `window.location.origin` in a production build
3. otherwise `http://localhost:5000`

`docker-compose.yml` passes `VITE_SOCKET_URL: ""`, so a production build uses the
page origin. The browser then talks to `/socket.io/` on whatever host it loaded
from, and nginx proxies that to the backend. Setting it to `http://localhost:5000`
instead would bake a host-specific URL into the bundle and bypass nginx entirely.

---

## Running Locally

### Build and start all containers

```bash
docker compose up --build
```

The frontend is compiled inside the image, so there is no host-side build step and
no `client/dist` bind mount. First run takes a few minutes for the npm installs;
afterwards:

- App — <http://localhost>
- MongoDB — `localhost:27017`

### Images

There is no `Dockerfile` in the repo root, so `docker build .` will not work — this
is a multi-service app and each service has its own build. Compose tags the two
locally built images explicitly:

| Image | Built from | Contents |
|---|---|---|
| `ticket-hive-backend` | `backend/` | `node:20-slim`, prod deps + compiled `dist` |
| `ticket-hive-client` | `client/` | `nginx:alpine` serving the built Vite bundle |

`mongo:7` and `nginx:alpine` are pulled from Docker Hub, not built.

### Useful commands

```bash
docker compose up --build -d      # run in the background
docker compose build              # build images without starting anything
docker compose ps                 # container + health status
docker compose logs -f backend    # follow backend logs
docker compose down               # stop, keep the mongo volume
docker compose down -v            # stop and delete the mongo volume
```

### Verifying a production build

The bundle should contain no hardcoded backend URL, and the socket endpoint should
answer through the edge nginx:

```bash
# note the sh -c: docker compose exec does not run a shell, so *.js
# would not be expanded without it
docker compose exec client sh -c 'grep -c "localhost:5000" /usr/share/nginx/html/assets/*.js'
# expect 0

curl -s "localhost/socket.io/?EIO=4&transport=polling"
# expect 0{"sid":"...",...}
```

### Notes

- Requires Docker Compose v2 (`docker compose`, no hyphen). Check with
  `docker compose version`.
- There is intentionally no root `Dockerfile`. Use `docker compose build` or
  `docker compose up --build` rather than `docker build .`.
- The backend exits if it cannot reach MongoDB, so the compose file waits on a
  `mongo` healthcheck before starting it.
- `backend/.env` and `client/.env` are gitignored and are **not** copied into the
  images. Compose injects `PORT` and `MONGO_URI` as environment variables.
- The `/api/` proxy currently has no client-side caller — the app talks to the
  backend over Socket.IO only. It is wired up for future REST endpoints.
- `client` and `backend` publish no host ports, so they are only reachable on the
  compose network. Everything enters through nginx on port 80.
