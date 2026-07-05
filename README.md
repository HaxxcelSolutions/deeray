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

## Deploy to VPS (Oracle / any)

### How it works

| Step | Where | What |
|------|-------|------|
| 1. Code push | Your PC | `git push` to GitHub |
| 2. Auto-build | GitHub Actions | Builds Docker image on free Linux runner |
| 3. Auto-push | GitHub Actions | Pushes image to `ghcr.io` |
| 4. Deploy | Server | `make deploy` — pulls image + migrates + restarts |

Server par kabhi build nahi hota — sirz image pull hoti hai. 1GB RAM bhi kaafi hai.

### First-time server setup

```bash
# 1. Clone
sudo mkdir -p /var/www/deeray && sudo chown -R ubuntu:ubuntu /var/www/deeray
cd /var/www/deeray
git clone <your-repo-url> .

# 2. System setup (once)
make setup

# 3. Environment
make env
nano .env.production   # edit DB_PASSWORD, SESSION_SECRET, SITE_URL, SMTP_*

# 4. Start DB
make db

# 5. Login to GitHub Container Registry (one-time)
echo $GITHUB_TOKEN | docker login ghcr.io -u <your-github-username> --password-stdin

# 6. Pull app image
make pull

# 7. Migrate + seed
make migrate
make seed

# 8. Start app
make start

# 9. Nginx + SSL
make nginx DOMAIN=yourdomain.com
make ssl DOMAIN=yourdomain.com
```

### Daily update workflow

```bash
# Local PC: code change karo, push karo
git add .
git commit -m "fix: something"
git push

# Actions tab mein build chal raha hoga (2-3 min)

# Server: deploy karo
ssh ubuntu@<ip>
cd /var/www/deeray
make deploy
```

### Available commands

| Command | What it does |
|---|---|
| `make setup` | Install Docker, Nginx, certbot, PM2 |
| `make env` | Create `.env.production` from example |
| `make db` | Start PostgreSQL |
| `make pull` | Pull latest app image from GitHub |
| `make migrate` | Run Prisma migrations (direct, no Docker) |
| `make seed` | Seed admin user |
| `make start` | Start app |
| `make restart` | Restart app |
| `make deploy` | Git pull + image pull + migrate + restart |
| `make nginx DOMAIN=x` | Configure Nginx for your domain |
| `make ssl DOMAIN=x` | Get SSL cert from Let's Encrypt |
| `make logs` | View app logs |

Admin login: `admin@deeray.com` / `admin123`

## Project Layout

| Path | Purpose |
|---|---|
| `src/app/(store)/` | Storefront (products, cart, checkout, etc.) |
| `src/app/admin/` | Admin panel |
| `src/components/` | Shared React components |
| `src/lib/` | Utilities, Prisma singleton, auth, cart |
| `deploy/` | Nginx config, setup scripts |
| `prisma/` | Schema + seed |
| `Makefile` | All-in-one deploy commands |
