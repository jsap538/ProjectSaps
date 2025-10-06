# SAPS Setup Guide

## Environment Setup

1. **Copy the environment file:**
   ```bash
   cp env.example .env.local
   ```

2. **Configure your environment variables in `.env.local`:**

   ### Clerk Authentication
   - Go to [Clerk Dashboard](https://dashboard.clerk.com/)
   - Create a new application
   - Copy your publishable key and secret key
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

   ### MongoDB Database
   - Create a MongoDB Atlas account at [mongodb.com](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Get your connection string
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/saps?retryWrites=true&w=majority
   ```

   ### Stripe (Optional for now)
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/)
   - Get your publishable and secret keys
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Test the connection:**
   Visit `http://localhost:3000/api/test-connection` to verify MongoDB connection.

## Database Models

### User Model
- `clerkId`: Unique Clerk user ID
- `email`: User's email address
- `firstName`, `lastName`: User's name
- `isSeller`: Whether user can sell items
- `stripeAccountId`: Connected Stripe account for payouts
- `rating`, `totalSales`: Seller metrics

### Item Model
- `title`, `description`: Item details
- `brand`: Brand name (Drake's, Tom Ford, etc.)
- `price_cents`, `shipping_cents`: Pricing in cents
- `images`: Array of image URLs
- `condition`: New, Like New, Good, Fair, Poor
- `category`: tie, belt, cufflinks, pocket-square
- `sellerId`: Reference to User who listed the item
- `isActive`, `isApproved`: Listing status flags

## Authentication Flow

1. Users can browse without authentication
2. Sign up/Sign in required for selling
3. Protected routes: `/sell`, `/dashboard`, `/profile`, `/my-items`
4. Clerk handles all authentication logic

## Next Steps

1. Set up Clerk webhooks for user sync
2. Create API routes for items CRUD
3. Implement image upload with Cloudinary
4. Add Stripe Connect for seller payouts
5. Build seller dashboard
