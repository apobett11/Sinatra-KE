const fs = require('fs');
const path = require('path');

// Read configs from generate-all-products.cjs
const genScript = fs.readFileSync(path.join(__dirname, 'generate-all-products.cjs'), 'utf-8');
const match = genScript.match(/const PRODUCT_CONFIGS = (\[[\s\S]*?\n\]);/);
if (!match) {
  console.error('Could not find PRODUCT_CONFIGS');
  process.exit(1);
}

const configs = eval(match[1]);

const sampleReviewAuthors = [
  'Brian K.', 'Mercy W.', 'Kevin O.', 'Faith C.', 'Dennis M.',
  'Emmanuel T.', 'Sammy N.', 'Wanjiku M.', 'Otieno J.', 'Cheruiyot P.',
  'Amina H.', 'Ian M.', 'Esther K.', 'Victor N.', 'Joy B.'
];

const sampleComments = [
  'Best quality on campus, super warm for morning lectures at Egerton.',
  'Fabric feels luxurious and fits perfectly. The embroidery is super clean!',
  'Arrived quickly to Tatton gate. Highly recommend Sinatra!',
  'Love the streetwear drop shoulder cut. Perfect for chilling around campus.',
  'Top tier fabric weight. Does not shrink after wash at all.'
];

const products = configs.map((cfg, idx) => {
  const revCount = cfg.reviewCount || (20 + (idx * 3) % 80);
  const reviews = [
    {
      id: `rev-${cfg.id}-1`,
      author: sampleReviewAuthors[idx % sampleReviewAuthors.length],
      rating: 5,
      date: '28 Oct 2026',
      comment: sampleComments[idx % sampleComments.length],
      verified: true
    },
    {
      id: `rev-${cfg.id}-2`,
      author: sampleReviewAuthors[(idx + 3) % sampleReviewAuthors.length],
      rating: 4,
      date: '16 Oct 2026',
      comment: sampleComments[(idx + 2) % sampleComments.length],
      verified: true
    }
  ];

  return {
    id: cfg.id,
    slug: cfg.slug,
    name: cfg.name,
    category: cfg.category,
    categoryLabel: cfg.categoryLabel,
    audience: cfg.audience,
    style: cfg.style,
    price: cfg.price,
    originalPrice: cfg.originalPrice,
    discountPercentage: cfg.discountPercentage,
    rating: cfg.rating,
    reviewCount: revCount,
    badge: cfg.badge || undefined,
    featured: cfg.featured || (idx < 8),
    images: [`/images/products/${cfg.id}.jpg`],
    description: cfg.description,
    details: cfg.details,
    sizes: cfg.sizes,
    colors: cfg.colors,
    inStock: true,
    stockCount: cfg.stockCount,
    reviews
  };
});

const tsContent = `import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};
`;

fs.writeFileSync(path.resolve(__dirname, '../src/data/products.ts'), tsContent, 'utf-8');
console.log('Successfully updated src/data/products.ts with 50 products!');
