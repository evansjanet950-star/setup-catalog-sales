import { Product, Bundle } from '../types/product';
import { valentinesProducts } from './products.valentines';

// Asset cache version - increment to force refresh across entire site
const ASSET_VERSION = 'v=4';


export const products: Product[] = [
  {
    id: '1',
    name: 'WE do.not CARE CLUB Classic Tee (Crown Logo)',
    description: 'Join the movement with the original look. This crisp white tee features our signature pink crown and a defiant font blend — because not caring never looked so iconic.',
    price: 28.99,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763757359831_5be1e5a5.webp?${ASSET_VERSION}`,
    category: 'Apparel',
    colors: ['Black', 'White', 'Navy', 'Gray'],
    gradient: 'from-slate-800 via-gray-700 to-slate-900',
    colorImages: {
      'Black': `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763682359745_aa67c7e1.webp?${ASSET_VERSION}`,
      'White': `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763757359831_5be1e5a5.webp?${ASSET_VERSION}`,
      'Navy': `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763682359745_aa67c7e1.webp?${ASSET_VERSION}`,
      'Gray': `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763682359745_aa67c7e1.webp?${ASSET_VERSION}`,
    },
    shortDescription: 'Bold, breathable, and built for every vibe. Join the club and wear it proud.',
    features: ['Unisex fit for all body types', 'Lightweight yet durable cotton blend', 'Crown logo printed front & center', 'Available in black, white, and multicolor statement options', 'Tagless for ultimate comfort'],
    materials: '100% ring-spun cotton',
    care: 'Machine wash cold, tumble dry low. Pre-shrunk to maintain shape.',
    styleTips: 'Pair it with ripped jeans, biker shorts, or a longline flannel — this tee talks louder than your mood ever needs to. Let \'em know you don\'t care — stylishly.',
  },



  {
    id: '2',
    name: 'WE do.not CARE CLUB Cozy Hoodie',
    description: 'Wrap yourself in unapologetic comfort. This bold black hoodie features the iconic WE do.not CARE CLUB design with a pink-and-white crown twist. Oversized, empowering, and made for cool days and cooler attitudes.',
    price: 54.99,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763757360736_b6e245ad.webp?${ASSET_VERSION}`,
    category: 'Apparel',
    colors: ['Black', 'Navy', 'White'],
    gradient: 'from-gray-800 via-slate-700 to-gray-900',
    colorImages: {
      'Black': `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763757360736_b6e245ad.webp?${ASSET_VERSION}`,
      'Navy': `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763682357987_941c0253.webp?${ASSET_VERSION}`,
      'White': `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763682357987_941c0253.webp?${ASSET_VERSION}`,
    },
    shortDescription: 'Oversized comfort meets loud energy. The hoodie that matches your vibe.',
    features: ['Relaxed fit with kangaroo pocket', 'Lined hood with drawstrings', 'Soft fleece interior for cozy wear', 'WE do.not CARE CLUB crown design on chest', 'Comes in black, navy, white, and multicolor options'],
    materials: '50% cotton / 50% poly fleece',
    care: 'Machine wash warm inside-out. Avoid ironing design directly.',
    styleTips: 'This one\'s made for chill days, bold posts, and not explaining yourself. Throw it on with leggings or joggers and go about your day unbothered.',
  },



  {
    id: '3',
    name: 'WE do.not CARE CLUB Lavender Tee (Limited Edition)',
    description: 'Soft lavender. Loud message. This tee puts your crown on full display with bold black text and a pop of hot pink. Perfect for layering or making a statement on its own. Lightweight, defiant, and totally wearable.',
    price: 28.99,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1764101840459_d8bd5ab8.webp?${ASSET_VERSION}`,
    category: 'Apparel',
    colors: ['Lavender', 'Pink', 'Mint'],
    gradient: 'from-purple-300 via-lavender-400 to-purple-500',
    colorImages: {
      'Lavender': `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1764101840459_d8bd5ab8.webp?${ASSET_VERSION}`,
      'Pink': `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763682358867_313c8b39.webp?${ASSET_VERSION}`,
      'Mint': `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763682358867_313c8b39.webp?${ASSET_VERSION}`,
    },
    shortDescription: 'Because soft can still be savage. Limited-run pastel tee with attitude.',
    features: ['Ultra-soft cotton in trending lavender', 'Slim unisex cut', 'Crown logo in bold white', 'Breathable and flattering fit'],
    materials: '100% cotton',
    care: 'Gentle wash cycle. Air dry recommended to protect print.',
    styleTips: 'Looks sweet, hits different. Tuck it, crop it, layer it — this lavender staple makes indifference look good.',
  },



  {
    id: '4',
    name: 'Minimalist Crown Tote – WE do.not CARE CLUB',
    description: 'Less drama, more tote. This clean canvas carry-all is for queens (and kings) who pack light but think big. Crowned with subtle style and the WE do.not CARE CLUB mantra.',
    price: 24.99,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763679650786_f936c979.webp?${ASSET_VERSION}`,
    category: 'Accessories',
    colors: ['Natural', 'Black', 'Navy', 'Gray'],
    gradient: 'from-amber-100 via-beige-200 to-tan-300',
  },

  {
    id: '5',
    name: 'WE do.not CARE CLUB Mug (Crown Design)',
    description: 'Sip with sass. This white ceramic mug is crowned with attitude and perfect for your daily dose of coffee, tea, or "leave me alone" vibes.',
    price: 16.99,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1764101841371_938a091d.webp?${ASSET_VERSION}`,
    category: 'Home',
    colors: ['White', 'Black'],
    gradient: 'from-white via-gray-100 to-gray-200',
    colorImages: {
      'White': `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1764101841371_938a091d.webp?${ASSET_VERSION}`,
      'Black': `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763682361464_f5798ac9.webp?${ASSET_VERSION}`,
    },
    shortDescription: 'Sip, scroll, and stay unbothered. Mornings just got messier (in the best way).',
    features: ['11oz glossy ceramic mug', 'Black or white base with crown graphic', 'Dishwasher & microwave safe', 'Sturdy C-handle'],
    materials: 'Ceramic, premium grade',
    care: 'Top-rack dishwasher safe. Microwave friendly.',
    styleTips: 'Gift it to a savage friend or keep it for your coffee-fueled clapbacks. No weak sips allowed.',
  },



  {
    id: '6',
    name: 'WE do.not CARE CLUB Crewneck Sweatshirt',
    description: 'All the warmth, none of the worry. This cozy crewneck features the pink crown logo and WE do.not CARE CLUB branding. Chill-proof and drama-free.',
    price: 44.99,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1764101842264_0d268336.webp?${ASSET_VERSION}`,
    category: 'Apparel',
    colors: ['Navy', 'Charcoal', 'Cream', 'Black'],
    gradient: 'from-blue-900 via-navy-800 to-slate-900',
    colorImages: {
      'Navy': `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1764101842264_0d268336.webp?${ASSET_VERSION}`,
      'Charcoal': `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763682360613_aa4e763e.webp?${ASSET_VERSION}`,
      'Cream': `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763682360613_aa4e763e.webp?${ASSET_VERSION}`,
      'Black': `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763682360613_aa4e763e.webp?${ASSET_VERSION}`,
    },
    shortDescription: 'Classic crewneck, unapologetic attitude. The comfiest way to make a statement.',
    features: ['Ribbed collar, cuffs & waistband', 'Midweight warmth for all seasons', 'Bold crown logo printed across chest', 'Available in charcoal, cream, and black'],
    materials: '60% cotton / 40% polyester',
    care: 'Wash cold with like colors. Hang dry for longevity.',
    styleTips: 'Layer it over a collared shirt or rock it solo — this sweatshirt doesn\'t just keep you warm, it keeps you real.',
  },



  {
    id: '7',
    name: 'WE do.not CARE CLUB Baseball Cap (Black & White Options)',
    description: 'Clean. Classic. Crowned. This sleek cap with subtle embroidered crown detail is your new go-to for shade and style.',
    price: 29.99,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1764101843158_1966014f.webp?${ASSET_VERSION}`,
    category: 'Accessories',
    colors: ['Black', 'White'],
    gradient: 'from-slate-800 via-gray-900 to-black',
    colorImages: {
      'Black': `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1764101843158_1966014f.webp?${ASSET_VERSION}`,
      'White': `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1764101844088_5c079459.webp?${ASSET_VERSION}`,
    },
    shortDescription: 'Lowkey fit. Highkey message. A cap that throws shade — literally and figuratively.',
    features: ['Adjustable back strap', 'Embroidered crown + CLUB logo', 'Available in classic black or crisp white', 'Pre-curved brim'],
    materials: '100% cotton twill',
    care: 'Spot clean with mild soap. Do not bleach.',
    styleTips: 'Throw it on with anything, go everywhere. From gym to grocery store, this cap does the talking.',
  },


  {
    id: '8',
    name: 'WE do.not CARE CLUB White Baseball Cap',
    description: 'Light cap, heavy vibes. White hat with black embroidered logo for a sharp contrast.',
    price: 29.99,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1764101844088_5c079459.webp?${ASSET_VERSION}`,
    category: 'Accessories',
    colors: ['White', 'Black'],
    gradient: 'from-white via-gray-100 to-gray-200',
    colorImages: {
      'White': `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1764101844088_5c079459.webp?${ASSET_VERSION}`,
      'Black': `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1764101843158_1966014f.webp?${ASSET_VERSION}`,
    },
    shortDescription: 'Light cap, heavy vibes. White hat with black embroidered logo for a sharp contrast.',
    features: ['Adjustable back strap', 'Embroidered crown + CLUB logo', 'Breathable cotton, adjustable fit', 'Pre-curved visor'],
    materials: '100% cotton twill',
    care: 'Spot clean only. Do not bleach.',
    styleTips: 'Throw this on during your silent treatment era. Looks clean, feels mean (in a good way).',
  },



  {
    id: '9',
    name: 'Zip Hoodie',
    description: 'Full-zip hoodie with signature design',
    price: 59.99,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763528155377_278113e3.webp?${ASSET_VERSION}`,
    category: 'Apparel',
    colors: ['Black', 'Gray', 'Navy'],
    gradient: 'from-gray-800 via-slate-900 to-black',
  },

  {
    id: '10',
    name: 'Tank Top',
    description: 'Breezy tank for warm weather',
    price: 24.99,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763682362347_de80ca27.webp?${ASSET_VERSION}`,
    category: 'Apparel',
    colors: ['White', 'Black', 'Gray'],
    gradient: 'from-white via-gray-50 to-gray-100',
  },

  {
    id: '11',
    name: 'Long Sleeve',
    description: 'Classic long sleeve with logo',
    price: 34.99,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763682371934_876b080e.webp?${ASSET_VERSION}`,
    category: 'Apparel',
    colors: ['Navy', 'Black', 'White'],
    gradient: 'from-blue-900 via-navy-800 to-indigo-900',
  },

  {
    id: '12',
    name: 'Beanie',
    description: 'Cozy beanie with crown patch',
    price: 22.99,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763682372876_1e4e86f7.webp?${ASSET_VERSION}`,
    category: 'Accessories',

    colors: ['Black', 'Gray', 'Navy'],
    gradient: 'from-gray-800 via-slate-900 to-black',
  },

  {
    id: '13',
    name: 'Sticker Pack',
    description: 'Set of vinyl stickers with logo variations',
    price: 9.99,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763682374700_7a6009d7.webp?${ASSET_VERSION}`,
    category: 'Accessories',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
  },

  {
    id: '14',
    name: 'Phone Case',
    description: 'Protect your phone in style',
    price: 19.99,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763682373779_b48262a6.webp?${ASSET_VERSION}`,
    category: 'Accessories',
    gradient: 'from-transparent via-gray-50 to-gray-100',
  },


  {
    id: '18',
    name: 'WE do.not CARE CLUB Classic Tee – Black',
    price: 27.99,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763935148044_e7c29433.webp?${ASSET_VERSION}`,
    category: 'Fashion',
    description: 'Bold black cotton tee with the iconic WE do.not CARE CLUB crown logo. Say less. Wear the attitude.',
    materials: '100% combed cotton. Machine washable.',
    shortDescription: 'Bold black cotton tee with the iconic WE do.not CARE CLUB crown logo.',
    features: ['100% combed cotton', 'Machine washable', 'Unisex sizing S–XXL', 'Crown logo front print', 'Tagless comfort'],
    care: 'Machine wash cold, tumble dry low',
    gradient: 'from-slate-900 via-gray-800 to-black',
  },
  {
    id: '19',
    name: 'WE do.not CARE CLUB Classic Tee – White',
    price: 27.99,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763935149015_ef430602.webp?${ASSET_VERSION}`,
    category: 'Fashion',
    description: 'Crisp white tee featuring the WE do.not CARE CLUB crown logo. Minimalist, unapologetic, iconic.',
    materials: '100% combed cotton. Machine washable.',
    shortDescription: 'Crisp white tee featuring the WE do.not CARE CLUB crown logo.',
    features: ['100% combed cotton', 'Machine washable', 'Unisex sizing S–XXL', 'Crown logo front print', 'Tagless comfort'],
    care: 'Machine wash cold, tumble dry low',
    gradient: 'from-white via-gray-100 to-gray-200',
  },
  {
    id: '20',
    name: 'WE do.not CARE CLUB Cozy Hoodie – Black',
    price: 48.99,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763935149868_50157c7b.webp?${ASSET_VERSION}`,
    category: 'Fashion',
    description: 'Ultra-soft fleece hoodie with pouch pocket and the WE do.not CARE CLUB crown emblem. Oversized and defiant.',
    materials: '50/50 cotton-poly blend. Preshrunk.',
    shortDescription: 'Ultra-soft fleece hoodie with the WE do.not CARE CLUB crown emblem.',
    features: ['50/50 cotton-poly blend', 'Preshrunk', 'Unisex sizing S–XXL', 'Kangaroo pouch pocket', 'Lined hood with drawstrings'],
    care: 'Machine wash warm inside-out',
    gradient: 'from-slate-900 via-gray-800 to-black',
  },
  {
    id: '21',
    name: 'WE do.not CARE CLUB Cozy Hoodie – White',
    price: 48.99,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763935150738_6d056455.webp?${ASSET_VERSION}`,
    category: 'Fashion',
    description: 'Clean and powerful – this white fleece hoodie wears the WE do.not CARE CLUB logo with pride. Streetwear with purpose.',
    materials: '50/50 cotton-poly blend. Preshrunk.',
    shortDescription: 'White fleece hoodie with the WE do.not CARE CLUB logo.',
    features: ['50/50 cotton-poly blend', 'Preshrunk', 'Unisex sizing S–XXL', 'Kangaroo pouch pocket', 'Lined hood with drawstrings'],
    care: 'Machine wash warm inside-out',
    gradient: 'from-white via-gray-100 to-gray-200',
  },
  {
    id: '22',
    name: 'WE do.not CARE CLUB Crewneck Sweatshirt – Black',
    price: 42.99,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763935151607_c44f3521.webp?${ASSET_VERSION}`,
    category: 'Fashion',
    description: 'Premium black crewneck sweatshirt with embroidered crown design. Effortlessly cool. Unbothered.',
    materials: 'Cotton/poly fleece blend. Machine washable.',
    shortDescription: 'Premium black crewneck with embroidered crown design.',
    features: ['Cotton/poly fleece blend', 'Machine washable', 'Unisex sizing S–XXL', 'Ribbed collar, cuffs & waistband', 'Embroidered crown logo'],
    care: 'Machine wash cold, hang dry',
    gradient: 'from-slate-900 via-gray-800 to-black',
  },
  {
    id: '23',
    name: 'WE do.not CARE CLUB Ceramic Mug',
    price: 14.99,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1764101841371_938a091d.webp?${ASSET_VERSION}`,
    category: 'Home',
    description: 'White ceramic mug with WE do.not CARE CLUB crown graphic. Sip the truth. Start your day right.',
    materials: 'Glossy ceramic. Dishwasher safe.',
    shortDescription: 'White ceramic mug with WE do.not CARE CLUB crown graphic.',
    features: ['11 oz capacity', 'Glossy ceramic finish', 'Dishwasher & microwave safe', 'Sturdy C-handle', 'Crown graphic design'],
    care: 'Top-rack dishwasher safe. Microwave friendly.',
    gradient: 'from-white via-gray-100 to-gray-200',
  },
  {
    id: '24',
    name: 'WE do.not CARE CLUB Baseball Hat – Black',
    price: 22.99,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1764101843158_1966014f.webp?${ASSET_VERSION}`,
    category: 'Fashion',
    description: 'Black cap embroidered with full WE do.not CARE CLUB logo. Low profile, high impact.',
    materials: '100% cotton twill. Adjustable strap.',
    shortDescription: 'Black cap embroidered with full WE do.not CARE CLUB logo.',
    features: ['100% cotton twill', 'Adjustable back strap', 'One size fits most', 'Embroidered crown + CLUB logo', 'Pre-curved brim'],
    care: 'Spot clean with mild soap. Do not bleach.',
    gradient: 'from-slate-900 via-gray-800 to-black',
  },
  // Add Valentine's Collection products
  ...valentinesProducts,
];



export const bundles: Bundle[] = [
  {
    id: 'bundle-1',
    name: 'WE do.not CARE CLUB Bundle Pack (Fan Favourite Set)',
    description: 'Get the tee, hoodie, and mug in one badass bundle — and save while you slay. Includes: 1 Classic Tee (black), 1 Cozy Hoodie (white), 1 Mug. Comes in branded reusable packaging. Perfect as a gift or self-care splurge.',
    products: [products[0], products[1], products[4]],
    originalPrice: 100.97,
    bundlePrice: 79.99,
    savings: 20.98,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763682375626_4ab5425d.webp?${ASSET_VERSION}`,
    shortDescription: 'Get the tee, hoodie, and mug in one badass bundle — and save while you slay.',
    features: ['Includes: 1 Classic Tee (black), 1 Cozy Hoodie (white), 1 Mug', 'Comes in branded reusable packaging', 'Perfect as a gift or self-care splurge', 'Save over 20% vs. buying separately', 'Bundle discounts auto-applied'],
    styleTips: 'This bundle = instant main character energy. Great for gifting or giving yourself the hype you deserve.',
  },


  {
    id: 'bundle-2',
    name: 'Ultimate Collection',
    description: 'Everything you need to rep the club in style. Includes our premium hoodie, crewneck, vintage cap, and cozy beanie.',
    products: [products[1], products[5], products[6], products[10]],
    originalPrice: 172.96,
    bundlePrice: 139.99,
    savings: 32.97,
    image: `https://d64gsuwffb70l.cloudfront.net/691ba59ffe4554d9faab1ada_1763682376578_2b711ba1.webp?${ASSET_VERSION}`,

  },
];



