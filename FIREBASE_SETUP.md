# Firebase Setup Guide 🔥

Follow these steps to configure Firebase for your QR File Send app.

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name (e.g., "qr-file-send")
4. (Optional) Enable Google Analytics
5. Click "Create project"

## 2. Enable Authentication

1. In Firebase Console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Click on "Email/Password"
5. Enable the first toggle (Email/Password)
6. Click "Save"

## 3. Enable Firestore Database

1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location closest to your users
5. Click "Enable"

## 4. Enable Storage

1. Click "Storage" in the left sidebar
2. Click "Get started"
3. Start in production mode
4. Use the same location as Firestore
5. Click "Done"

## 5. Get Your Firebase Config

1. Click the gear icon (⚙️) next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>` to add a web app
5. Register app with a nickname (e.g., "QR File Send Web")
6. Copy the `firebaseConfig` object

## 6. Update Environment Variables

Update your `.env.local` file with the values from Firebase config:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

## 7. Deploy Security Rules

### Option A: Using Firebase CLI (Recommended)

\`\`\`bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Firestore
# - Storage
# Choose your existing project
# Use existing files: firestore.rules and storage.rules

# Deploy the rules
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
\`\`\`

### Option B: Manual Setup

#### Firestore Rules:
1. Go to Firestore Database → Rules tab
2. Copy content from `firestore.rules` file
3. Click "Publish"

#### Storage Rules:
1. Go to Storage → Rules tab
2. Copy content from `storage.rules` file
3. Click "Publish"

## 8. Test Your Setup

\`\`\`bash
npm run dev
\`\`\`

1. Go to http://localhost:3000
2. Sign up for a new account
3. Create a shop
4. Download the QR code
5. Scan it with your phone and test file upload

## 🎉 You're All Set!

Your Firebase backend is now configured and ready to use.

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Check that your `.env.local` file has all the correct values
- Restart your dev server after updating `.env.local`

### "Missing or insufficient permissions"
- Make sure you deployed the Firestore rules
- Check that rules were published successfully

### "Storage: User does not have permission"
- Make sure you deployed the Storage rules
- Verify rules in Firebase Console

### "Cannot find module 'firebase/app'"
- Run `npm install` to install dependencies
- Check that firebase package is in package.json

## Production Deployment

When deploying to production (Vercel, etc.):

1. Add all environment variables in your hosting platform
2. Update `NEXT_PUBLIC_APP_URL` to your production URL
3. Update Firebase authorized domains:
   - Go to Authentication → Settings → Authorized domains
   - Add your production domain

## Security Best Practices

✅ **DO:**
- Keep `.env.local` file secure and never commit it
- Use different Firebase projects for dev/staging/production
- Review security rules regularly
- Set up Firebase billing alerts

❌ **DON'T:**
- Share your Firebase config publicly (even though it's "public", don't make it easy)
- Use the same project for testing and production
- Skip setting up security rules
- Give overly permissive rules

---

Need help? Check the [Firebase Documentation](https://firebase.google.com/docs)
