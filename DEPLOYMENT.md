# 🚀 FinFlex One-Click Deployment Guide (Netlify + Serverless)

The FinFlex platform has been migrated to a serverless architecture, optimized for Netlify, Supabase, and Firebase. This ensures a "One-Click" deployment experience without managing a custom Node.js server.

## 1. Backend Infrastructure

### A. Supabase (Data & Realtime)
1. Create a project at [Supabase](https://supabase.com).
2. Create the following tables in the SQL Editor:
   ```sql
   -- activity_logs table
   CREATE TABLE activity_logs (
     id SERIAL PRIMARY KEY,
     user_id TEXT,
     action TEXT,
     metadata JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );

   -- orders table
   CREATE TABLE orders (
     id SERIAL PRIMARY KEY,
     user_id TEXT,
     symbol TEXT,
     type TEXT,
     side TEXT,
     quantity NUMERIC,
     price NUMERIC,
     status TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );

   -- positions table
   CREATE TABLE positions (
     id SERIAL PRIMARY KEY,
     user_id TEXT,
     symbol TEXT,
     quantity NUMERIC,
     average_price NUMERIC,
     unrealized_pnl NUMERIC DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );

   -- Enable Realtime for the 'broadcast' channel in your project settings.
   ```

### B. Firebase (Auth & Wallet)
1. Set up a Firebase project and enable **Firestore** and **Google Auth**.
2. Copy your configuration to `firebase-applet-config.json`.

## 2. Netlify Deployment

1. **Connect Repository**: Push your code to GitHub/GitLab and connect it to Netlify.
2. **Environment Variables**: Add the following in Netlify Dashboard:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL.
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
   - `VITE_FIREBASE_API_KEY`, etc. (or ensure `firebase-applet-config.json` is bundled).
   - `GEMINI_API_KEY`: Required for AI Assistant.
3. **Build Settings**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. **Deploy**: Netlify will automatically handle SPA routing via the included `netlify.toml`.

## 3. Local Development

```bash
npm install
npm run dev
```

The app now communicates directly with Supabase and Firebase from the browser, eliminating the need for a custom API server.

