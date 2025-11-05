# QR File Send 📱 → 🖨️

A beautiful, modern web app for print shops to receive file uploads from customers via QR codes. No more email attachments, no confusion - just scan, upload, and print!

## ✨ Features

- 🔐 **Secure Authentication** - Firebase Auth with email/password
- 🏪 **Multi-Shop Management** - Create and manage multiple print shops
- 🎯 **QR Code Generation** - Unique QR codes for each shop
- 📤 **Easy File Uploads** - Customers scan QR and upload files instantly
- 📋 **Order Management** - Track orders with statuses (pending → processing → completed → archived)
- 🔄 **Real-time Updates** - Orders appear instantly without refreshing
- 💾 **File Downloads** - Download uploaded files directly from dashboard
- 🎨 **Beautiful UI** - Inspired by Headspace & Clubhouse with orange accents
- 📱 **Fully Responsive** - Works perfectly on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Firebase project

### 1. Clone and Install

\`\`\`bash
cd qrfilesend
npm install
\`\`\`

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** → Email/Password sign-in method
4. Enable **Firestore Database** → Start in production mode
5. Enable **Storage** → Start in production mode
6. Go to Project Settings → General → Your apps → Web app
7. Copy your Firebase config

### 3. Environment Variables

Update `.env.local` with your Firebase credentials:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 4. Deploy Firebase Rules

Install Firebase CLI if you haven't:
\`\`\`bash
npm install -g firebase-tools
firebase login
firebase init
\`\`\`

Select your project and deploy the rules:
\`\`\`bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
\`\`\`

Or manually copy the rules from `firestore.rules` and `storage.rules` to your Firebase console.

### 5. Run the App

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📖 Usage Guide

### For Shop Owners

1. **Sign Up** - Create your account at `/signup`
2. **Create Shop** - Add your first shop from the dashboard
3. **Download QR Code** - Click download icon on your shop card
4. **Print & Display** - Print the QR code and put it in your shop
5. **Manage Orders** - Orders appear in real-time as customers upload files
6. **Process Orders**:
   - New orders start as "Pending"
   - Click "Start Processing" when you begin work
   - Click "Mark as Completed" when done
   - Click "Archive" to move to archived orders

### For Customers

1. **Scan QR Code** - Use phone camera to scan the QR code in the shop
2. **Select Files** - Choose files from your phone
3. **Upload** - Click upload and get your order number
4. **Save Order Number** - Screenshot or note down the order number

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Animations**: Framer Motion
- **QR Codes**: qrcode library
- **Notifications**: react-hot-toast
- **Date Formatting**: date-fns

## 📁 Project Structure

\`\`\`
qrfilesend/
├── app/
│   ├── dashboard/          # Shop owner dashboard
│   ├── signin/             # Sign in page
│   ├── signup/             # Sign up page
│   ├── upload/[shopId]/    # Public upload page
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/
│   ├── Button.tsx          # Reusable button component
│   ├── Card.tsx            # Card component
│   ├── Input.tsx           # Input component
│   └── ProtectedRoute.tsx  # Auth guard
├── contexts/
│   └── AuthContext.tsx     # Authentication context
├── lib/
│   ├── firebase.ts         # Firebase configuration
│   └── types.ts            # TypeScript types
├── firestore.rules         # Firestore security rules
├── storage.rules           # Storage security rules
└── tailwind.config.ts      # Tailwind configuration
\`\`\`

## 🎨 Design Philosophy

- **Friendly & Approachable** - Rounded corners, soft shadows, warm colors
- **Clear Hierarchy** - Important actions stand out
- **Delightful Interactions** - Smooth animations and transitions
- **Mobile-First** - Optimized for phone usage (primary use case)
- **Orange Accent** - Energetic and attention-grabbing (#ff6b35)

## 🔒 Security

- Firebase Authentication for user management
- Firestore security rules prevent unauthorized access
- Storage rules limit file sizes and control access
- Shop owners can only see their own shops and orders
- Customers can upload files but not read other orders

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

Don't forget to update `NEXT_PUBLIC_APP_URL` with your production URL.

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

## 📝 License

MIT License - feel free to use this for your print shop!

## 🎯 Future Enhancements

- [ ] Email notifications for new orders
- [ ] SMS notifications option
- [ ] Order history and analytics
- [ ] Custom branding per shop
- [ ] Customer feedback system
- [ ] Print settings/specifications
- [ ] Multiple file format support
- [ ] Order search functionality

---

Built with ❤️ for print shops everywhere

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
