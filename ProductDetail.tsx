import { useParams, useNavigate } from 'react-router-dom';
import { products } from '@/data/products';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useState, useEffect } from 'react';
import CartModal from '@/components/CartModal';
import { StarRating } from '@/components/StarRating';
import { ReviewForm } from '@/components/ReviewForm';
import { ReviewList } from '@/components/ReviewList';
import { supabase } from '@/lib/supabase';
import { SizeSelector } from '@/components/SizeSelector';
import { Size } from '@/types/product';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';



export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cart = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [stockInfo, setStockInfo] = useState<any>(null);
  const [checkingStock, setCheckingStock] = useState(false);

  const product = products.find(p => p.id === id);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [currentImage, setCurrentImage] = useState(product?.image || '');
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

  useEffect(() => {
    if (product && selectedSize && selectedColor) {
      checkStock();
    }
  }, [selectedSize, selectedColor, product]);

  const checkStock = async () => {
    if (!product) return;
    
    // Check if product has inventoryBySize (Valentine's collection)
    if (product.inventoryBySize && selectedSize) {
      const stock = product.inventoryBySize[selectedSize] || 0;
      setStockInfo({
        available: stock > 0,
        stock: stock,
      });
      return;
    }
    
    // Otherwise check database inventory
    setCheckingStock(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-stock', {
        body: {
          product_id: parseInt(id!),
          size: selectedSize,
          color: selectedColor,
          quantity: 1
        }
      });

      if (!error && data) {
        setStockInfo(data);
      }
    } catch (error) {
      console.error('Error checking stock:', error);
    } finally {
      setCheckingStock(false);
    }
  };


  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data || []);
      
      if (data && data.length > 0) {
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setAverageRating(avg);
        setReviewCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };



  if (!product) {
    return <div>Product not found</div>;
  }

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    if (product.colorImages && product.colorImages[color]) {
      setCurrentImage(product.colorImages[color]);
    }
  };

  const isApparelProduct = product.category === 'Fashion' || product.category === 'Apparel';

  const handleAddToCart = () => {
    // Validate size selection for apparel products
    if (isApparelProduct && !selectedSize) {
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    // Check stock availability
    if (stockInfo && !stockInfo.available) {
      toast({
        title: "Out of Stock",
        description: "This size/color combination is currently out of stock.",
        variant: "destructive",
      });
      return;
    }
    
    cart.addToCart(product, selectedSize || undefined, selectedColor || undefined);
    setCartOpen(true);
    
    toast({
      title: "Added to Cart",
      description: `${product.name}${selectedSize ? ` (Size: ${selectedSize})` : ''} has been added to your cart.`,
    });
  };




  const handleCheckout = () => {
    console.log('Checkout');
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Header onCartClick={() => setCartOpen(true)} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <a href="/" className="text-pink-600 hover:underline">Home</a>
          <span className="mx-2">/</span>
          <a href="/#products" className="text-pink-600 hover:underline">Shop</a>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className={`relative rounded-lg overflow-hidden shadow-lg bg-gradient-to-br ${product.gradient || 'from-pink-200 to-purple-300'}`}>
              <img 
                src={currentImage} 
                alt={product.name}
                className="w-full object-contain p-8"
              />
            </div>
          </div>


          {/* Product Info */}
          <div>
            <div className="text-sm text-gray-500 mb-2">{product.category}</div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={averageRating} size={20} />
              <span className="text-sm text-gray-600">
                ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            <div className="text-3xl font-bold text-pink-600 mb-6">
              ${product.price.toFixed(2)}
            </div>
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            {/* Short Description */}
            {product.shortDescription && (
              <div className="bg-pink-50 border-l-4 border-pink-500 p-4 mb-6">
                <p className="text-gray-800 font-medium">{product.shortDescription}</p>
              </div>
            )}


            {/* Color Selection */}
            {product.colors && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={`px-4 py-2 border rounded-lg transition-all ${
                        selectedColor === color 
                          ? 'border-pink-600 bg-pink-50' 
                          : 'border-gray-300 hover:border-pink-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}


            {/* Size Selection */}
            {isApparelProduct && (
              <SizeSelector
                selectedSize={selectedSize}
                onSizeSelect={setSelectedSize}
                required={true}
              />
            )}

            {/* Stock Availability */}
            {stockInfo && selectedSize && (
              <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                stockInfo.available 
                  ? stockInfo.stock <= 10 
                    ? 'bg-amber-50 border border-amber-200' 
                    : 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <AlertCircle className={`w-5 h-5 ${
                  stockInfo.available 
                    ? stockInfo.stock <= 10 
                      ? 'text-amber-600' 
                      : 'text-green-600'
                    : 'text-red-600'
                }`} />
                <span className={`text-sm font-medium ${
                  stockInfo.available 
                    ? stockInfo.stock <= 10 
                      ? 'text-amber-800' 
                      : 'text-green-800'
                    : 'text-red-800'
                }`}>
                  {stockInfo.available 
                    ? stockInfo.stock <= 10 
                      ? `Only ${stockInfo.stock} left in stock!`
                      : `In Stock (${stockInfo.stock} available)`
                    : 'Out of Stock'}
                </span>
              </div>
            )}


            <Button 
              onClick={handleAddToCart}
              disabled={stockInfo && !stockInfo.available}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-6 text-lg mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {stockInfo && !stockInfo.available ? 'Out of Stock' : 'Add to Cart'}
            </Button>


            {/* Product Details Tabs */}
            <div className="border-t pt-6">
              {product.features && (
                <details className="mb-4" open>
                  <summary className="font-semibold cursor-pointer mb-2">Product Features</summary>
                  <div className="text-sm text-gray-600 pl-4">
                    <ul className="list-disc pl-4 space-y-1">
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </details>
              )}

              {product.materials && (
                <details className="mb-4">
                  <summary className="font-semibold cursor-pointer mb-2">Materials</summary>
                  <div className="text-sm text-gray-600 pl-4">
                    <p>{product.materials}</p>
                  </div>
                </details>
              )}

              {product.care && (
                <details className="mb-4">
                  <summary className="font-semibold cursor-pointer mb-2">Care Instructions</summary>
                  <div className="text-sm text-gray-600 pl-4">
                    <p>{product.care}</p>
                  </div>
                </details>
              )}

              {product.styleTips && (
                <details className="mb-4">
                  <summary className="font-semibold cursor-pointer mb-2">Style Tips</summary>
                  <div className="text-sm text-gray-600 pl-4">
                    <p>{product.styleTips}</p>
                  </div>
                </details>
              )}

              <details className="mb-4">
                <summary className="font-semibold cursor-pointer mb-2">Size Guide</summary>
                <div className="text-sm text-gray-600 pl-4">
                  {product.sizeChart ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 pr-4">Size</th>
                            <th className="text-left py-2 pr-4">Chest</th>
                            <th className="text-left py-2 pr-4">Length</th>
                            {product.sizeChart.some(s => s.notes) && <th className="text-left py-2">Notes</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {product.sizeChart.map((sizeInfo, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-2 pr-4 font-medium">{sizeInfo.size}</td>
                              <td className="py-2 pr-4">{sizeInfo.chest}</td>
                              <td className="py-2 pr-4">{sizeInfo.length}</td>
                              {sizeInfo.notes && <td className="py-2 text-xs italic">{sizeInfo.notes}</td>}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <>
                      <p className="mb-2">Our products run true to size. For the best fit:</p>
                      <ul className="list-disc pl-4">
                        <li>XS: Chest 32-34"</li>
                        <li>S: Chest 34-36"</li>
                        <li>M: Chest 36-38"</li>
                        <li>L: Chest 38-40"</li>
                        <li>XL: Chest 40-42"</li>
                      </ul>
                    </>
                  )}
                </div>
              </details>


              <details className="mb-4">
                <summary className="font-semibold cursor-pointer mb-2">Shipping & Returns</summary>
                <div className="text-sm text-gray-600 pl-4">
                  <p>Free shipping on orders over $50. Returns accepted within 30 days of purchase.</p>
                </div>
              </details>
            </div>

          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Customer Reviews</h2>
            {reviewCount > 0 && (
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <StarRating rating={averageRating} size={24} />
                  <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
                </div>
                <p className="text-sm text-gray-600">Based on {reviewCount} reviews</p>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <ReviewForm productId={id!} onSuccess={fetchReviews} />
            </div>
            <div>
              <ReviewList reviews={reviews} onVoteSuccess={fetchReviews} />
            </div>
          </div>
        </div>

      </main>

      <Footer />
      <CartModal 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)}
        cart={cart.cart}
        onUpdateQuantity={cart.updateQuantity}
        onRemove={cart.removeFromCart}
        subtotal={cart.subtotal}
        total={cart.total}
        discount={cart.discount}
        onCheckout={handleCheckout}
      />

    </div>
  );
}
