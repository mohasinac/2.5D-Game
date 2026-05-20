# Quick Start Guide - Game Server Package

## Overview

The game-server package now contains:

1. **Colyseus Game Server** - Real-time multiplayer game logic (port 2567)
2. **Next.js Admin Panel** - Game management interface (port 3001)

## Installation

```bash
cd game-server
npm install
```

## Environment Setup

Create a `.env` file (copy from `.env.example`):

```env
# Colyseus Server
PORT=2567
NODE_ENV=development

# Next.js Admin
NEXT_PORT=3001
COLYSEUS_SERVER_URL=http://localhost:2567

# Firebase (if needed)
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
```

## Running in Development

### Option 1: Run Both Services Together (Recommended)

```bash
npm run dev
```

This starts:

- Colyseus server on http://localhost:2567
- Admin panel on http://localhost:3001

### Option 2: Run Services Separately

Terminal 1 - Game Server:

```bash
npm run dev:server
```

Terminal 2 - Admin Panel:

```bash
npm run dev:app
```

## Accessing the Services

### Admin Panel

🌐 http://localhost:3001

Features:

- Home dashboard with navigation
- Beyblade management (/admin/beyblades)
- Stadium configuration (/admin/stadiums)
- Game statistics (/admin/stats)
- Settings (/admin/settings)
- Arena testing tools

### Game Server

🎮 http://localhost:2567

Endpoints:

- `/api/health` - Server health
- `/api/server-info` - Server information
- `/colyseus` - Monitoring panel
- `/test` - Test client

### WebSocket Connection

```typescript
import { Client } from "colyseus.js";

const client = new Client("ws://localhost:2567");
const room = await client.joinOrCreate("tryout_room", {
  beybladeId: "dragoon_gt",
  arenaId: "metrocity",
  userId: "user123",
  username: "Player1",
});
```

## Production Build

### Build Both Applications

```bash
npm run build
```

This creates:

- `lib/` - Compiled Colyseus server
- `.next/` - Built Next.js application

### Start Production Servers

```bash
npm run start:all
```

Or separately:

```bash
npm run start        # Game server only
npm run start:app    # Admin panel only
```

## Project Structure

```
game-server/
├── src/                    # Colyseus server source
│   ├── rooms/             # Game room logic
│   ├── physics/           # Physics engine
│   ├── ai/                # AI logic
│   └── index.ts           # Server entry point
│
├── app/                   # Next.js admin panel
│   ├── admin/            # Admin pages
│   │   ├── beyblades/    # Beyblade management
│   │   ├── stadiums/     # Stadium management
│   │   ├── arenas/       # Arena management
│   │   ├── stats/        # Statistics
│   │   └── settings/     # Settings
│   ├── api/              # Next.js API routes
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
│
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── game/             # Game components
│   ├── ui/               # UI components
│   └── features/         # Feature components
│
├── lib/                  # Shared libraries
├── types/                # TypeScript types
├── hooks/                # React hooks
├── utils/                # Utility functions
├── constants/            # Constants
└── contexts/             # React contexts
```

## Development Workflow

### 1. Game Server Development

- Edit files in `src/`
- Server auto-restarts with nodemon
- Test via test client or monitor panel

### 2. Admin Panel Development

- Edit files in `app/`, `components/`, etc.
- Hot reload enabled with Next.js
- Changes reflect immediately

### 3. Shared Code

- Types, utils, and lib are shared between both
- Changes affect both server and admin panel

## Common Tasks

### Add a New Admin Page

1. Create page in `app/admin/your-page/page.tsx`
2. Add to navigation in `app/admin/layout.tsx` (if exists)
3. Access at http://localhost:3001/admin/your-page

### Add API Endpoint

Create `app/api/your-endpoint/route.ts`:

```typescript
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ data: "your data" });
}
```

### Add Game Room Type

1. Create room in `src/rooms/YourRoom.ts`
2. Define in `src/index.ts`:
   ```typescript
   gameServer.define("your_room", YourRoom);
   ```

## Troubleshooting

### Port Already in Use

Change ports in `.env`:

```env
PORT=3000
NEXT_PORT=3002
```

### Module Not Found

```bash
npm install
```

### TypeScript Errors

```bash
npm run build
```

### Firebase Connection Issues

1. Check `.env` file has correct credentials path
2. Verify service account key is valid
3. Ensure Firestore collections exist

### Next.js Build Errors

If you see errors about missing modules:

```bash
rm -rf .next
npm run build:app
```

## Testing

### Manual Testing

1. Start servers: `npm run dev`
2. Open http://localhost:3001
3. Navigate through admin pages
4. Check http://localhost:2567/colyseus for game server status

### Monitor Active Rooms

Visit http://localhost:2567/colyseus to see:

- Active game rooms
- Connected players
- Room state
- Performance metrics

## Deployment

### Single Deployment (Recommended)

Deploy to platforms like Render, Railway, or Heroku:

1. Set environment variables
2. Build command: `npm run build`
3. Start command: `npm run start:all`

Both services run from one deployment!

### Separate Deployments

**Game Server:**

- Build: `npm run build:server`
- Start: `npm run start`
- Port: 2567

**Admin Panel:**

- Build: `npm run build:app`
- Start: `npm run start:app`
- Port: 3001

Set `COLYSEUS_SERVER_URL` environment variable in admin panel deployment.

## Next Steps

1. ✅ Services are running
2. 📝 Test all admin features
3. 🔐 Add authentication (optional)
4. 🚀 Deploy to production
5. 📚 Update main project documentation

## Support

- Check `MIGRATION.md` for detailed migration notes
- See `README.md` for full documentation
- Review code in `src/` and `app/` directories

---

**Happy coding! 🎮**
