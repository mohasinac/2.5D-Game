# 🎮 Beyblade Game Server & Admin Panel

A complete game package containing:

- **Colyseus Game Server** - Server-authoritative multiplayer game server built with Colyseus and Matter.js
- **Next.js Admin Panel** - Web-based administration interface for managing game content

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd game-server
npm install
```

### 2. Set Up Firebase

Create a `.env` file in `game-server/` directory:

```env
# Firebase Admin SDK
GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccountKey.json

# Server Config
PORT=2567
NODE_ENV=development
```

**Option 1: Use Service Account Key**

- Go to Firebase Console → Project Settings → Service Accounts
- Generate new private key
- Save as `serviceAccountKey.json` in `game-server/` directory
- Update `.env` with the path

**Option 2: Use Application Default Credentials (for production)**

- Set up Google Cloud credentials on your server

### 3. Start Development Server

```bash
npm run dev
```

This will start both:

- **Game Server**: http://localhost:2567
- **Admin Panel**: http://localhost:3001

Or run them separately:

```bash
# Game server only
npm run dev:server

# Admin panel only
npm run dev:app
```

**Available Endpoints:**

- **Monitor Panel**: http://localhost:2567/colyseus
- **Health Check**: http://localhost:2567/health
- **Admin Interface**: http://localhost:3001/admin

### 4. Test the Server

Open the monitor panel to see active rooms and connections.

## 📁 Project Structure

```
game-server/
├── src/                          # Colyseus game server
│   ├── rooms/                    # Game room handlers
│   │   ├── TryoutRoom.ts         # Tryout mode implementation
│   │   └── schema/
│   │       └── GameState.ts      # Game state schema
│   ├── physics/                  # Physics engine
│   │   └── PhysicsEngine.ts      # Matter.js physics wrapper
│   ├── utils/
│   │   └── firebase.ts           # Firebase integration
│   └── index.ts                  # Server entry point
├── app/                          # Next.js admin interface
│   ├── admin/                    # Admin panel pages
│   │   ├── beyblades/           # Beyblade management
│   │   ├── stadiums/            # Stadium configuration
│   │   ├── stats/               # Game statistics
│   │   └── settings/            # Game settings
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── admin/                   # Admin-specific components
│   ├── game/                    # Game UI components
│   ├── features/                # Feature components
│   └── ui/                      # Reusable UI components
├── lib/                         # Shared libraries
├── types/                       # TypeScript types
├── hooks/                       # React hooks
├── utils/                       # Utility functions
├── constants/                   # Constants and configs
├── package.json
├── tsconfig.json
├── tsconfig.app.json            # Next.js TypeScript config
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS config
└── .env                         # Environment variables
```

## 🎯 Game Modes

### Currently Implemented

- ✅ **Tryout Mode** - Solo practice with physics simulation

### Coming Soon

- ⏳ **Single Battle (vs AI)** - Phase 3
- ⏳ **Single Battle (PvP)** - Phase 5
- ⏳ **Tournament Mode** - Phase 7

## 🎨 Admin Panel Features

The integrated Next.js admin panel provides a comprehensive interface for managing all game content:

### Beyblade Management

- Create, edit, and delete beyblades
- Configure stats: attack, defense, stamina, speed
- Set special abilities and properties
- Visual beyblade preview
- Bulk import/export

### Stadium Configuration

- Design custom arenas with drag-and-drop interface
- Configure obstacles, hazards, and special zones
- Add water bodies with physics properties
- Place and configure turrets
- Real-time 3D preview
- Save and load configurations

### Game Statistics

- View active games and player counts
- Monitor beyblade usage statistics
- Analyze win rates and performance metrics
- Track arena popularity
- Export analytics data

### Settings & Configuration

- Configure global game parameters
- Manage physics settings
- Set up matchmaking rules
- Configure rewards and progression
- System maintenance tools

### Access Admin Panel

Visit http://localhost:3001/admin after starting the development server.

## 🧪 Testing

### Manual Testing

1. Start the game server: `npm run dev`
2. Open the Next.js client (main application)
3. Navigate to game mode selection
4. Select "Tryout Mode"
5. Choose a beyblade and arena
6. Connect to the game server

### Using Monitor Panel

Visit http://localhost:2567/colyseus to see:

- Active rooms
- Connected clients
- Room states
- Performance metrics

## 📝 API Reference

### Connect to Tryout Room

```typescript
import { Client } from "colyseus.js";

const client = new Client("ws://localhost:2567");

const room = await client.joinOrCreate("tryout_room", {
  beybladeId: "dragoon_gt",
  arenaId: "metrocity",
  userId: "user123",
  username: "Player1",
});

// Listen for state updates
room.onStateChange((state) => {
  console.log("Game state:", state);
});

// Send input
room.send("input", {
  direction: { x: 1, y: 0 },
  timestamp: Date.now(),
});

// Send action
room.send("action", {
  type: "dash",
});
```

## 🔧 Configuration

### Physics Settings

Edit `src/physics/PhysicsEngine.ts`:

```typescript
private readonly TICK_RATE = 60; // 60 FPS
```

### Room Settings

Edit `src/rooms/TryoutRoom.ts`:

```typescript
maxClients = 1; // Only one player for tryout mode
```

## 📊 Performance

- **Tick Rate**: 60 FPS
- **Update Interval**: 16.67ms
- **Target Latency**: <100ms
- **Concurrent Rooms**: 50+ (per instance)

## 🐛 Troubleshooting

### Firebase Connection Error

- Make sure `GOOGLE_APPLICATION_CREDENTIALS` is set correctly
- Check that service account key is valid
- Verify Firestore collections exist: `beyblade_stats`, `arenas`

### Port Already in Use

Change the port in `.env`:

```env
PORT=3000
```

### Cannot Find Module Errors

```bash
npm install
```

## 📚 Documentation

See full documentation in `docs/game/`:

- [Implementation Plan](../docs/game/GAME_MODES_IMPLEMENTATION_PLAN.md)
- [Quick Start Guide](../docs/game/QUICK_START_GUIDE.md)
- [Architecture Diagrams](../docs/game/ARCHITECTURE_DIAGRAMS.md)
- [Technology Comparison](../docs/game/TECHNOLOGY_COMPARISON.md)

## 🚢 Deployment

### Production Build

```bash
npm run build
npm start
```

### Deploy to VPS/Cloud

1. Set up Node.js environment
2. Install dependencies: `npm install --production`
3. Set environment variables
4. Run: `npm start`
5. Use PM2 for process management

### Using PM2

```bash
npm install -g pm2
pm2 start npm --name "game-server" -- start
pm2 save
pm2 startup
```

## 📄 License

MIT
