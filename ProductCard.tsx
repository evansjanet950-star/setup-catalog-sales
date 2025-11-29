import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types/product';
import { ShoppingCart } from 'lucide-react';
import { StarRating } from './StarRating';
import { supabase } from '@/lib/supabase';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  showDiscount?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, showDiscount }) => {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [currentImage, setCurrentImage] = useState(product.image);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const discountedPrice = showDiscount ? product.price * 0.9 : product.price;

  useEffect(() => {
    fetchProductRating();
  }, [product.id]);

  const fetchProductRating = async () => {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('rating')
        .eq('product_id', product.id)
        .eq('status', 'approved');

      if (error) throw error;

      if (data && data.length > 0) {
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setAverageRating(avg);
        setReviewCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching rating:', error);
    }
  };


  const handleColorClick = (color: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedColor(color);
    if (product.colorImages && product.colorImages[color]) {
      setCurrentImage(product.colorImages[color]);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-all cursor-pointer"
    >
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient || 'from-pink-200 to-purple-300'}`} />
        <img 
          src={currentImage} 
          alt={product.name}
          className="relative w-full h-64 object-contain p-4 group-hover:scale-110 transition-transform duration-300"
        />
        {product.badge && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
            {product.badge}
          </div>
        )}
        {showDiscount && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-bold z-10">
            10% OFF
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="text-sm text-gray-500 mb-1">{product.category}</div>
        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
        
        {reviewCount > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={averageRating} size={16} />
            <span className="text-xs text-gray-500">({reviewCount})</span>
          </div>
        )}
        
        <p className="text-sm text-gray-600 mb-3">{product.description}</p>

        {product.colors && product.colors.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-2">Colors:</div>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={(e) => handleColorClick(color, e)}
                  className={`text-xs px-2 py-1 rounded transition-all ${
                    selectedColor === color 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            {showDiscount ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 line-through">${product.price.toFixed(2)}</span>
                <span className="text-xl font-bold text-pink-600">${discountedPrice.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          <button
            onClick={() => onAddToCart(product)}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
