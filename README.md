# tancred.de

A personal portfolio website with project showcase and URL shortener, featuring
an ASCII-style retro aesthetic. The URL shortener handles redirects for a
configurable domain (set via `SHORTENER_DOMAIN` environment variable).

## Development Setup

1. **Start services:**
   ```bash
   docker compose up -d
   ```

2. **Run migrations:**
   ```bash
   docker compose exec backend deno task migrate
   ```

3. **Create admin user:** Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in
   `docker-compose.yml` or `.env`, then:
   ```bash
   docker compose exec backend deno task init-admin
   ```

4. **Access:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## Production Deployment

1. **Create environment file:**
   ```bash
   cp .env.skel .env
   # Edit .env with your values
   ```

2. **Required variables:**
   - `DATABASE_URL` - MySQL connection string
   - `JWT_SECRET` - Generate with: `openssl rand -base64 32`
   - `ADMIN_USERNAME` - Admin username (optional, auto-created on startup)
   - `ADMIN_PASSWORD` - Admin password (required if ADMIN_USERNAME is set)
   - `CORS_ORIGIN` - Your frontend domain (e.g., `https://example.com`)
   - `SHORTENER_DOMAIN` - Short URL domain (optional, e.g., `exam.pl` - if not
     set, redirects are disabled)
   - `MAIN_SITE_URL` - Main site URL (optional, e.g., `example.com` - redirects
     shortener domain root to this)

3. **Start services:**
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```
   Migrations and admin user creation run automatically on startup.

4. **Verify:**
   ```bash
   docker compose -f docker-compose.prod.yml logs backend | grep -i admin
   ```

## Development Commands

### Connect to frontend container

```bash
docker compose exec frontend bash
```

### Connect to backend container

```bash
docker compose exec backend bash
```

### View logs from all containers

```bash
docker compose logs -f
```

## Tech Stack

Backend: Deno + TypeScript + Oak + Drizzle ORM\
Frontend: Vue 3 + TypeScript + Vite + Pinia\
Database: MySQL 8.0\
Containerization: Docker + Docker Compose
