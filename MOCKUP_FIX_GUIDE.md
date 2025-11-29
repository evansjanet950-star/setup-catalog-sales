# 🎨 MOCKUP FIX GUIDE — Step-by-Step

## ✅ WHAT YOU NEED TO DO

Your code is **100% working**. The problem is your **uploaded images are blank or have wrong branding**.

You need to:
1. ✏️ Fix 15 mockups in Canva (add proper branding)
2. 📤 Export with NEW filenames
3. ☁️ Upload to CloudFront
4. 🔗 Update products.ts with new URLs
5. 🚀 Redeploy

---

## 📋 PART 1: LOGO PLACEMENT SPECS

### **Logo to Use:**
"WE do.not CARE CLUB" + crown (your full logo)

### **Recommended Sizes by Product:**

| Product | Logo Width | Placement | Notes |
|---------|-----------|-----------|-------|
| **T-Shirts** | 8-10" | Center chest | Classic placement |
| **Hoodies** | 10-12" | Center chest | Larger for oversized |
| **Sweatshirts** | 9-11" | Center chest | Standard size |
| **Tank Tops** | 7-9" | Center chest | Smaller for fit |
| **Long Sleeve** | 8-10" | Center chest | Standard |
| **Tote Bag** | 10-14" | Center front | Large & visible |
| **Coffee Mug** | 3-4" wrap | Center/wrap | Fits mug curve |
| **Cap** | 3-4" | Front panel | Embroidered look |
| **Beanie** | 3-4" | Front cuff | Patch style |
| **Phone Case** | Full bleed | Back of phone | Edge-to-edge |
| **Stickers** | Varies | N/A | Multiple sizes |

---

## 📝 PART 2: CANVA EXPORT CHECKLIST

### **For EACH Product:**

1. **Open your Canva mockup template**
2. **Add your logo:**
   - Upload "WE do.not CARE CLUB" + crown logo
   - Place at correct size (see table above)
   - Ensure it's on the product mockup layer
3. **Check quality:**
   - Logo is crisp and readable
   - Colors match your brand
   - No blur or pixelation
4. **Export Settings:**
   - Format: **WebP** (best for web)
   - Quality: **High** or **100%**
   - Filename: Use NEW name (see Part 3)
5. **Download to your computer**

---

## 📦 PART 3: NEW FILENAMES

Use these **exact filenames** when exporting from Canva:

```
classic-tee-v3.webp
cozy-hoodie-v3.webp
lavender-tee-v3.webp
tote-bag-v3.webp
coffee-mug-v3.webp
crewneck-sweatshirt-v3.webp
vintage-cap-v3.webp
zip-hoodie-v3.webp
tank-top-v3.webp
long-sleeve-v3.webp
beanie-v3.webp
sticker-pack-v3.webp
phone-case-v3.webp
starter-pack-bundle-v3.webp
ultimate-collection-bundle-v3.webp
```

**Why v3?** CloudFront caches aggressively. New filenames = fresh start.

---

## ☁️ PART 4: UPLOAD TO CLOUDFRONT

1. **Log into AWS Console**
2. **Go to S3** (your bucket)
3. **Upload all 15 files** (drag & drop)
4. **Set permissions:** Public read access
5. **Wait 2-3 minutes** for CloudFront to propagate

---

## 🔗 PART 5: UPDATE products.ts

After upload, your new URLs will be:

```
https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_[TIMESTAMP]_[HASH].webp
```

**You need to update 15 URLs in products.ts:**

### **Line-by-Line Updates:**

- **Line 12** (Classic Tee): Replace with new classic-tee-v3.webp URL
- **Line 28** (Cozy Hoodie): Replace with new cozy-hoodie-v3.webp URL
- **Line 44** (Lavender Tee): Replace with new lavender-tee-v3.webp URL
- **Line 59** (Tote Bag): Replace with new tote-bag-v3.webp URL
- **Line 69** (Coffee Mug): Replace with new coffee-mug-v3.webp URL
- **Line 79** (Crewneck): Replace with new crewneck-sweatshirt-v3.webp URL
- **Line 89** (Cap): Replace with new vintage-cap-v3.webp URL
- **Line 100** (Zip Hoodie): Replace with new zip-hoodie-v3.webp URL
- **Line 110** (Tank): Replace with new tank-top-v3.webp URL
- **Line 120** (Long Sleeve): Replace with new long-sleeve-v3.webp URL
- **Line 130** (Beanie): Replace with new beanie-v3.webp URL
- **Line 140** (Stickers): Replace with new sticker-pack-v3.webp URL
- **Line 149** (Phone Case): Replace with new phone-case-v3.webp URL
- **Line 163** (Starter Bundle): Replace with new starter-pack-bundle-v3.webp URL
- **Line 172** (Ultimate Bundle): Replace with new ultimate-collection-bundle-v3.webp URL

### **Also update ASSET_VERSION:**

- **Line 4**: Change `const ASSET_VERSION = 'v=2';` to `'v=3'`

---

## 🚀 PART 6: REDEPLOY

1. Save products.ts
2. Commit changes to Git
3. Push to your hosting (Netlify/Vercel/etc.)
4. Wait for build to complete
5. **Hard refresh your browser** (Ctrl+Shift+R / Cmd+Shift+R)

---

## ✅ VERIFICATION CHECKLIST

After redeploying, check:

- [ ] All 13 products show correct branding
- [ ] Tote bag has logo (not blank)
- [ ] Coffee mug says "WE do.not CARE CLUB" (not "Coffee Carten")
- [ ] All apparel items have crown + text
- [ ] Bundle images look professional
- [ ] No broken images (check browser console)

---

## 🆘 TROUBLESHOOTING

**Q: Images still look old after deploy?**
- Hard refresh (Ctrl+Shift+R)
- Clear browser cache
- Try incognito/private window
- Check you updated ASSET_VERSION to v=3

**Q: CloudFront still serving old images?**
- You used the SAME filename (must use NEW names)
- Create CloudFront invalidation for old paths
- Wait 10-15 minutes for full propagation

**Q: Logo looks blurry on mockups?**
- Export logo at higher resolution from Canva
- Use PNG instead of JPG for logo layer
- Increase mockup export quality to 100%

---

## 💡 PRO TIPS

1. **Work in batches:** Do 5 mockups, test, then do rest
2. **Keep a spreadsheet:** Track old URL → new URL mappings
3. **Use version control:** Commit after each batch
4. **Test locally first:** Run `npm run dev` before deploying
5. **Screenshot working mockups:** Reference for future edits

---

## 📞 NEED HELP?

Just say:
- "Show me the exact code changes for products.ts"
- "Help me with CloudFront upload steps"
- "My tote bag is still blank, what's wrong?"

You've got this! 🎉
