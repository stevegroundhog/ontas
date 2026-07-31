# How to share ONTAS (plain English)

## GitHub is the code folder — not the app itself

| Thing | What it is | Can strangers use the app? |
|-------|------------|----------------------------|
| **GitHub** | Public code folder | Only if they install it |
| **One-click Deploy button** | Builds a live website for them | **Yes** — browser link |
| **Docker on their PC** | Runs on their computer | Yes — `localhost:8080` |

Repo: **https://github.com/stevegroundhog/ontas**

---

## Option 1 — One-button free website (best for sharing)

1. Open the repo: https://github.com/stevegroundhog/ontas  
2. Click the **Deploy with Vercel** button in the README  
   (or go here: https://vercel.com/new/clone?repository-url=https://github.com/stevegroundhog/ontas )  
3. Log in with GitHub if asked  
4. Click **Deploy** / **Create**  
5. Wait ~1–2 minutes  
6. Copy the URL (looks like `https://ontas-xxxx.vercel.app`)  

**Post that URL.** Friends open it like any website. No install.

Same idea with **Render**: use the “Deploy to Render” button in the README.

---

## Option 2 — Install on your own computer (Docker)

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and start it  
2. Open a terminal:

```bash
git clone https://github.com/stevegroundhog/ontas.git
cd ontas
docker compose up --build
```

3. Open http://localhost:8080  

Or use the menu installer:

```bash
chmod +x install.sh
./install.sh
```

---

## Option 3 — Node without Docker

Install Node 22 from https://nodejs.org then:

```bash
git clone https://github.com/stevegroundhog/ontas.git
cd ontas
npm install
npm run build:node
npm start
```

Open http://localhost:8080  

---

## What to post (copy/paste)

```
ONTAS — free educational nuclear & conflict awareness map
(public data only · not an official warning system)

Live site:  https://YOUR-APP.vercel.app
Code:       https://github.com/stevegroundhog/ontas
One-click:  https://vercel.com/new/clone?repository-url=https://github.com/stevegroundhog/ontas
```

---

## Common mix-ups

- **“I only shared GitHub and friends are confused”**  
  Share the **Vercel/Render URL**, or tell them to click **Deploy with Vercel**.

- **“The preview inside Grok”**  
  Only you see that. Not a public link.

- **“Is this free?”**  
  Yes for typical hobby use (GitHub + Vercel free tier + Docker on your PC).
