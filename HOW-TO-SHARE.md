# How to share ONTAS (plain English)

GitHub is **not** the website.  
GitHub is a **folder in the cloud** that holds the code.

| Thing | What it is | Can strangers use the app? |
|-------|------------|----------------------------|
| **GitHub** | Storage for code | Only if they know how to install & run it |
| **Live website** (Vercel, etc.) | A real clickable app on the internet | **Yes** — just open the link |

---

## Link you can share today (code only)

Your code is public here:

**https://github.com/stevegroundhog/ontas**

People who open that page see source code, not a full working app in their browser  
(unless they know `npm install` — most people don’t).

---

## Link you want for “anyone can use it”

You need a **hosted demo**. Easiest free option: **Vercel**.

### Do this once (about 5 minutes)

1. Open **https://vercel.com** and sign in (use **Continue with GitHub**).
2. Click **Add New…** → **Project**.
3. Find **`ontas`** (or `stevegroundhog/ontas`) → **Import**.
4. Leave settings as default → click **Deploy**.
5. Wait until it finishes (green “Success”).
6. Click the big link Vercel shows (looks like `https://ontas-….vercel.app`).

**That** is the link you post everywhere.

Optional: on the GitHub repo page → ⚙️ **Settings** is not needed.  
On Vercel project → **Settings** → **Domains** shows your permanent URL.

---

## What to post (copy/paste)

```
ONTAS — free educational nuclear & conflict awareness map
(public data only, not an official warning system)

Try it:  https://YOUR-LINK.vercel.app
Code:    https://github.com/stevegroundhog/ontas
```

Replace `YOUR-LINK` with the address Vercel gave you.

---

## Common mix-ups

- **“I posted GitHub but friends say it doesn’t work”**  
  They’re looking at code. Send the **Vercel** link instead.

- **“The preview inside Grok”**  
  Only you see that while building. Strangers cannot open it.

- **“Do I need to pay?”**  
  GitHub public repos and Vercel hobby deploys are free for this kind of project.

---

## After you have a Vercel link

Reply here with it (or paste it into chat) and we can put it at the top of the README so the repo says **“Open the live app”** in big letters.
