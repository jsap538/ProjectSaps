/**
 * Database Migration Script
 * 
 * This script migrates existing data to the new schema structure.
 * Run this ONCE after deploying the new models.
 * 
 * Usage:
 *   npm run migrate-db
 * 
 * Or directly:
 *   npx ts-node scripts/migrate-database.ts
 */

import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';
import User from '../models/User';
import Item from '../models/Item';

async function migrateUsers() {
  console.log('📊 Migrating User collection...');
  
  try {
    const users = await User.find({});
    let updatedCount = 0;
    
    for (const user of users) {
      let needsUpdate = false;
      const updates: any = {};
      
      // Add new fields if missing
      if (!user.stats) {
        updates.stats = {
          totalListings: 0,
          totalSold: 0,
          totalPurchased: 0,
          totalRevenue: 0,
          averageRating: user.rating || 0,
          totalReviews: 0,
        };
        needsUpdate = true;
      }
      
      if (!user.addresses) {
        updates.addresses = [];
        needsUpdate = true;
      }
      
      if (user.isVerified === undefined) {
        updates.isVerified = false;
        needsUpdate = true;
      }
      
      if (!user.followers) {
        updates.followers = [];
        needsUpdate = true;
      }
      
      if (!user.following) {
        updates.following = [];
        needsUpdate = true;
      }
      
      if (user.isActive === undefined) {
        updates.isActive = true;
        needsUpdate = true;
      }
      
      if (user.isSuspended === undefined) {
        updates.isSuspended = false;
        needsUpdate = true;
      }
      
      // Convert old cart itemId strings to ObjectIds if needed
      if (user.cart && user.cart.length > 0) {
        const updatedCart = user.cart.map((item: any) => {
          if (typeof item.itemId === 'string') {
            return {
              ...item,
              itemId: new mongoose.Types.ObjectId(item.itemId),
            };
          }
          return item;
        });
        updates.cart = updatedCart;
        needsUpdate = true;
      }
      
      // Convert old watchlist strings to ObjectIds if needed
      if (user.watchlist && user.watchlist.length > 0) {
        const updatedWatchlist = user.watchlist.map((itemId: any) => {
          if (typeof itemId === 'string') {
            return new mongoose.Types.ObjectId(itemId);
          }
          return itemId;
        });
        updates.watchlist = updatedWatchlist;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await User.updateOne({ _id: user._id }, { $set: updates });
        updatedCount++;
      }
    }
    
    console.log(`✅ User migration complete. Updated ${updatedCount} of ${users.length} users.`);
  } catch (error) {
    console.error('❌ Error migrating users:', error);
    throw error;
  }
}

async function migrateItems() {
  console.log('📊 Migrating Item collection...');
  
  try {
    const items = await Item.find({});
    let updatedCount = 0;
    
    for (const item of items) {
      let needsUpdate = false;
      const updates: any = {};
      
      // Convert old images array to new structure
      if (item.images && item.images.length > 0) {
        const firstImage = item.images[0];
        // Check if it's old format (string) or new format (object)
        if (typeof firstImage === 'string') {
          updates.images = item.images.map((url: string, index: number) => ({
            url,
            order: index,
            isMain: index === 0,
          }));
          needsUpdate = true;
        }
      }
      
      // Add new fields if missing
      if (!item.stats) {
        updates.stats = {
          views: item.views || 0,
          favorites: 0,
          timesShared: 0,
          clicks: 0,
        };
        needsUpdate = true;
      }
      
      if (!item.dimensions) {
        updates.dimensions = {
          width_cm: (item as any).width_cm || undefined,
        };
        needsUpdate = true;
      }
      
      if (item.acceptsOffers === undefined) {
        updates.acceptsOffers = false;
        needsUpdate = true;
      }
      
      if (item.isSold === undefined) {
        updates.isSold = false;
        needsUpdate = true;
      }
      
      if (item.isFeatured === undefined) {
        updates.isFeatured = false;
        needsUpdate = true;
      }
      
      if (!item.shipsTo || item.shipsTo.length === 0) {
        updates.shipsTo = ['US'];
        needsUpdate = true;
      }
      
      if (item.processingTime_days === undefined) {
        updates.processingTime_days = 3;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await Item.updateOne({ _id: item._id }, { $set: updates });
        updatedCount++;
      }
    }
    
    console.log(`✅ Item migration complete. Updated ${updatedCount} of ${items.length} items.`);
  } catch (error) {
    console.error('❌ Error migrating items:', error);
    throw error;
  }
}

async function createIndexes() {
  console.log('📊 Creating database indexes...');
  
  try {
    // Create indexes for all collections
    await User.createIndexes();
    console.log('✅ User indexes created');
    
    await Item.createIndexes();
    console.log('✅ Item indexes created');
    
    console.log('✅ All indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    throw error;
  }
}

async function verifyMigration() {
  console.log('\n📊 Verifying migration...');
  
  try {
    // Count documents
    const userCount = await User.countDocuments();
    const itemCount = await Item.countDocuments();
    
    console.log(`\n📈 Document counts:`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Items: ${itemCount}`);
    
    // Sample a few documents to verify structure
    const sampleUser = await User.findOne();
    const sampleItem = await Item.findOne();
    
    console.log(`\n✅ Sample User has new fields:`);
    console.log(`   - stats: ${!!sampleUser?.stats}`);
    console.log(`   - addresses: ${!!sampleUser?.addresses}`);
    console.log(`   - followers: ${!!sampleUser?.followers}`);
    console.log(`   - following: ${!!sampleUser?.following}`);
    
    console.log(`\n✅ Sample Item has new fields:`);
    console.log(`   - images (structured): ${Array.isArray(sampleItem?.images) && typeof sampleItem?.images[0] === 'object'}`);
    console.log(`   - stats: ${!!sampleItem?.stats}`);
    console.log(`   - dimensions: ${!!sampleItem?.dimensions}`);
    
  } catch (error) {
    console.error('❌ Error verifying migration:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting database migration...\n');
  
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');
    
    // Run migrations
    await migrateUsers();
    await migrateItems();
    
    // Create indexes
    await createIndexes();
    
    // Verify
    await verifyMigration();
    
    console.log('\n✅ Migration completed successfully! 🎉\n');
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export default main;

