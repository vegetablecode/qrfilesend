# 🚀 Launch Checklist

Use this checklist before deploying your app to production.

## Pre-Launch Checklist

### Firebase Setup
- [ ] Created Firebase project
- [ ] Enabled Authentication (Email/Password)
- [ ] Created Firestore Database
- [ ] Created Storage bucket
- [ ] Deployed Firestore security rules
- [ ] Deployed Storage security rules
- [ ] Tested authentication flow
- [ ] Tested file upload and storage

### Environment Variables
- [ ] Created `.env.local` file (for local dev)
- [ ] Added all Firebase config values
- [ ] Set correct `NEXT_PUBLIC_APP_URL` for local dev
- [ ] Verified all environment variables load correctly

### Testing
- [ ] Sign up works
- [ ] Sign in works
- [ ] Sign out works
- [ ] Create shop works
- [ ] QR code generates correctly
- [ ] QR code downloads as PNG
- [ ] Upload page loads from QR scan
- [ ] File upload works
- [ ] Order number displays
- [ ] Orders appear in dashboard in real-time
- [ ] Order status updates work (pending → processing → completed)
- [ ] Archive functionality works
- [ ] File download from dashboard works
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop

### Security
- [ ] Firestore rules prevent unauthorized access
- [ ] Storage rules prevent unauthorized access
- [ ] Shop owners can only see their own data
- [ ] Customers cannot see other orders
- [ ] File size limits are enforced
- [ ] Authentication is required for protected routes

### Performance
- [ ] Build completes without errors (`npm run build`)
- [ ] No console errors in browser
- [ ] Images load quickly
- [ ] Page transitions are smooth
- [ ] Real-time updates work without lag

## Deployment Checklist

### Pre-Deployment
- [ ] Code pushed to GitHub repository
- [ ] `.env.local` NOT committed (check .gitignore)
- [ ] README.md updated with any custom instructions
- [ ] All dependencies installed correctly
- [ ] Build works locally (`npm run build`)

### Vercel Deployment (Recommended)
- [ ] Created Vercel account
- [ ] Imported GitHub repository
- [ ] Added all environment variables in Vercel dashboard
- [ ] Updated `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Deployed successfully
- [ ] Tested production build

### Firebase Configuration (Production)
- [ ] Added production domain to Firebase Authorized Domains
  - Go to Authentication → Settings → Authorized domains
  - Add your Vercel domain (e.g., your-app.vercel.app)
- [ ] Verified CORS settings for Storage
- [ ] Set up billing alerts (optional but recommended)

### Post-Deployment Testing
- [ ] Visit production URL
- [ ] Sign up with new account
- [ ] Create a shop
- [ ] Download QR code
- [ ] Scan QR code with phone
- [ ] Upload test files from phone
- [ ] Verify order appears in dashboard
- [ ] Test complete order workflow
- [ ] Test on different devices
- [ ] Test on different browsers

### Final Steps
- [ ] Print test QR code
- [ ] Test in real-world scenario
- [ ] Create user documentation if needed
- [ ] Share app with test users
- [ ] Collect feedback
- [ ] Set up monitoring (optional)

## Post-Launch

### Monitoring
- [ ] Check Firebase usage (Authentication, Firestore, Storage)
- [ ] Monitor for errors
- [ ] Review user feedback
- [ ] Check performance metrics

### Maintenance
- [ ] Keep dependencies updated
- [ ] Monitor Firebase quotas
- [ ] Backup important data
- [ ] Review security rules periodically

### Growth
- [ ] Add analytics (optional)
- [ ] Implement user feedback
- [ ] Add new features from roadmap
- [ ] Optimize based on usage patterns

## Common Issues & Solutions

### Issue: "Firebase configuration not found"
**Solution**: Check `.env.local` has all correct values and restart dev server

### Issue: "Permission denied" in Firestore
**Solution**: Deploy security rules: `firebase deploy --only firestore:rules`

### Issue: "Cannot upload files"
**Solution**: Deploy storage rules: `firebase deploy --only storage:rules`

### Issue: QR codes not working in production
**Solution**: Update `NEXT_PUBLIC_APP_URL` in Vercel to production domain

### Issue: Real-time updates not working
**Solution**: Check Firestore rules and network connection

### Issue: Build fails
**Solution**: Run `npm install` and check for TypeScript errors

## Support

If you encounter issues:
1. Check Firebase Console for errors
2. Check browser console for errors
3. Review security rules
4. Verify environment variables
5. Check Firebase service status
6. Review documentation files

---

**Ready to go live? Let's do this! 🚀**
