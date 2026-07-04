# Deeray

Minimalist home essentials storefront — Next.js 15 + PostgreSQL.

## Stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind v4 (CSS-first config in `globals.css`)
- **Database**: PostgreSQL via Prisma 6
- **Auth**: Admin-only sessions via `iron-session`
- **Cart**: Guest cart in encrypted cookies
- **Email**: Nodemailer (SMTP)

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up .env (copy from .env.example)
cp .env.example .env
# Edit .env with your DATABASE_URL and SESSION_SECRET

# 3. Push schema + seed
npm run db:push
npm run db:seed

# 4. Start dev server
npm run dev
```

Admin login: `admin@deeray.com` / `admin123`

## Commands

| Action | Command |
|---|---|
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Type check | `npx tsc --noEmit` |
| Prisma Studio | `npm run db:studio` |
| Create migration | `npm run db:migrate:dev` |
| Seed DB | `npm run db:seed` |

## Deploy to Oracle Cloud (or any VPS)

### 1. Prerequisites

- Ubuntu 24.04 VPS with Docker installed
- Domain pointing to your server IP
- SSH access

### 2. Install Dependencies

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2 \
  nginx certbot python3-certbot-nginx git
sudo usermod -aG docker ubuntu
exit  # reconnect
```

### 3. Clone & Setup

```bash
sudo mkdir -p /opt/deeray
sudo chown -R ubuntu:ubuntu /opt/deeray
cd /opt/deeray
git clone <your-repo-url> .
```

### 4. Environment

```bash
cp .env.production.example .env.production
nano .env.production
```

Variables:
- `DB_PASSWORD` — PostgreSQL password
- `SESSION_SECRET` — run `openssl rand -hex 32`
- `SITE_URL` — `https://yourdomain.com`
- `SMTP_*` — email credentials (optional)

### 5. Start Services

```bash
docker compose --env-file .env.production up -d db
sleep 15
docker compose --env-file .env.production run --rm migrate
docker compose --env-file .env.production up -d app
docker compose exec app npx prisma db seed
```

### 6. Nginx + SSL

```bash
DOMAIN="yourdomain.com"
sudo cp /opt/deeray/deploy/nginx.conf /etc/nginx/sites-available/deeray
sudo sed -i "s/yourdomain.com/$DOMAIN/g" /etc/nginx/sites-available/deeray
sudo sed -i "s/www.yourdomain.com/www.$DOMAIN/g" /etc/nginx/sites-available/deeray
sudo ln -sf /etc/nginx/sites-available/deeray /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" \
  --non-interactive --agree-tos -m "admin@$DOMAIN"
```

### 7. Update

```bash
cd /opt/deeray && git pull
docker compose --env-file .env.production build app
docker compose --env-file .env.production run --rm migrate
docker compose --env-file .env.production up -d app
```

## Project Layout

| Path | Purpose |
|---|---|
| `src/app/(store)/` | Storefront (products, cart, checkout, etc.) |
| `src/app/admin/` | Admin panel |
| `src/components/` | Shared React components |
| `src/lib/` | Utilities, Prisma singleton, auth, cart |
| `deploy/` | Nginx config, setup scripts |
| `prisma/` | Schema + seed |
