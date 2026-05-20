# INSTRUCTIONS.md — Setup & Running Guide

## Prerequisites

- Node.js 18+ (LTS)
- Firebase project with Firestore enabled (free tier works)
- Firebase service account key (for server)
- Firebase Web SDK config (for client admin panel)

---

## 1. Clone and Install

```bash
# Install server dependencies (root)
npm install

# Install client dependencies
cd client && npm install && cd ..
```

---

## 2. Configure Environment Variables

### Server (.env)

Copy the example and fill in your Firebase Admin credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
PORT=2567
NODE_ENV=development
```

> Get these from Firebase Console → Project Settings → Service Accounts → Generate new private key

### Client (client/.env)

```bash
cp client/.env.example client/.env
```

Edit `client/.env`:
```
VITE_GAME_SERVER_URL=ws://localhost:2567
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

> Get these from Firebase Console → Project Settings → General → Your apps → Web app

---

## 3. Run in Development

### Option A: Run both together (recommended)

```bash
npm run dev
```

This starts:
- Colyseus server at `http://localhost:2567`
- Vite client at `http://localhost:3001`

### Option B: Run separately

Terminal 1 (server):
```bash
npm run dev:server
```

Terminal 2 (client):
```bash
npm run dev:client
```

---

## 4. Access the Application

| URL | Description |
|-----|-------------|
| `http://localhost:3001` | Game home page |
| `http://localhost:3001/admin` | Admin dashboard |
| `http://localhost:2567/colyseus` | Colyseus server monitor |

---

## 5. Create Your First Beyblade

1. Go to `http://localhost:3001/admin/beyblades/create`
2. **Step 1 — Basic Info:** Enter name, choose spin direction (right/left), set mass (45g) and radius (4cm)
3. **Step 2 — Type Distribution:** Distribute exactly 360 points across Attack/Defense/Stamina (max 150 each). The sliders auto-calculate derived stats.
4. **Step 3 — Image:** Upload a PNG with transparent background (300×300px recommended)
5. Click **Create Beyblade** — redirects to the edit page where you can fine-tune contact points

---

## 6. Create Your First Arena

1. Go to `http://localhost:3001/admin/arenas/create`
2. Enter arena name, choose **circle** shape and a theme
3. Click **Create Arena** — redirects to the full configurator
4. In the configurator, add obstacles, water bodies, speed paths, etc. using the tab panel
5. Click **Save Arena**

---

## 7. Play the Game

1. Go to `http://localhost:3001/game`
2. Select **Tryout** for solo practice or **PVP Battle** for multiplayer
3. Controls:
   - `A` / `←` — Move left (apply lateral force)
   - `D` / `→` — Move right (apply lateral force)
   - `Space` — Attack (charge forward)
   - `Shift` — Special Move (type-specific physics ability)

---

## 8. Upload Game Assets

1. Go to `http://localhost:3001/admin/assets`
2. Choose the asset category (arena themes, obstacles, turrets, water bodies, portals, sounds)
3. Enter a name, choose a tag (what element this asset applies to), and upload the file
4. Assets are stored in Firebase Storage and referenced at runtime by the PixiJS renderer

---

## 9. Production Build

```bash
# Build client (static files)
cd client && npm run build
# Output: client/dist/

# The server runs as-is with ts-node or compile with:
npx tsc -p tsconfig.json
node dist/index.js
```

### Deployment Options (Free Tier)

| Service | Deploy What | Notes |
|---------|------------|-------|
| **Railway** | Colyseus server | Node.js, $5/month credit |
| **Vercel** | Client (static) | Free, automatic deploys |
| **Firebase** | Firestore + Storage | Free tier: 10GB storage, 50k reads/day |

---

## 10. Colyseus Server Monitor

The Colyseus monitor UI is available at `http://localhost:2567/colyseus` in development.

It shows:
- Active rooms and their state
- Connected clients per room
- Room lifecycle events

---

## Troubleshooting

**"Firebase not initialized"** in server logs:
→ Check that all three `FIREBASE_ADMIN_*` env vars are set correctly.

**Client can't connect to game server:**
→ Verify `VITE_GAME_SERVER_URL=ws://localhost:2567` in `client/.env`.

**Admin panel shows empty data:**
→ Check `VITE_FIREBASE_*` vars are set. Open browser DevTools → Console for Firebase errors.

**Beyblade not found when joining game:**
→ Create at least one beyblade in `/admin/beyblades/create` first.

**Physics seems off / beyblades teleporting:**
→ Confirm arena `width`/`height` match the values the physics engine expects (1080×1080 default). Check Colyseus monitor for room state.
