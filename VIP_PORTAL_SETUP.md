# VIP Member Portal Setup Guide

## Overview
The VIP Member Portal provides exclusive access to Gold and Platinum tier members with special features including exclusive products, member forum, and downloadable benefits cards.

## Features Implemented

### 1. Tier-Based Access Control
- **VIPAccessGate Component**: Verifies user tier before granting access
- Only Gold and Platinum members can access the portal
- Automatic redirect for non-VIP members to Rewards page

### 2. Exclusive Products Section
- VIP-only products with special discounts (15-25% off)
- Early access to new product drops
- Tier-specific product availability (Gold vs Platinum)

### 3. Member Forum
- Create discussion posts with categories (General, Products, Events)
- Reply to posts with threaded conversations
- Like and engagement tracking
- Real-time updates

### 4. Member Directory
- Browse all VIP members (public profiles only)
- View member tier, points, and bio
- Sorted by total points earned

### 5. Downloadable Benefits Card
- Generate custom VIP membership card
- Includes member name, tier, points, and join date
- Download as PNG for in-store/online use

## Database Schema

### Tables Created:
1. **vip_members** - Member profiles with tier info
2. **vip_forum_posts** - Forum discussion posts
3. **vip_forum_replies** - Replies to forum posts
4. **vip_exclusive_products** - VIP-only product listings

## Edge Functions

### create-forum-post
Creates new forum posts with tier verification.

**Endpoint**: `/functions/v1/create-forum-post`

**Request Body**:
```json
{
  "email": "user@example.com",
  "name": "User Name",
  "title": "Post Title",
  "content": "Post content here",
  "category": "General"
}
```

### add-forum-reply
Adds replies to existing forum posts.

**Endpoint**: `/functions/v1/add-forum-reply`

**Request Body**:
```json
{
  "postId": "uuid-here",
  "email": "user@example.com",
  "name": "User Name",
  "content": "Reply content"
}
```

## Setup Instructions

### 1. User Setup
To grant VIP access to a user, add them to the vip_members table:

```sql
INSERT INTO vip_members (email, name, tier, bio, total_points, is_public)
VALUES ('user@example.com', 'User Name', 'Gold', 'User bio', 5000, true);
```

### 2. Add Exclusive Products
To make a product VIP-exclusive:

```sql
INSERT INTO vip_exclusive_products (product_id, tier_required, launch_date, is_active, discount_percent)
VALUES ('product-id', 'Gold', NOW(), true, 20);
```

### 3. Testing Access
1. Set user email in localStorage: `localStorage.setItem('userEmail', 'gold1@example.com')`
2. Set user name: `localStorage.setItem('userName', 'Test User')`
3. Navigate to `/vip` to access the portal

## User Flow

1. **Access Check**: User navigates to /vip
2. **Tier Verification**: VIPAccessGate checks user tier from database
3. **Portal Access**: If Gold/Platinum, show full portal
4. **Features**:
   - View exclusive products with VIP pricing
   - Create and reply to forum posts
   - Browse member directory
   - Download membership card

## Automatic Tier Upgrades

Users are automatically upgraded to VIP tiers based on loyalty points:
- **Bronze**: 0-1,999 points
- **Silver**: 2,000-4,999 points
- **Gold**: 5,000-9,999 points (VIP access granted)
- **Platinum**: 10,000+ points (VIP access granted)

When a user reaches 5,000 points, they should be added to vip_members table:

```sql
INSERT INTO vip_members (email, name, tier, total_points)
SELECT email, name, 'Gold', total_earned
FROM loyalty_points
WHERE total_earned >= 5000
ON CONFLICT (email) DO UPDATE
SET tier = CASE 
  WHEN EXCLUDED.total_points >= 10000 THEN 'Platinum'
  ELSE 'Gold'
END;
```

## Customization Options

### Forum Categories
Edit categories in VIP.tsx:
```typescript
<SelectItem value="General">General</SelectItem>
<SelectItem value="Products">Products</SelectItem>
<SelectItem value="Events">Events</SelectItem>
```

### Benefits Card Design
Customize card design in MemberBenefitsCard.tsx canvas rendering.

### Exclusive Product Discounts
Adjust discount percentages in vip_exclusive_products table.

## Sample Data Included

- 5 sample VIP members (3 Gold, 2 Platinum)
- 3 sample forum posts with engagement
- 3 exclusive products with various discounts

## Navigation

VIP Portal link added to main navigation header for easy access.

**URL**: `/vip`
