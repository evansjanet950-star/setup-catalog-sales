import React from 'react';
import { Bundle } from '@/types/product';
import { Package } from 'lucide-react';

interface BundleCardProps {
  bundle: Bundle;
  onAddToCart: () => void;
}

const BundleCard: React.FC<BundleCardProps> = ({ bundle, onAddToCart }) => {
  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg shadow-lg overflow-hidden border-2 border-pink-200">
      <div className="relative">
        <img 
          src={bundle.image} 
          alt={bundle.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-3 right-3 bg-pink-600 text-white px-4 py-2 rounded-full font-bold">
          Save ${bundle.savings}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-5 h-5 text-pink-600" />
          <span className="text-sm font-semibold text-pink-600">BUNDLE DEAL</span>
        </div>
        
        <h3 className="font-bold text-2xl mb-3">{bundle.name}</h3>
        
        {bundle.description && (
          <p className="text-sm text-gray-600 mb-4">{bundle.description}</p>
        )}
        
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">Includes:</div>
          <ul className="text-sm space-y-1">
            {bundle.products.map(product => (
              <li key={product.id} className="text-gray-700">• {product.name}</li>
            ))}
          </ul>
        </div>

        
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-gray-400 line-through">${bundle.originalPrice.toFixed(2)}</div>
            <div className="text-3xl font-bold text-pink-600">${bundle.bundlePrice.toFixed(2)}</div>
          </div>
        </div>
        
        <button
          onClick={onAddToCart}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
        >
          Add Bundle to Cart
        </button>
      </div>
    </div>


  );
};

export default BundleCard;
