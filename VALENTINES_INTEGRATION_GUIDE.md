# Valentine's Collection Integration Guide

## ✅ What's Been Set Up

### 1. **Product Type Extended**
- Added Valentine's-specific fields to Product interface:
  - `handle` - SEO-friendly slug
  - `compareAtPrice` - Original price for showing discounts
  - `gallery` - Multiple product images
  - `tags` - For SEO and filtering
  - `seoTitle` & `seoDescription` - Meta tags
  - `sizes` - Available sizes array
  - `sizeChart` - Detailed size measurements
  - `inventoryBySize` - Stock levels per size

### 2. **Valentine's Products File**
- Location: `src/data/products.valentines.ts`
- Contains 2 Valentine's products:
  - Love Bomb Classic Tee ($29.99)
  - Heartbreaker Energy Hoodie ($59.00)
- Products auto-merged into main products array

### 3. **Real-Time Stock Tracking**
- Product detail pages now check `inventoryBySize` field first
- Falls back to database inventory for older products
- Shows "Only X left in stock!" warnings when stock is low
- Prevents adding out-of-stock items to cart

### 4. **Size Charts**
- Custom size charts display in product detail accordion
- Shows chest, length, and optional notes per size
- Falls back to default size guide for products without custom charts

## 🎯 How to Use

### Adding More Valentine's Products

Edit `src/data/products.valentines.ts`:

```typescript
{
  id: "val-your-product",
  name: "Your Product Name",
  handle: "your-product-slug",
  category: "Valentines 2025",
  price: 39.99,
  compareAtPrice: 49.99, // Optional - shows discount
  shortDescription: "One-liner description",
  description: "Full product description...",
  image: "https://your-cdn-url.com/image.webp",
  gallery: ["image1.webp", "image2.webp"],
  tags: ["valentines", "gift", "etc"],
  seoTitle: "SEO Title Here",
  seoDescription: "SEO description...",
  sizes: ["XS", "S", "M", "L", "XL"],
  sizeChart: [
    { size: "S", chest: "34-36 in", length: "28 in" },
    // ... more sizes
  ],
  inventoryBySize: {
    XS: 10,
    S: 20,
    M: 25,
    L: 20,
    XL: 15
  },
  gradient: 'from-pink-300 via-rose-400 to-red-500',
}
```

### Updating Stock Levels

**Option 1: In Code (for Valentine's products)**
Edit the `inventoryBySize` object in `products.valentines.ts`

**Option 2: Admin Panel (for database products)**
Go to `/admin` → Inventory tab → Update stock levels

## 📊 Inventory Management

### For Valentine's Products (inventoryBySize)
- Stock tracked in product data file
- Real-time checking on product pages
- No database queries needed
- Update manually in code

### For Regular Products (database)
- Stock tracked in `inventory` table
- Managed via admin panel
- Requires Supabase edge functions
- Auto-updates on purchases

## 🚀 Next Steps to Go Live

1. **Replace Placeholder Images**
   - Generate or upload real product mockups
   - Update image URLs in `products.valentines.ts`

2. **Add More Valentine's Products**
   - Follow the template above
   - Keep inventory numbers realistic

3. **Test Stock Warnings**
   - Set low inventory (< 10) to see amber warnings
   - Set 0 inventory to test out-of-stock prevention

4. **SEO Optimization**
   - Ensure all products have seoTitle and seoDescription
   - Add relevant tags for filtering

5. **Marketing Integration**
   - Use `compareAtPrice` to show savings
   - Highlight limited stock with low inventory
   - Feature Valentine's category on homepage
