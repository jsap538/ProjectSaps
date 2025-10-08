# SAPS Database Schema Documentation

## Overview

This document describes the complete MongoDB database schema for the SAPS marketplace platform. All collections use Mongoose for schema validation and include proper indexes for performance.

## Collections

### 1. Users

Stores user account information, profiles, and settings.

**Fields:**
- `clerkId` (String, unique, indexed) - Clerk authentication ID
- `email` (String, unique, indexed) - User email address
- `firstName` (String) - User's first name
- `lastName` (String) - User's last name
- `username` (String, unique, sparse, indexed) - Optional username
- `profileImageUrl` (String) - Profile picture URL
- `bio` (String, max 500) - User bio/description
- `isSeller` (Boolean, indexed) - Can list items for sale
- `isAdmin` (Boolean) - Admin privileges
- `isVerified` (Boolean) - KYC verified status
- `stripeAccountId` (String) - Stripe Connect account
- `stripeCustomerId` (String) - Stripe Customer ID
- `addresses` (Array) - Shipping addresses
  - `label` (String) - Address name
  - `fullName` (String) - Recipient name
  - `street1` (String) - Street address line 1
  - `street2` (String) - Street address line 2
  - `city` (String) - City
  - `state` (String) - State/province
  - `postalCode` (String) - ZIP/postal code
  - `country` (String) - Country code
  - `phone` (String) - Phone number
  - `isDefault` (Boolean) - Default address
- `defaultShippingAddressIndex` (Number) - Index of default address
- `cart` (Array) - Shopping cart items
  - `itemId` (ObjectId → Item)
  - `quantity` (Number)
  - `addedAt` (Date)
- `watchlist` (Array of ObjectIds → Item) - Favorited items
- `stats` (Object) - User statistics
  - `totalListings` (Number) - Total items listed
  - `totalSold` (Number) - Items sold
  - `totalPurchased` (Number) - Items purchased
  - `totalRevenue` (Number) - Revenue in cents
  - `averageRating` (Number, 0-5) - Average rating
  - `totalReviews` (Number) - Number of reviews
- `followers` (Array of ObjectIds → User) - Users following this user
- `following` (Array of ObjectIds → User) - Users this user follows
- `isActive` (Boolean, indexed) - Account active
- `isSuspended` (Boolean) - Account suspended
- `suspensionReason` (String) - Reason for suspension
- `lastLoginAt` (Date) - Last login timestamp

**Indexes:**
- Single: `clerkId`, `email`, `username`, `isSeller`, `isActive`
- Compound: `{isSeller: 1, isActive: 1}`, `{'stats.averageRating': -1}`
- Text: `username`, `firstName`, `lastName`, `bio`

---

### 2. Items

Product listings on the marketplace.

**Fields:**
- `title` (String, max 100, indexed) - Item title
- `description` (String, max 2000) - Item description
- `brand` (String, indexed) - Brand name
- `price_cents` (Number, min 100, indexed) - Price in cents
- `originalPrice_cents` (Number) - Original price for discounts
- `shipping_cents` (Number, min 0) - Shipping cost
- `acceptsOffers` (Boolean) - Allow price negotiation
- `lowestOfferPrice_cents` (Number) - Minimum acceptable offer
- `images` (Array, 1-10 items) - Product images
  - `url` (String) - Image URL
  - `publicId` (String) - Cloud storage ID
  - `order` (Number) - Display order
  - `isMain` (Boolean) - Primary image
- `condition` (Enum, indexed) - New, Like New, Good, Fair, Poor
- `category` (Enum, indexed) - tie, belt, cufflinks, pocket-square
- `color` (String, indexed) - Color description
- `material` (String) - Material/fabric
- `dimensions` (Object) - Physical measurements
  - `width_cm` (Number)
  - `length_cm` (Number)
  - `height_cm` (Number)
  - `weight_g` (Number)
- `location` (String) - Seller location
- `shipsFrom` (String) - Shipping origin
- `shipsTo` (Array of Strings) - Countries shipped to
- `processingTime_days` (Number, 0-30) - Days to ship
- `sellerId` (ObjectId → User, indexed) - Item owner
- `isActive` (Boolean, indexed) - Available for sale
- `isApproved` (Boolean, indexed) - Admin approved
- `isSold` (Boolean, indexed) - Item sold
- `soldAt` (Date, indexed) - Sale timestamp
- `soldTo` (ObjectId → User) - Buyer
- `isFeatured` (Boolean, indexed) - Featured listing
- `featuredUntil` (Date) - Featured expiration
- `stats` (Object) - Item statistics
  - `views` (Number) - Page views
  - `favorites` (Number) - Watchlist adds
  - `timesShared` (Number) - Social shares
  - `clicks` (Number) - Click count
- `rejectionReason` (String, max 500) - Admin rejection reason
- `moderationNotes` (String, max 1000) - Admin notes

**Indexes:**
- Single: `title`, `brand`, `price_cents`, `condition`, `category`, `color`, `sellerId`, `isActive`, `isApproved`, `isSold`, `soldAt`, `isFeatured`
- Compound: `{isActive: 1, isApproved: 1, isSold: 1}`, `{sellerId: 1, isActive: 1}`, `{category: 1, condition: 1, price_cents: 1}`, etc.
- Text: `title`, `description`, `brand`, `color`, `material`

---

### 3. Orders

Purchase transactions and fulfillment tracking.

**Fields:**
- `orderNumber` (String, unique, indexed) - Customer-facing order ID (e.g., SAPS-20240101-ABCD)
- `buyerId` (ObjectId → User, indexed) - Purchaser
- `sellerId` (ObjectId → User, indexed) - Seller
- `items` (Array) - Ordered items (snapshot)
  - `itemId` (ObjectId → Item)
  - `title` (String) - Title at purchase
  - `brand` (String) - Brand at purchase
  - `price_cents` (Number) - Price at purchase
  - `shipping_cents` (Number) - Shipping at purchase
  - `condition` (String) - Condition
  - `imageUrl` (String) - Main image
  - `quantity` (Number) - Quantity ordered
- `subtotal_cents` (Number) - Items total
- `shipping_cents` (Number) - Shipping total
- `tax_cents` (Number) - Tax amount
- `serviceFee_cents` (Number) - Platform fee
- `total_cents` (Number) - Grand total
- `paymentIntentId` (String) - Stripe payment intent
- `paymentStatus` (Enum, indexed) - pending, processing, paid, failed, refunded, partially_refunded
- `paidAt` (Date) - Payment timestamp
- `shippingAddress` (Object) - Delivery address (snapshot)
  - `fullName`, `street1`, `street2`, `city`, `state`, `postalCode`, `country`, `phone`
- `tracking` (Object) - Shipment tracking
  - `carrier` (String) - Shipping carrier
  - `trackingNumber` (String) - Tracking number
  - `trackingUrl` (String) - Tracking URL
  - `shippedAt` (Date) - Ship date
  - `estimatedDelivery` (Date) - ETA
  - `deliveredAt` (Date) - Delivery date
- `status` (Enum, indexed) - pending, confirmed, processing, shipped, delivered, cancelled, disputed, completed
- `confirmedAt` (Date) - Seller confirmation
- `shippedAt` (Date) - Ship timestamp
- `deliveredAt` (Date) - Delivery timestamp
- `completedAt` (Date) - Completion timestamp
- `cancelledAt` (Date) - Cancellation timestamp
- `cancellationReason` (String, max 500) - Cancel reason
- `isDisputed` (Boolean, indexed) - Dispute flag
- `disputeReason` (String, max 1000) - Dispute details
- `disputedAt` (Date) - Dispute timestamp
- `refund` (Object) - Refund information
  - `amount_cents` (Number) - Refund amount
  - `reason` (String, max 500) - Refund reason
  - `status` (Enum) - pending, approved, rejected, completed
  - `requestedAt` (Date) - Request date
  - `processedAt` (Date) - Process date
  - `processedBy` (ObjectId → User) - Admin
- `buyerNotes` (String, max 500) - Buyer's note
- `sellerNotes` (String, max 500) - Seller's note
- `adminNotes` (String, max 1000) - Admin notes

**Indexes:**
- Single: `orderNumber`, `buyerId`, `sellerId`, `paymentStatus`, `status`, `isDisputed`
- Compound: `{buyerId: 1, status: 1}`, `{sellerId: 1, status: 1}`, `{buyerId: 1, createdAt: -1}`, etc.
- Special: `{'items.itemId': 1}`

---

### 4. Transactions

Financial transactions and payment records.

**Fields:**
- `orderId` (ObjectId → Order, indexed) - Related order
- `buyerId` (ObjectId → User, indexed) - Buyer
- `sellerId` (ObjectId → User, indexed) - Seller
- `type` (Enum, indexed) - payment, refund, payout, fee, adjustment
- `amount_cents` (Number) - Transaction amount
- `platformFee_cents` (Number) - SAPS platform fee
- `stripeFee_cents` (Number) - Stripe fee
- `netAmount_cents` (Number) - Net after fees
- `currency` (String, default USD) - Currency code
- `status` (Enum, indexed) - pending, processing, completed, failed, cancelled
- `stripeDetails` (Object) - Stripe information
  - `chargeId` (String) - Stripe charge ID
  - `paymentIntentId` (String) - Payment intent
  - `refundId` (String) - Refund ID
  - `payoutId` (String) - Payout ID
  - `fee_cents` (Number) - Stripe fee
  - `net_cents` (Number) - Net amount
- `description` (String, max 500) - Transaction description
- `metadata` (Mixed) - Additional data
- `failureCode` (String) - Error code
- `failureMessage` (String, max 500) - Error message
- `processedAt` (Date) - Processing timestamp
- `completedAt` (Date) - Completion timestamp
- `failedAt` (Date) - Failure timestamp

**Indexes:**
- Single: `orderId`, `buyerId`, `sellerId`, `type`, `status`
- Compound: `{orderId: 1, type: 1}`, `{buyerId: 1, status: 1, createdAt: -1}`, etc.
- Special: `{'stripeDetails.paymentIntentId': 1}`

---

### 5. Reviews

User ratings and feedback.

**Fields:**
- `orderId` (ObjectId → Order, indexed) - Order reviewed
- `itemId` (ObjectId → Item, indexed) - Item reviewed
- `reviewerId` (ObjectId → User, indexed) - Reviewer
- `revieweeId` (ObjectId → User, indexed) - Person being reviewed
- `reviewType` (Enum, indexed) - seller or buyer
- `rating` (Number, 1-5, indexed) - Overall rating
- `title` (String, max 100) - Review title
- `comment` (String, max 1000) - Review text
- `communicationRating` (Number, 1-5) - Communication score
- `accuracyRating` (Number, 1-5) - Accuracy score
- `shippingRating` (Number, 1-5) - Shipping speed score
- `isPublished` (Boolean, indexed) - Published status
- `isEdited` (Boolean) - Edit flag
- `editedAt` (Date) - Edit timestamp
- `isFlagged` (Boolean, indexed) - Flagged for review
- `flagReason` (String, max 500) - Flag reason
- `isHidden` (Boolean) - Hidden by admin
- `hiddenReason` (String, max 500) - Hide reason
- `response` (String, max 500) - Seller/buyer response
- `respondedAt` (Date) - Response timestamp
- `helpfulCount` (Number) - Helpful votes
- `notHelpfulCount` (Number) - Not helpful votes

**Indexes:**
- Single: `orderId`, `itemId`, `reviewerId`, `revieweeId`, `reviewType`, `rating`, `isPublished`, `isFlagged`
- Compound: `{revieweeId: 1, isPublished: 1, isHidden: 1}`, `{itemId: 1, isPublished: 1}`, etc.
- Unique: `{reviewerId: 1, revieweeId: 1, orderId: 1}` (prevent duplicates)

---

### 6. Messages

Buyer-seller communication.

**Fields:**
- `conversationId` (String, indexed) - Conversation identifier
- `orderId` (ObjectId → Order, indexed) - Related order (optional)
- `itemId` (ObjectId → Item, indexed) - Related item (optional)
- `senderId` (ObjectId → User, indexed) - Sender
- `recipientId` (ObjectId → User, indexed) - Recipient
- `content` (String, max 2000) - Message text
- `attachments` (Array, max 5) - File attachments
  - `type` (Enum) - image or document
  - `url` (String) - File URL
  - `filename` (String) - Original filename
  - `size_bytes` (Number) - File size
- `type` (Enum, indexed) - text, system, offer
- `isRead` (Boolean, indexed) - Read status
- `readAt` (Date) - Read timestamp
- `isDeleted` (Boolean, indexed) - Soft delete
- `deletedBy` (Array of ObjectIds → User) - Users who deleted
- `isFlagged` (Boolean, indexed) - Flagged for review
- `flagReason` (String, max 500) - Flag reason

**Indexes:**
- Single: `conversationId`, `orderId`, `itemId`, `senderId`, `recipientId`, `type`, `isRead`, `isDeleted`, `isFlagged`
- Compound: `{conversationId: 1, createdAt: -1}`, `{senderId: 1, recipientId: 1, createdAt: -1}`, etc.

---

### 7. Offers

Price negotiation system.

**Fields:**
- `itemId` (ObjectId → Item, indexed) - Item offered on
- `buyerId` (ObjectId → User, indexed) - Buyer making offer
- `sellerId` (ObjectId → User, indexed) - Seller receiving offer
- `offerAmount_cents` (Number, min 100) - Offer amount
- `originalPrice_cents` (Number) - List price when offered
- `message` (String, max 500) - Buyer's message
- `status` (Enum, indexed) - pending, accepted, declined, countered, expired, withdrawn
- `counterOffer_cents` (Number) - Seller's counter amount
- `counterMessage` (String, max 500) - Counter message
- `counteredAt` (Date) - Counter timestamp
- `respondedAt` (Date) - Response timestamp
- `responseMessage` (String, max 500) - Response text
- `expiresAt` (Date, indexed) - Offer expiration (default 48h)
- `orderId` (ObjectId → Order) - Order if accepted
- `acceptedAt` (Date) - Acceptance timestamp

**Indexes:**
- Single: `itemId`, `buyerId`, `sellerId`, `status`, `expiresAt`
- Compound: `{itemId: 1, status: 1}`, `{buyerId: 1, status: 1, createdAt: -1}`, etc.
- Special: `{itemId: 1, buyerId: 1, status: 1}` (prevent duplicate active offers)

---

### 8. Notifications

User alerts and notifications.

**Fields:**
- `userId` (ObjectId → User, indexed) - Notification recipient
- `type` (Enum, indexed) - Notification type (order_placed, order_shipped, offer_received, etc.)
- `title` (String, max 100) - Notification title
- `message` (String, max 500) - Notification text
- `icon` (String) - Icon name/emoji
- `action` (Object) - Click action
  - `label` (String) - Button text
  - `url` (String) - Destination URL
- `relatedOrder` (ObjectId → Order, indexed) - Related order
- `relatedItem` (ObjectId → Item, indexed) - Related item
- `relatedUser` (ObjectId → User, indexed) - Related user
- `relatedOffer` (ObjectId → Offer) - Related offer
- `relatedMessage` (ObjectId → Message) - Related message
- `isRead` (Boolean, indexed) - Read status
- `readAt` (Date) - Read timestamp
- `isArchived` (Boolean, indexed) - Archived status
- `archivedAt` (Date) - Archive timestamp
- `priority` (Enum, indexed) - low, normal, high, urgent
- `sentViaEmail` (Boolean) - Email sent flag
- `sentViaSMS` (Boolean) - SMS sent flag
- `emailSentAt` (Date) - Email timestamp
- `smsSentAt` (Date) - SMS timestamp

**Indexes:**
- Single: `userId`, `type`, `isRead`, `isArchived`, `priority`, `relatedOrder`, `relatedItem`, `relatedUser`
- Compound: `{userId: 1, isRead: 1, createdAt: -1}`, `{userId: 1, isArchived: 1, createdAt: -1}`, etc.

---

## Relationships

```
User (1) → (*) Items (as seller)
User (1) → (*) Orders (as buyer)
User (1) → (*) Orders (as seller)
User (1) → (*) Reviews (as reviewer)
User (1) → (*) Reviews (as reviewee)
User (1) → (*) Messages (as sender)
User (1) → (*) Messages (as recipient)
User (1) → (*) Offers (as buyer)
User (1) → (*) Offers (as seller)
User (1) → (*) Notifications

Item (1) → (*) Orders (via OrderItem)
Item (1) → (*) Reviews
Item (1) → (*) Messages
Item (1) → (*) Offers

Order (1) → (*) Transactions
Order (1) → (*) Reviews
Order (1) → (*) Messages
Order (1) → (0-1) Offer (if from accepted offer)

User (*) → (*) User (followers/following)
User → (0-*) Items (in cart)
User → (0-*) Items (in watchlist)
```

---

## Data Integrity Rules

1. **Cascade Behavior:**
   - User deletion → Anonymize Orders, Reviews, Messages (don't delete)
   - Item deletion → Mark as deleted, preserve in past Orders
   - Order completion → Update User stats, Item sold status

2. **Soft Deletes:**
   - Users: Set `isActive = false`
   - Items: Set `isActive = false`
   - Messages: Add userId to `deletedBy` array

3. **Validation:**
   - All prices must be in cents (min 100 = $1.00)
   - Email addresses must be unique and valid
   - Ratings must be 1-5
   - Images limited to 10 per item
   - Attachments limited to 5 per message

4. **Referential Integrity:**
   - All ObjectId references use proper Mongoose `ref`
   - Use `.populate()` to load related documents
   - Index all foreign key fields

---

## Migration

To migrate existing data to this schema:

```bash
npm run migrate-db
```

This will:
1. Add new fields with default values
2. Convert old data structures to new format
3. Create all indexes
4. Verify migration success

---

## Performance Considerations

1. **Indexes:**
   - All frequently queried fields are indexed
   - Compound indexes for common query patterns
   - Text indexes for search functionality

2. **Denormalization:**
   - Order items snapshot data (title, price, etc.) at purchase time
   - User stats cached on User document
   - Item stats cached on Item document

3. **Pagination:**
   - Always use `.limit()` and `.skip()` for large collections
   - Default limit: 50 items per page

4. **Aggregations:**
   - Use aggregation pipelines for complex queries
   - Calculate statistics on-demand, cache results

---

## Security

1. **Field-level Security:**
   - Never expose sensitive Stripe keys in responses
   - Filter admin fields from public APIs
   - Hash/encrypt sensitive data

2. **Access Control:**
   - Verify user ownership before modifications
   - Check `isAdmin` for admin operations
   - Validate `isSeller` for seller operations

3. **Input Validation:**
   - Use Zod schemas for API input validation
   - Sanitize all user input
   - Validate file uploads

---

## Next Steps

After schema implementation:
1. ✅ Models created
2. ✅ Migration script ready
3. ⏳ Update API routes to use new schema
4. ⏳ Implement multiple image upload
5. ⏳ Build checkout flow
6. ⏳ Add messaging system
7. ⏳ Create offers system
8. ⏳ Build notifications

---

**Last Updated:** 2024
**Schema Version:** 2.0.0

