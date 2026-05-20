# Post-Migration Checklist

Use this checklist to verify everything is working correctly.

## ✅ Setup Verification

### Dependencies

- [ ] Ran `npm install` in game-server directory
- [ ] No errors during installation
- [ ] All packages installed successfully

### Configuration

- [ ] Created `.env` file from `.env.example`
- [ ] Added Firebase credentials to `.env`
- [ ] Configured PORT and NEXT_PORT if needed
- [ ] Placed `serviceAccountKey.json` (if using)

### File Structure

- [ ] `app/` directory exists with admin pages
- [ ] `components/` directory exists with all components
- [ ] `lib/` directory exists with game logic
- [ ] `types/` directory exists with TypeScript types
- [ ] `src/` directory exists with Colyseus server code

## ✅ Functionality Testing

### Game Server

- [ ] Start server with `npm run dev:server`
- [ ] Server starts on port 2567 (or configured port)
- [ ] No errors in console
- [ ] Monitor panel accessible at `/colyseus`
- [ ] Health check returns OK at `/health`

### Admin Panel

- [ ] Start panel with `npm run dev:app`
- [ ] Panel starts on port 3001 (or configured port)
- [ ] No build errors
- [ ] Home page loads at `http://localhost:3001`
- [ ] Admin page loads at `http://localhost:3001/admin`

### Both Services

- [ ] Start both with `npm run dev`
- [ ] Both services start without conflicts
- [ ] Can access both simultaneously

### Admin Features

- [ ] `/admin/beyblades` page loads
- [ ] `/admin/stadiums` page loads
- [ ] `/admin/stats` page loads
- [ ] `/admin/settings` page loads
- [ ] Can create a new beyblade
- [ ] Can create a new stadium
- [ ] Can view statistics

### Firebase Integration

- [ ] Can fetch beyblades from Firebase
- [ ] Can save new beyblade to Firebase
- [ ] Can update existing beyblade
- [ ] Can delete beyblade
- [ ] Same for stadiums/arenas

## ✅ Code Quality

### TypeScript

- [ ] No TypeScript errors in terminal
- [ ] Types are correctly imported
- [ ] `@/` path imports work correctly

### React

- [ ] Components render without errors
- [ ] No hydration errors
- [ ] Hot reload works for admin panel

### Styling

- [ ] Tailwind CSS classes work
- [ ] Pages are styled correctly
- [ ] Responsive design works

## ✅ Production Readiness

### Build

- [ ] `npm run build:server` succeeds
- [ ] `npm run build:app` succeeds
- [ ] `npm run build` (both) succeeds
- [ ] No build warnings or errors

### Production Mode

- [ ] `npm run start` starts game server
- [ ] `npm run start:app` starts admin panel
- [ ] `npm run start:all` starts both
- [ ] Both work in production mode

## ✅ Documentation

- [ ] Read `README.md`
- [ ] Read `MIGRATION_COMPLETE.md`
- [ ] Read `SETUP_SUCCESS.md`
- [ ] Understand project structure
- [ ] Know how to start services
- [ ] Know where to find things

## ✅ Main Project (Optional)

### Cleanup

- [ ] Removed game code from `src/app/(frontend)/admin/game/` (optional)
- [ ] Removed game components from `src/components/game/` (optional)
- [ ] Removed game types from `src/types/game/` (optional)
- [ ] Updated imports in main project (if cleanup done)

### Integration

- [ ] Added link to game admin in main app (optional)
- [ ] Configured CORS if needed (optional)
- [ ] Set up authentication bridge (optional)

## ✅ Deployment (When Ready)

### Server Setup

- [ ] Choose hosting provider (VPS, Cloud, etc.)
- [ ] Set up Node.js environment
- [ ] Configure firewall for ports 2567 and 3001
- [ ] Install PM2 or similar process manager

### Environment

- [ ] Set production environment variables
- [ ] Configure production Firebase credentials
- [ ] Set up SSL certificates (if needed)
- [ ] Configure domain/subdomain

### CI/CD

- [ ] Set up automated builds (optional)
- [ ] Configure deployment pipeline (optional)
- [ ] Set up monitoring (optional)

## 🎉 Success Criteria

You can consider the migration successful if:

✅ Both services start without errors  
✅ Admin panel is accessible and functional  
✅ Can create and manage beyblades  
✅ Can create and manage stadiums  
✅ Firebase integration works  
✅ No critical TypeScript errors  
✅ Build process succeeds

## 🐛 Common Issues

### Issue: Port already in use

**Solution**: Change PORT or NEXT_PORT in `.env`

### Issue: Module not found

**Solution**: Run `npm install`

### Issue: Firebase connection error

**Solution**: Check `.env` credentials and `serviceAccountKey.json`

### Issue: TypeScript errors

**Solution**: Run `npm install` and check tsconfig files

### Issue: Build fails

**Solution**: Delete `.next` and `node_modules`, reinstall

### Issue: Admin pages don't load

**Solution**: Check if files exist in `app/admin/` directory

## 📞 Getting Help

If you encounter issues:

1. Check this checklist
2. Read `README.md`
3. Check `MIGRATION_COMPLETE.md`
4. Review error messages carefully
5. Check if all dependencies are installed
6. Verify `.env` configuration

## 🚀 Ready to Build!

Once all checkboxes are ticked, you're ready to start developing your beyblade game!

```bash
npm run dev
```

Visit: http://localhost:3001/admin

Happy coding! 🎮
