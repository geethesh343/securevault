# LifeVault AI — Cloud-Based Digital Life Management Platform

LifeVault is an AI-powered personal digital wallet and life management application engineered for storing, organizing, and monitoring sensitive personal documents (Aadhaar, passports, insurance policies, warranties), recurring subscriptions, upcoming bills, and secure credentials with enterprise-grade cloud infrastructure.

Developed as a college academic demonstration project showcasing **Cloud Computing**, **Zero-Trust Security Architectures**, and **Applied Generative AI**.

---

## 1. Cloud Architecture Overview

LifeVault implements a modern decoupled cloud architecture:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Client Tier (React 19 SPA)                      │
│   - Vite + React 19 + Tailwind CSS + Lucide Icons                      │
│   - Firebase SDK v13 (Auth, Firestore Real-time SDK, Cloud Storage)    │
└──────────────────┬─────────────────────────────┬───────────────────────┘
                   │                             │
    Direct Cloud SDK Mutations           Server API Requests (/api/*)
    (Governed by Security Rules)                 │
                   │                             ▼
                   │             ┌───────────────────────────────────────┐
                   │             │   Backend Proxy Tier (Node.js/Express)│
                   │             │   - Express 4.21                      │
                   │             │   - Server-side Gemini 3.8 Flash SDK  │
                   │             │   - Secure GEMINI_API_KEY protection  │
                   │             │   - Document OCR, Smart Search, Audit │
                   │             └───────────────────────────────────────┘
                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Google Cloud & Firebase Infrastructure               │
│                                                                        │
│  [ Firebase Authentication ]                                           │
│   - Email & Password registration, login, session tokens               │
│   - Google OAuth 2.0 Identity Provider (Popup)                         │
│                                                                        │
│  [ Cloud Firestore (NoSQL Database) ]                                  │
│   - Multi-Region Database: ai-studio-lifevaultailifem-...              │
│   - Strict User-Scoped Paths: users/{userId}/documents/{docId}        │
│   - Subcollections: documents, subscriptions, bills, credentials       │
│                                                                        │
│  [ Firebase Cloud Storage (Object Store) ]                             │
│   - Bucket: silken-vigil-tlcf1.firebasestorage.app                     │
│   - Isolated File Paths: users/{userId}/documents/{fileId}             │
│   - Client-side size & MIME validation (PDF, JPG, PNG, WEBP <= 15MB)   │
│                                                                        │
│  [ Attribute-Based Access Control (ABAC) Security Rules ]              │
│   - firestore.rules: request.auth != null && request.auth.uid == userId│
│   - storage.rules: Owner-only read/write with size & MIME guards       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Prerequisites & Tools

Ensure the following tools are installed on your machine:
- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** or **bun**: Package manager
- **Firebase CLI** (optional for manual terminal deployments):
  ```powershell
  npm install -g firebase-tools
  ```
- **VS Code** on Windows, macOS, or Linux

---

## 3. Local Development in VS Code on Windows (PowerShell)

### Step 1: Open PowerShell and Navigate to the Project
```powershell
cd C:\path\to\lifevault
```

### Step 2: Install Node.js Dependencies
```powershell
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```
Edit `.env` in VS Code and set your `GEMINI_API_KEY`:
```env
GEMINI_API_KEY="AIzaSyYourActualGeminiApiKey"
PORT=3000
APP_URL="http://localhost:3000"
```

### Step 4: Verify Firebase Applet Configuration
Confirm `firebase-applet-config.json` exists in the project root:
```json
{
  "projectId": "life-vault-f36d3",
  "appId": "1:630147825752:web:b9150f8ad36e473d250a2d",
  "apiKey": "AIzaSyClzFtPN3CNuAiggp8vUOGXE8crzrN4Ic8",
  "authDomain": "life-vault-f36d3.firebaseapp.com",
  "firestoreDatabaseId": "ai-studio-lifevaultailifem-73759420-4dcc-4f20-b491-75a07b5d9df4",
  "storageBucket": "life-vault-f36d3.firebasestorage.app",
  "messagingSenderId": "630147825752",
  "measurementId": "G-7PGNPCKGVB"
}
```

### Step 5: Start the Full-Stack Development Server
```powershell
npm run dev
```
Open your browser at:
```
http://localhost:3000
```

---

## 4. Manual Firebase Console Setup (One-Time Guide)

If you configure or clone into your own Firebase project from scratch:

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/) -> **Add Project**.
   - Enter project name (e.g., `lifevault-demo`).

2. **Register Web App**:
   - In Project Overview, click the Web icon `</>`.
   - Register App name `LifeVault Web`. Copy the config into `firebase-applet-config.json`.

3. **Enable Authentication Providers**:
   - Go to **Build** -> **Authentication** -> **Get Started**.
   - Under **Sign-in method**, enable:
     - **Email/Password**: Turn ON -> Save.
     - **Google**: Turn ON, specify support email -> Save.
   - Under **Authorized domains**, ensure `localhost` and your hosted domain are listed.

4. **Provision Cloud Firestore**:
   - Go to **Build** -> **Firestore Database** -> **Create Database**.
   - Choose a region (e.g., `asia-east1` or `us-central1`).
   - Start in **Production mode** (Security Rules will be deployed).

5. **Enable Cloud Storage for Firebase**:
   - Go to **Build** -> **Storage** -> **Get Started**.
   - Choose default bucket location.

---

## 5. Security Rules Deployment

LifeVault enforces zero-trust owner isolation. Security rules are mathematically guarded against privilege escalation.

### Deploy Firestore Security Rules
```powershell
firebase deploy --only firestore:rules
```

### Deploy Cloud Storage Security Rules
```powershell
firebase deploy --only storage
```

### Hardened Rule Highlights (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 1. Default-deny safety net
    match /{document=**} {
      allow read, write: if false;
    }

    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }

    match /users/{userId} {
      allow get, create, update, delete: if isOwner(userId);

      // Subcollections are strictly locked to the authenticated owner
      match /documents/{documentId} {
        allow get, list, create, update, delete: if isOwner(userId);
      }
      match /subscriptions/{subscriptionId} {
        allow get, list, create, update, delete: if isOwner(userId);
      }
      match /bills/{billId} {
        allow get, list, create, update, delete: if isOwner(userId);
      }
      match /credentials/{credentialId} {
        allow get, list, create, update, delete: if isOwner(userId);
      }
    }
  }
}
```

---

## 6. Verification & Faculty Project Demonstration Tests

Use these 3 structured tests to prove the cloud infrastructure to your academic evaluator:

### Test 1: Cross-User Multi-Tenant Isolation
- **Objective**: Prove that User A cannot see, query, or mutate User B's documents.
- **Steps**:
  1. Open a regular browser window. Register Account A: `alice@example.com`.
  2. Upload a document titled `Alice Passport 2026.pdf`.
  3. Open an Incognito/Private window. Register Account B: `bob@example.com`.
  4. Notice Bob's documents vault does **NOT** contain Alice's passport.
  5. Attempting to query `/users/{alice_uid}/documents` from Bob's session returns `FirebaseError: Missing or insufficient permissions (403)`.
- **Verdict**: PASS — Strict database path isolation enforced by Firestore Security Rules.

### Test 2: Real Cloud Persistence Across Devices and Refreshes
- **Objective**: Prove that records are stored in Cloud Firestore and Cloud Storage, not browser localStorage.
- **Steps**:
  1. Add a new bill (e.g. `Electricity Bill Oct - $85.00`) and a new subscription (`Figma Professional - $15.00/mo`).
  2. Clear your browser's localStorage using DevTools (`localStorage.clear()`).
  3. Refresh the page (`Ctrl + F5`).
  4. Sign back in with the same email/password.
  5. All documents, bills, and subscriptions are instantly rehydrated via real-time Firestore `onSnapshot` listeners.
- **Verdict**: PASS — Persistent cloud storage confirmed.

### Test 3: Unauthorized Access Prevention
- **Objective**: Prove that unauthenticated requests to the cloud database or storage are rejected.
- **Steps**:
  1. Click the **Sign Out** button in the top navigation bar.
  2. The dashboard switches to protected mode; private vault records are cleared from client memory.
  3. Direct REST or SDK calls without a valid Firebase ID token are rejected with `PERMISSION_DENIED`.
- **Verdict**: PASS — Zero-trust authentication perimeter active.

---

## 7. Production Deployment Recommendations

For production deployment:
1. **Frontend Hosting**:
   Deploy the static build to **Firebase Hosting**:
   ```powershell
   npm run build
   firebase deploy --only hosting
   ```
2. **Backend Express API (Gemini OCR & Assistant)**:
   Deploy `server.ts` to **Google Cloud Run**:
   - Containerized stateless execution with automatic scaling.
   - Configure `GEMINI_API_KEY` via Google Cloud Secret Manager.
   - Direct frontend requests to the Cloud Run backend URL.

---

## 8. Summary of Academic Learning Outcomes

1. **Cloud Architecture**: Multi-tier architecture integrating Google Cloud Platform, Firebase Firestore, Cloud Storage, and Express.js.
2. **Identity & Access Management (IAM)**: OAuth 2.0 PKCE flow, Email/Password password hashing (bcrypt on Firebase), and Zero-Trust ABAC.
3. **NoSQL Data Modeling**: User-centric document hierarchy avoiding root-level data leaks.
4. **Applied AI**: Server-side multimodal document intelligence using Google Gemini 3.8 Flash with structured JSON schemas.
