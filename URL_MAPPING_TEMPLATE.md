# CloudFront URL Mapping Template

## Instructions
1. Replace each `[PASTE_URL_HERE]` with the actual CloudFront URL from the designer
2. Copy the entire section for each file
3. Update the corresponding file in the codebase

---

## 📁 File: `src/constants/branding.ts`

### Line 11 - Main Logo URL
```typescript
export const LOGO_CDN_URL = `[PASTE_LOGO_URL_HERE]?${ASSET_VERSION}`;
```

**Example:**
```typescript
export const LOGO_CDN_URL = `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763679658489_7d5155ab.webp?${ASSET_VERSION}`;
```

---

## 📁 File: `src/data/products.ts`

### Product 1: Classic Tee (Lines 13-21)
```typescript
image: `[PASTE_CLASSIC_TEE_URL_HERE]?${ASSET_VERSION}`,
colorImages: {
  'Black': `[PASTE_CLASSIC_TEE_BLACK_URL_HERE]?${ASSET_VERSION}`,
  'White': `[PASTE_CLASSIC_TEE_WHITE_URL_HERE]?${ASSET_VERSION}`,
  'Navy': `[PASTE_CLASSIC_TEE_NAVY_URL_HERE]?${ASSET_VERSION}`,
  'Gray': `[PASTE_CLASSIC_TEE_GRAY_URL_HERE]?${ASSET_VERSION}`,
},
```

### Product 2: Cozy Hoodie (Lines 30-38)
```typescript
image: `[PASTE_COZY_HOODIE_URL_HERE]?${ASSET_VERSION}`,
colorImages: {
  'Black': `[PASTE_COZY_HOODIE_BLACK_URL_HERE]?${ASSET_VERSION}`,
  'Gray': `[PASTE_COZY_HOODIE_GRAY_URL_HERE]?${ASSET_VERSION}`,
  'Navy': `[PASTE_COZY_HOODIE_NAVY_URL_HERE]?${ASSET_VERSION}`,
  'Burgundy': `[PASTE_COZY_HOODIE_BURGUNDY_URL_HERE]?${ASSET_VERSION}`,
},
```

### Product 3: Lavender Tee (Lines 47-54)
```typescript
image: `[PASTE_LAVENDER_TEE_URL_HERE]?${ASSET_VERSION}`,
colorImages: {
  'Lavender': `[PASTE_LAVENDER_TEE_LAVENDER_URL_HERE]?${ASSET_VERSION}`,
  'Pink': `[PASTE_LAVENDER_TEE_PINK_URL_HERE]?${ASSET_VERSION}`,
  'Mint': `[PASTE_LAVENDER_TEE_MINT_URL_HERE]?${ASSET_VERSION}`,
},
```

### Product 4: Tote Bag (Line 63)
```typescript
image: `[PASTE_TOTE_BAG_URL_HERE]?${ASSET_VERSION}`,
```

### Product 5: Coffee Mug (Line 74)
```typescript
image: `[PASTE_COFFEE_MUG_URL_HERE]?${ASSET_VERSION}`,
```

### Product 6: Crewneck Sweatshirt (Line 86)
```typescript
image: `[PASTE_CREWNECK_URL_HERE]?${ASSET_VERSION}`,
```

### Product 7: Vintage Cap (Line 97)
```typescript
image: `[PASTE_VINTAGE_CAP_URL_HERE]?${ASSET_VERSION}`,
```

### Product 8: Zip Hoodie (Line 108)
```typescript
image: `[PASTE_ZIP_HOODIE_URL_HERE]?${ASSET_VERSION}`,
```

### Product 9: Tank Top (Line 118)
```typescript
image: `[PASTE_TANK_TOP_URL_HERE]?${ASSET_VERSION}`,
```

### Product 10: Long Sleeve (Line 130)
```typescript
image: `[PASTE_LONG_SLEEVE_URL_HERE]?${ASSET_VERSION}`,
```

### Product 11: Beanie (Line 142)
```typescript
image: `[PASTE_BEANIE_URL_HERE]?${ASSET_VERSION}`,
```

### Product 12: Sticker Pack (Line 153)
```typescript
image: `[PASTE_STICKER_PACK_URL_HERE]?${ASSET_VERSION}`,
```

### Product 13: Phone Case (Line 164)
```typescript
image: `[PASTE_PHONE_CASE_URL_HERE]?${ASSET_VERSION}`,
```

### Bundle 1: Starter Pack (Line 180)
```typescript
image: `[PASTE_STARTER_PACK_BUNDLE_URL_HERE]?${ASSET_VERSION}`,
```

### Bundle 2: Ultimate Collection (Line 191)
```typescript
image: `[PASTE_ULTIMATE_COLLECTION_BUNDLE_URL_HERE]?${ASSET_VERSION}`,
```

---

## 🔄 After Updating URLs

### Step 1: Increment Asset Version
In both `src/constants/branding.ts` (line 8) and `src/data/products.ts` (line 4):
```typescript
const ASSET_VERSION = 'v=4'; // Change from v=3 to v=4
```

### Step 2: Test the Site
1. Clear browser cache
2. Reload the site
3. Verify all images load correctly
4. Check product detail pages
5. Verify color variants display properly

---

## 📋 Quick Reference Checklist

- [ ] Logo URL updated in `branding.ts`
- [ ] 13 product main images updated
- [ ] Color variant images updated (Classic Tee, Cozy Hoodie, Lavender Tee)
- [ ] 2 bundle images updated
- [ ] Asset version incremented to v=4
- [ ] Site tested and images loading
- [ ] All product pages display correctly

---

## 💡 Pro Tips

1. **Keep the `?${ASSET_VERSION}` suffix** - this forces browser cache refresh
2. **Use Find & Replace** - Search for old URLs and replace with new ones
3. **Test one product first** - Update one product, test it, then do the rest
4. **Backup before changes** - Git commit before updating URLs
5. **Check mobile view** - Ensure images look good on all screen sizes
