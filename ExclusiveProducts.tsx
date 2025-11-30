import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/hooks/useCart';
import { Sparkles } from 'lucide-react';


export function ExclusiveProducts() {
  const { addToCart } = useCart();
  const [exclusiveProducts, setExclusiveProducts] = useState<any[]>([]);


  useEffect(() => {
    loadExclusiveProducts();
  }, []);

  const loadExclusiveProducts = async () => {
    const { data } = await supabase
      .from('vip_exclusive_products')
      .select('*')
      .eq('is_active', true)
      .order('launch_date', { ascending: false });

    if (data) {
      const productsWithDetails = data.map(item => {
        const product = products.find(p => p.id === item.product_id);
        return product ? {
          ...product,
          price: product.price * (1 - item.discount_percent / 100),
          originalPrice: product.price,
          tierRequired: item.tier_required,
          launchDate: new Date(item.launch_date)
        } : null;
      }).filter(Boolean);
      
      setExclusiveProducts(productsWithDetails);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-amber-500" />
        <h2 className="text-2xl font-bold">Exclusive Products</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exclusiveProducts.map(product => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} showDiscount={true} />
        ))}
      </div>

      {exclusiveProducts.length === 0 && (
        <p className="text-gray-500 text-center py-12">No exclusive products available yet. Check back soon!</p>
      )}
    </div>
  );
}
