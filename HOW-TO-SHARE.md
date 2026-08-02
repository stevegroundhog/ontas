# How to share ONTAS (plain English)

## GitHub is the code folder — not the app itself

| Thing | What it is | Can strangers use the app? |
|-------|------------|----------------------------|
| **GitHub** | Public code folder | Only if they install it |
| **One-click Deploy (Vercel / Render)** | Builds a live website | **Yes** — browser link |
| **Docker on their PC** | Runs on their computer | Yes — `localhost:8080` |
| **Codespaces** | Cloud editor + terminal | Yes — port 8080 preview |

Repo: **https://github.com/stevegroundhog/ontas**

---

## Option 1 — One-button free website (best for sharing)

### Vercel (recommended)

1. Open: https://github.com/stevegroundhog/ontas  
2. Click **Deploy with Vercel** in the README  
   (or: https://vercel.com/new/clone?repository-url=https://github.com/stevegroundhog/ontas )  
3. Log in with GitHub if asked  
4. Click **Deploy** / **Create**  
5. Wait ~1–2 minutes  
6. Copy the URL (e.g. `https://ontas-xxxx.vercel.app`)  

**No secrets required** for the basic educational app.

### Render (alternative)

1. Click **Deploy to Render** in the README  
2. Connect GitHub → create web service  
3. Free tier may **sleep** when idle (first load can be slow)

**Post the live URL.** Friends open it like any website. No install.

---

## Option 2 — Install on your own computer (Docker)

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and start it  
2. Terminal:

```bash
git clone https://github.com/stevegroundhog/ontas.git
cd ontas
docker compose up --build
```

3. Open http://localhost:8080  

Menu installer:

```bash
chmod +x install.sh
./install.sh docker
```

---

## Option 3 — Node without Docker

Install Node **22+** from https://nodejs.org then:

```bash
git clone https://github.com/stevegroundhog/ontas.git
cd ontas
npm ci
npm run build:node
npm start
```

Open http://localhost:8080  

Or: `./install.sh node`

---

## Option 4 — GitHub Codespaces

1. Open https://codespaces.new/stevegroundhog/ontas  
2. In the terminal: `npm ci && npm run dev`  
3. **Ports** → open **8080**

---

## What to post (copy/paste)

```
ONTAS — free educational nuclear & conflict awareness map
(public data only · not an official warning system)

Live site:  https://YOUR-APP.vercel.app
Code:       https://github.com/stevegroundhog/ontas
One-click:  https://vercel.com/new/clone?repository-url=https://github.com/stevegroundhog/ontas
Essay:      https://YOUR-APP.vercel.app/article
```

Deep links people can bookmark after deploy:

```
https://YOUR-APP.vercel.app/?desk=map
https://YOUR-APP.vercel.app/?desk=method
https://YOUR-APP.vercel.app/?desk=alerts
https://YOUR-APP.vercel.app/?desk=compare&compare=us,ru
```

---

## Common mix-ups

- **“I only shared GitHub and friends are confused”**  
  Share the **Vercel/Render URL**, or tell them to click **Deploy with Vercel**.

- **“The preview inside Grok”**  
  Only you see that. Not a public link.

- **“Is this free?”**  
  Yes for typical hobby use (GitHub + Vercel free tier + Docker on your PC).

- **“Render is slow the first time”**  
  Free instances sleep; wait 30–60s on first hit, or use Vercel for snappier demos.
