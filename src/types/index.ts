export type Theme = 'dark' | 'light';

export type AudienceClass = 'Men' | 'Ladies' | 'Unisex';

export type StyleAttribute = 'Streetwear' | 'Casual' | 'Official';

export type ProductCategory = 'hoodies' | 'tshirts' | 'sweatshirts' | 'trousers';

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  image?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  audience: AudienceClass;
  style: StyleAttribute;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  badge?: 'New' | 'Best Seller' | 'Trending' | 'Sale';
  images: string[];
  description: string;
  details: string[];
  sizes: string[];
  colors: { name: string; hex: string; image?: string }[];
  inStock: boolean;
  stockCount: number;
  reviews?: Review[];
  featured?: boolean;
}

export interface CartItem {
  id: string; // unique item id based on product and variant selection
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  unitPrice: number;
  image: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  residence?: string;
  studentId?: string;
  preferredStoreId?: string;
  registeredAt?: string;
  lastLoginAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email?: string;
  deliveryType: 'campus_pickup' | 'delivery';
  pickupLocation?: string;
  deliveryAddress?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'Received' | 'Confirmed' | 'Processing' | 'Ready for Collection' | 'Dispatched' | 'Delivered' | 'Cancelled';
  trackingStep?: number;
}

export interface FilterState {
  category: ProductCategory | 'all';
  audiences: AudienceClass[];
  styles: StyleAttribute[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  minRating: number;
  searchQuery: string;
  sortBy: 'newest' | 'popular' | 'rating' | 'price_asc' | 'price_desc';
}
