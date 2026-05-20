# Admin Panel

Welcome to the Beyblade Game Admin Panel!

## Quick Access

**URL**: http://localhost:3001/admin

## Features

### 🌀 Beyblade Management

Manage all beyblades in the game.

**Route**: `/admin/beyblades`

- **List**: View all beyblades
- **Create**: Add new beyblades with stats and abilities
- **Edit**: Modify existing beyblades
- **Delete**: Remove beyblades
- **Preview**: Visual beyblade preview

### 🏟️ Stadium Configuration

Create and manage battle arenas.

**Route**: `/admin/stadiums`

- **List**: View all stadiums
- **Create**: Design custom arenas
- **Edit**: Modify existing stadiums
- **Delete**: Remove stadiums
- **Preview**: Real-time 3D preview
- **Features**: Obstacles, water bodies, turrets

### ⚔️ Legacy Arenas

Manage legacy arena configurations.

**Route**: `/admin/arenas`

- Legacy arena management
- Compatible with older system

### 📊 Statistics

View game analytics and statistics.

**Route**: `/admin/stats`

- Active games
- Beyblade usage
- Win rates
- Arena popularity

### ⚙️ Settings

Configure game parameters.

**Route**: `/admin/settings`

- Global game settings
- Physics configuration
- Matchmaking rules

### 🧪 Testing

Test arena configurations.

**Route**: `/admin/arena-test`

- Test arenas before deployment
- Visual testing tools

## Navigation

### Main Navigation

```
Home (/) → Admin (/admin) → Features
```

### Admin Dashboard

```
/admin
├── Beyblades
├── Stadiums
├── Arenas
├── Statistics
├── Settings
└── Testing Tools
```

## Access Control

Currently, all routes are **PUBLIC** (no authentication required).

To add authentication:

1. Install auth library (NextAuth, etc.)
2. Create middleware
3. Wrap admin routes with auth check

Example:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Check authentication
  if (!isAuthenticated(request)) {
    return NextResponse.redirect("/login");
  }
}

export const config = {
  matcher: "/admin/:path*",
};
```

## UI Components

The admin panel uses modern UI components:

- **Radix UI**: Accessible primitives
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Lucide Icons**: Beautiful icons

## Data Flow

```
Admin Panel
    ↓
  Firebase
    ↑
Game Server
    ↑
  Clients
```

## Common Tasks

### Create a Beyblade

1. Navigate to `/admin/beyblades`
2. Click "Create New Beyblade"
3. Fill in:
   - Name
   - Type (Attack/Defense/Stamina/Balance)
   - Stats (Attack, Defense, Stamina, Speed)
   - Abilities
4. Preview
5. Save

### Create a Stadium

1. Navigate to `/admin/stadiums`
2. Click "Create New Stadium"
3. Configure:
   - Stadium size
   - Obstacles
   - Water bodies
   - Turrets
4. Preview in 3D
5. Save

### View Statistics

1. Navigate to `/admin/stats`
2. View:
   - Active games
   - Beyblade performance
   - Arena usage
   - Player statistics

## Development

### File Locations

```
app/
├── admin/
│   ├── page.tsx              # Dashboard
│   ├── layout.tsx            # Admin layout
│   ├── beyblades/            # Beyblade pages
│   ├── stadiums/             # Stadium pages
│   ├── arenas/               # Arena pages
│   ├── stats/                # Statistics pages
│   └── settings/             # Settings pages
└── layout.tsx                # Root layout
```

### Adding New Pages

1. Create page in `app/admin/[feature]/page.tsx`
2. Add route to navigation
3. Create components in `components/admin/`
4. Add types in `types/`

### Styling

- Use Tailwind classes
- Follow existing patterns
- Keep responsive design

### State Management

- Use React hooks
- SWR for data fetching
- Context for global state

## API Integration

### Firebase

```typescript
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();
const beyblades = await db.collection("beyblade_stats").get();
```

### REST API (if needed)

```typescript
import axios from "axios";

const API_URL = process.env.API_URL;
const response = await axios.get(`${API_URL}/api/beyblades`);
```

## Troubleshooting

### Page Not Found

- Check if files exist in `app/admin/`
- Verify Next.js is running
- Check for typos in route

### Styling Issues

- Verify Tailwind is configured
- Check `globals.css` is imported
- Clear `.next` cache

### Data Not Loading

- Check Firebase credentials
- Verify `.env` configuration
- Check browser console for errors

## Future Enhancements

- [ ] Add authentication
- [ ] Add role-based access control
- [ ] Add audit logging
- [ ] Add bulk operations
- [ ] Add import/export features
- [ ] Add real-time updates
- [ ] Add search and filters
- [ ] Add dark mode toggle

## Support

- See `README.md` for full documentation
- See `OVERVIEW.md` for package overview
- See `CHECKLIST.md` for setup verification

## Quick Links

- **Admin Home**: http://localhost:3001/admin
- **Beyblades**: http://localhost:3001/admin/beyblades
- **Stadiums**: http://localhost:3001/admin/stadiums
- **Stats**: http://localhost:3001/admin/stats
- **Monitor**: http://localhost:2567/colyseus

---

**Ready to manage your game!** 🎮
