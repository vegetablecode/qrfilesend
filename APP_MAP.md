# 🗺️ QR File Send - App Structure Map

## Visual Overview

\`\`\`
                                    🌐 QR File Send
                                         |
                    _____________________|_____________________
                   |                     |                     |
              🏠 Landing            🔐 Auth               📊 Dashboard
              (page.tsx)         (signin/signup)        (dashboard/)
                   |                     |                     |
                   |                     |                     |
                   |              Login/Register         Shop Management
                   |                     |                     |
                   |                     ↓                     |
                   |            ✅ Authenticated         ______|______
                   |                     |              |             |
                   |                     +-------→  🏪 Shops    📋 Orders
                   |                              (Create/View) (Track/Process)
                   |                                    |             |
                   ↓                                    ↓             ↓
            📱 Public Access                     🎯 QR Codes    Real-time Updates
                                                 (Download)     (Auto-refresh)
                                                      |
                                                      ↓
                                              📤 Upload Page
                                              (upload/[shopId])
                                                      |
                                              Customer Uploads
                                                      ↓
                                              🎫 Order Number
\`\`\`

## 📂 File Structure Breakdown

### Root Directory
\`\`\`
qrfilesend/
├── 📱 App Code
│   ├── app/                    # Next.js App Router
│   ├── components/             # Reusable UI components
│   ├── contexts/               # React contexts (Auth)
│   └── lib/                    # Utilities and types
│
├── ⚙️ Configuration
│   ├── tailwind.config.ts      # Tailwind setup
│   ├── next.config.ts          # Next.js config
│   ├── tsconfig.json           # TypeScript config
│   └── package.json            # Dependencies
│
├── 🔥 Firebase
│   ├── firestore.rules         # Database security
│   ├── storage.rules           # File storage security
│   └── .env.local              # Firebase credentials
│
└── 📚 Documentation
    ├── README.md               # Main docs
    ├── GETTING_STARTED.md      # Quick start
    ├── FIREBASE_SETUP.md       # Firebase guide
    ├── PROJECT_SUMMARY.md      # Project overview
    ├── LAUNCH_CHECKLIST.md     # Deploy checklist
    └── APP_MAP.md              # This file!
\`\`\`

## 🎯 Pages & Routes

### Public Routes (No Auth Required)
\`\`\`
/                           → Landing page (Hero, features)
/signin                     → Sign in page
/signup                     → Sign up page
/upload/[shopId]            → File upload page (QR destination)
\`\`\`

### Protected Routes (Auth Required)
\`\`\`
/dashboard                  → Shop management & orders
\`\`\`

## 🧩 Component Hierarchy

\`\`\`
App Layout (layout.tsx)
├── AuthProvider (contexts/AuthContext.tsx)
│   └── Toaster (react-hot-toast)
│
└── Page Content
    ├── Landing Page (/)
    │   ├── Hero Section
    │   ├── Feature Cards
    │   └── CTA Buttons
    │
    ├── Auth Pages (/signin, /signup)
    │   ├── Card Component
    │   ├── Input Components
    │   └── Button Component
    │
    ├── Dashboard (/dashboard)
    │   ├── ProtectedRoute
    │   ├── Header
    │   ├── Shop Cards
    │   │   ├── QR Code Image
    │   │   └── Download Button
    │   ├── Order Cards
    │   │   ├── File List
    │   │   ├── Status Badge
    │   │   └── Action Buttons
    │   └── Modals
    │       └── New Shop Modal
    │
    └── Upload Page (/upload/[shopId])
        ├── Shop Info
        ├── File Selector
        ├── File Preview List
        ├── Upload Progress
        └── Success Screen
            └── Order Number Display
\`\`\`

## 🔄 Data Flow

### User Authentication Flow
\`\`\`
User → Sign Up/Sign In → Firebase Auth → AuthContext → Protected Routes
\`\`\`

### Shop Creation Flow
\`\`\`
Dashboard → Create Shop → Firestore → Generate QR Code → Display & Download
\`\`\`

### File Upload Flow
\`\`\`
Customer Scans QR
    ↓
Upload Page Loads (with shopId)
    ↓
Select Files
    ↓
Upload to Firebase Storage
    ↓
Create Order in Firestore
    ↓
Generate Order Number
    ↓
Display Success
\`\`\`

### Order Processing Flow
\`\`\`
New Order Created
    ↓
Real-time Listener Fires
    ↓
Dashboard Updates Automatically
    ↓
Shop Owner Processes Order:
    - Pending → Processing → Completed → Archived
\`\`\`

## 🎨 UI Components Library

### Layout Components
- **Card** - Rounded container with shadow
- **Button** - 4 variants (primary, secondary, outline, ghost)
- **Input** - Form input with label and error states

### Specialized Components
- **ProtectedRoute** - Auth guard wrapper
- **OrderCard** - Order display with status
- **FeatureCard** - Landing page feature display
- **ShopCard** - Shop info with QR code

### UI States
- **Loading** - Spinner and skeleton states
- **Empty** - No data states
- **Error** - Error boundaries and messages
- **Success** - Confirmation screens

## 🔐 Security Layers

### Frontend
\`\`\`
ProtectedRoute Component
    ↓
useAuth Hook
    ↓
Firebase Auth State
\`\`\`

### Backend (Firebase)
\`\`\`
Firestore Rules
├── Shops: Owner-only access
└── Orders: Owner read, Public create

Storage Rules
├── Upload: Public (required for upload page)
└── Download: Authenticated only
\`\`\`

## 📊 Database Schema

### Firestore Collections

#### shops
\`\`\`typescript
{
  id: string,              // Auto-generated
  name: string,            // Shop name
  ownerId: string,         // User UID
  qrCodeUrl: string,       // Data URL of QR image
  createdAt: Timestamp
}
\`\`\`

#### orders
\`\`\`typescript
{
  id: string,              // Auto-generated
  shopId: string,          // Reference to shop
  orderNumber: string,     // Unique order number
  status: 'pending' | 'processing' | 'completed' | 'archived',
  files: [
    {
      id: string,
      name: string,
      size: number,
      type: string,
      url: string,         // Firebase Storage URL
      path: string         // Storage path
    }
  ],
  createdAt: Timestamp,
  completedAt: Timestamp?  // Optional
}
\`\`\`

### Storage Structure
\`\`\`
/uploads/
  /{shopId}/
    /{orderNumber}/
      /file1.pdf
      /file2.jpg
      /file3.docx
\`\`\`

## 🎯 Key Features Map

### Real-time Updates
\`\`\`
Firestore onSnapshot Listener
    ↓
React State Update
    ↓
UI Re-renders Automatically
    ↓
No Manual Refresh Needed!
\`\`\`

### QR Code Generation
\`\`\`
Shop Created
    ↓
Generate URL: {APP_URL}/upload/{shopId}
    ↓
QRCode.toDataURL()
    ↓
Store Data URL in Firestore
    ↓
Display & Download
\`\`\`

### File Upload
\`\`\`
Files Selected
    ↓
For Each File:
    ├── Upload to Storage
    ├── Get Download URL
    └── Track Progress
    ↓
Create Order in Firestore
    ↓
Return Order Number
\`\`\`

## 🚀 Deployment Flow

\`\`\`
Local Development
    ↓
Git Push to GitHub
    ↓
Vercel Import
    ↓
Configure Environment Variables
    ↓
Deploy
    ↓
Update Firebase Authorized Domains
    ↓
Test Production Build
    ↓
🎉 Live!
\`\`\`

## 📱 User Journeys

### Shop Owner Journey
\`\`\`
1. Sign Up          →  Create account
2. Create Shop      →  Add shop details
3. Get QR Code      →  Download QR image
4. Print QR         →  Physical display
5. Monitor Orders   →  Real-time dashboard
6. Process Orders   →  Update status
7. Download Files   →  Complete order
8. Archive          →  Clean up dashboard
\`\`\`

### Customer Journey
\`\`\`
1. Scan QR Code     →  Phone camera
2. Upload Page      →  Loads automatically
3. Select Files     →  From device
4. Upload           →  Progress shown
5. Get Order #      →  Save/screenshot
6. Done!            →  Walk away happy
\`\`\`

## 🎨 Design System

### Colors
- **Primary**: Orange (#ff6b35)
- **Background**: Warm cream (#fef8f3)
- **Text**: Dark gray (#1a1a1a)
- **Gray shades**: 50-900

### Spacing
- Card padding: 1.5rem (24px)
- Section gaps: 2rem (32px)
- Component spacing: 1rem (16px)

### Border Radius
- Small: 1rem (16px)
- Medium: 1.5rem (24px)
- Large: 2rem (32px)
- XLarge: 3rem (48px)

### Typography
- Headings: Bold, large
- Body: Regular, readable
- Labels: Medium weight
- System fonts for performance

## 🔧 Tech Stack Map

\`\`\`
Frontend Layer
├── Next.js 14 (App Router)
├── React 19
├── TypeScript
├── Tailwind CSS
└── Framer Motion

Backend Layer
├── Firebase Authentication
├── Firestore Database
└── Firebase Storage

Developer Experience
├── Hot Reload
├── Type Checking
├── ESLint
└── Git

Production
├── Vercel Hosting
├── Edge Network
└── Serverless Functions
\`\`\`

## 🎯 Performance Optimizations

- ✅ Static page generation where possible
- ✅ Dynamic imports for code splitting
- ✅ Image optimization (Next.js)
- ✅ CSS purging (Tailwind)
- ✅ Firebase SDK tree-shaking
- ✅ Real-time listeners (no polling)

## 📊 State Management

\`\`\`
Global State
└── AuthContext
    ├── User object
    ├── Loading state
    └── Auth methods

Local State (Dashboard)
├── Shops array
├── Selected shop
├── Orders array
├── Modal states
└── UI states

Local State (Upload)
├── Shop data
├── Files array
├── Upload progress
└── Order number
\`\`\`

---

## 🎓 Understanding the App

This map shows how everything connects. Use it to:
- Navigate the codebase
- Understand data flow
- Plan new features
- Debug issues
- Onboard new developers

**Need more detail?** Check the actual code - it's well-commented! 📝
