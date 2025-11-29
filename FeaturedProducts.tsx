import { Button } from './ui/button';
import { useCart } from '@/hooks/useCart';
import { products } from '@/data/products';

export const FeaturedProducts = () => {
  const cart = useCart();
  
  const featuredProducts = [
    products.find(p => p.id === '2'), // Cozy Hoodie
    products.find(p => p.id === '3'), // Lavender Tee
    products.find(p => p.id === '4'), // Tote Bag
  ].filter(Boolean);

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Featured Collection
          </h2>
          <p className="text-xl text-gray-600">Our most popular items this season</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {featuredProducts.map((product) => (
            <div key={product?.id} className="group relative bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img 
                  src={product?.image} 
                  alt={product?.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{product?.name}</h3>
                <p className="text-gray-600 mb-4">{product?.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-purple-600">${product?.price}</span>
                  <Button 
                    onClick={() => product && cart.addToCart(product)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-6"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
