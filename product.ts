export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  badge?: string;
  colors?: string[];
  colorImages?: { [key: string]: string };
  gradient?: string;
  shortDescription?: string;
  features?: string[];
  materials?: string;
  care?: string;
  styleTips?: string;
  dimensions?: string;
  // Valentine's Collection fields (optional for backwards compatibility)
  handle?: string;
  compareAtPrice?: number;
  gallery?: string[];
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  sizes?: string[];
  sizeChart?: {
    size: string;
    chest: string;
    length: string;
    notes?: string;
  }[];
  inventoryBySize?: {
    [size: string]: number;
  };
}


export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: Size;
  selectedColor?: string;
}


export interface Bundle {
  id: string;
  name: string;
  description?: string;
  products: Product[];
  originalPrice: number;
  bundlePrice: number;
  image: string;
  savings: number;
}

