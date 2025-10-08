# Database Migration Guide

## Overview

This guide explains how to migrate your existing SAPS database to the new optimized schema with proper foreign keys, indexes, and relationships.

## What's New in Schema 2.0?

### User Model Enhancements
- ✨ **User Statistics** - Track listings, sales, purchases, and revenue
- ✨ **Addresses System** - Support multiple shipping addresses
- ✨ **Social Features** - Followers and following
- ✨ **Account Status** - Better suspension and verification tracking
- ✨ **Proper ObjectId References** - Cart and watchlist now use ObjectIds instead of strings

### Item Model Enhancements
- ✨ **Multiple Images** - Support 1-10 images per item with metadata
- ✨ **Item Statistics** - Track views, favorites, shares, and clicks
- ✨ **Dimensions Object** - Structured measurements
- ✨ **Offer System** - Support for price negotiation
- ✨ **Sold Tracking** - Track when and to whom items are sold
- ✨ **Featured Items** - Promote listings

### New Collections
- 🆕 **Orders** - Complete order lifecycle management
- 🆕 **Transactions** - Financial transaction records
- 🆕 **Reviews** - User ratings and feedback
- 🆕 **Messages** - Buyer-seller communication
- 🆕 **Offers** - Price negotiation system
- 🆕 **Notifications** - User alerts and updates

---

## Prerequisites

Before migrating:

1. **Backup your database** (CRITICAL!)
   ```bash
   mongodump --uri="your-mongodb-uri" --out=./backup-$(date +%Y%m%d)
   ```

2. **Install ts-node** (if not already installed)
   ```bash
   npm install
   ```

3. **Set environment variables**
   - Ensure `.env.local` has `MONGODB_URI` set correctly

---

## Migration Steps

### Step 1: Review Current Data

Check what you currently have:
```bash
# Connect to MongoDB
mongosh "your-mongodb-uri"

# Check counts
use your-database-name
db.users.countDocuments()
db.items.countDocuments()
```

### Step 2: Run Migration Script

The migration script will:
- Add new fields to existing documents
- Convert data structures (e.g., string IDs to ObjectIds)
- Create database indexes
- Verify the migration

**Run the migration:**
```bash
npm run migrate-db
```

**Expected output:**
```
🚀 Starting database migration...

✅ Connected to MongoDB

📊 Migrating User collection...
✅ User migration complete. Updated X of Y users.

📊 Migrating Item collection...
✅ Item migration complete. Updated X of Y items.

📊 Creating database indexes...
✅ User indexes created
✅ Item indexes created
✅ All indexes created successfully

📊 Verifying migration...

📈 Document counts:
   Users: X
   Items: Y

✅ Sample User has new fields:
   - stats: true
   - addresses: true
   - followers: true
   - following: true

✅ Sample Item has new fields:
   - images (structured): true
   - stats: true
   - dimensions: true

✅ Migration completed successfully! 🎉

✅ Database connection closed
```

### Step 3: Verify Migration

After migration, verify your data:

```bash
mongosh "your-mongodb-uri"
```

```javascript
// Check a sample user
db.users.findOne()

// Verify new fields exist
db.users.findOne({}, {
  stats: 1,
  addresses: 1,
  followers: 1,
  following: 1
})

// Check a sample item
db.items.findOne()

// Verify images structure
db.items.findOne({}, { images: 1 })

// Verify indexes were created
db.users.getIndexes()
db.items.getIndexes()
```

### Step 4: Test Your Application

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Test key features:**
   - ✅ User login/signup
   - ✅ View items
   - ✅ Add to cart
   - ✅ Add to watchlist
   - ✅ Create listing (test image upload)
   - ✅ View profile

3. **Check for errors:**
   - Monitor browser console
   - Check terminal for API errors
   - Verify data displays correctly

---

## Rollback (If Needed)

If something goes wrong:

### Option 1: Restore from Backup
```bash
mongorestore --uri="your-mongodb-uri" --dir=./backup-YYYYMMDD
```

### Option 2: Manual Cleanup

If you need to remove only the new fields:

```javascript
// Remove new User fields
db.users.updateMany({}, {
  $unset: {
    stats: "",
    addresses: "",
    followers: "",
    following: "",
    isVerified: "",
    isSuspended: "",
    suspensionReason: "",
    lastLoginAt: "",
    stripeCustomerId: "",
    defaultShippingAddressIndex: "",
    bio: ""
  }
})

// Remove new Item fields
db.items.updateMany({}, {
  $unset: {
    stats: "",
    dimensions: "",
    acceptsOffers: "",
    lowestOfferPrice_cents: "",
    originalPrice_cents: "",
    isSold: "",
    soldAt: "",
    soldTo: "",
    isFeatured: "",
    featuredUntil: "",
    shipsFrom: "",
    shipsTo: "",
    processingTime_days: "",
    rejectionReason: "",
    moderationNotes: ""
  }
})
```

---

## API Route Updates

After migrating the database, you'll need to update your API routes to use the new schema. Here's what needs updating:

### Critical Updates (Do These First)

1. **Cart API** (`app/api/cart/*`)
   - Update to use ObjectIds instead of strings
   - Handle new cart item structure

2. **Item Upload API** (`app/api/upload/route.ts`)
   - Support multiple image uploads
   - Create proper image structure

3. **Item Listing API** (`app/api/items/route.ts`)
   - Populate new fields in responses
   - Filter by new status fields

4. **Profile API** (`app/api/profile/*`)
   - Return new user stats
   - Handle addresses

### Nice to Have (Implement Later)

1. **Orders API** - Create new endpoints
2. **Reviews API** - Create new endpoints
3. **Messages API** - Create new endpoints
4. **Offers API** - Create new endpoints
5. **Notifications API** - Create new endpoints

---

## Common Issues & Solutions

### Issue: Migration script fails with "Cannot connect to MongoDB"

**Solution:**
```bash
# Check your .env.local file
cat .env.local | grep MONGODB_URI

# Test connection
mongosh "your-mongodb-uri"
```

### Issue: "Cannot find module 'ts-node'"

**Solution:**
```bash
npm install --save-dev ts-node
```

### Issue: Some documents weren't updated

**Solution:**
```bash
# Re-run migration (it's safe to run multiple times)
npm run migrate-db
```

### Issue: Cart items showing as strings instead of ObjectIds

**Solution:**
The migration script handles this automatically. If you still see strings:
```javascript
// Manual fix
db.users.updateMany({}, [{
  $set: {
    cart: {
      $map: {
        input: "$cart",
        as: "item",
        in: {
          itemId: { $toObjectId: "$$item.itemId" },
          quantity: "$$item.quantity",
          addedAt: "$$item.addedAt"
        }
      }
    }
  }
}])
```

### Issue: Images still showing as strings

**Solution:**
```javascript
// Manual fix for items
db.items.updateMany({
  "images.0": { $type: "string" }
}, [{
  $set: {
    images: {
      $map: {
        input: "$images",
        as: "img",
        in: {
          url: "$$img",
          order: { $indexOfArray: ["$images", "$$img"] },
          isMain: { $eq: [{ $indexOfArray: ["$images", "$$img"] }, 0] }
        }
      }
    }
  }
}])
```

---

## Performance Tips

After migration, you can improve performance:

1. **Rebuild Indexes** (if needed)
   ```javascript
   db.users.reIndex()
   db.items.reIndex()
   ```

2. **Analyze Query Performance**
   ```javascript
   // Test a slow query
   db.items.find({ isActive: true, isApproved: true })
     .explain("executionStats")
   ```

3. **Add Compound Indexes** for your specific queries
   ```javascript
   // Example: If you frequently query by brand and condition
   db.items.createIndex({ brand: 1, condition: 1, price_cents: 1 })
   ```

---

## Next Steps After Migration

1. ✅ **Implement Multiple Image Upload**
   - Update upload component
   - Handle image array in API
   - Update item display to show multiple images

2. ✅ **Update API Routes**
   - Add proper population for relationships
   - Filter new fields appropriately
   - Add validation for new fields

3. ✅ **Add New Features**
   - Checkout flow using Orders model
   - Messaging system using Messages model
   - Reviews system using Reviews model
   - Offer negotiation using Offers model

4. ✅ **Update Frontend Components**
   - Show user stats on profile
   - Display multiple images in listings
   - Add address management
   - Show notifications

---

## Support

If you encounter issues:

1. Check the error message carefully
2. Review the [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md) documentation
3. Verify your MongoDB connection
4. Ensure all dependencies are installed
5. Check that your .env.local is configured correctly

---

**Last Updated:** 2024
**Migration Version:** 2.0.0

