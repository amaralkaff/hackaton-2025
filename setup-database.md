# Amara AI - Supabase Database Setup

## Prerequisites
- You have a Supabase account and project
- You have the Supabase project URL and anon key in your `.env` file

## Setup Instructions

### 1. Run SQL in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New query**
4. Copy and paste the contents of `database/schema.sql`
5. Click **Run** to execute the script

This will create:
- `borrowers` table - stores borrower information and AI scores
- `field_agents` table - stores field agent information
- `visits` table - stores scheduled and completed visits
- Indexes for performance
- Sample data for testing

### 2. Verify Setup

After running the SQL script, you should see:
- 5 sample borrowers in the `borrowers` table
- 3 sample field agents in the `field_agents` table
- 5 sample visits in the `visits` table

### 3. Environment Variables

Make sure your `.env` file contains:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Start the Application

```bash
npm run dev
```

Your Amara AI application will now connect to the real Supabase database instead of using mock data!

## Features Now Available

✅ **Real Database Operations**
- Create, Read, Update, Delete borrowers
- Track field agent visits
- Real-time data synchronization

✅ **Enhanced Dashboard**
- Live statistics from database
- Actual borrower data
- Real-time visit scheduling

✅ **Production Ready**
- Type-safe database operations
- Error handling
- Optimistic updates (can be added)

## Next Steps (Optional)

- Add authentication with Supabase Auth
- Implement real-time updates with Supabase Realtime
- Add file storage for business/house photos
- Create database functions for AI scoring