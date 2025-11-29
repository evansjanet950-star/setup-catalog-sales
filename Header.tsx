import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '../hooks/useCart';
import { LOGO_CDN_URL, LOGO_ALT_TEXT } from '../constants/branding';

interface HeaderProps {
  onCartClick: () => void;
}

export const Header = ({ onCartClick }: HeaderProps) => {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img 
              src={LOGO_CDN_URL} 
              alt={LOGO_ALT_TEXT} 
              className="h-12 w-auto"
            />
          </a>




          <nav className="hidden md:flex items-center gap-6">
            <a href="/#products" className="text-gray-700 hover:text-pink-600 transition-colors">
              Shop
            </a>
            <a href="/#bundles" className="text-gray-700 hover:text-pink-600 transition-colors">
              Bundles
            </a>
            <a href="/rewards" className="text-gray-700 hover:text-pink-600 transition-colors">
              Rewards
            </a>
            <a href="/vip" className="text-gray-700 hover:text-pink-600 transition-colors">
              VIP Portal
            </a>

            <a href="/newsletter" className="text-gray-700 hover:text-pink-600 transition-colors">
              Newsletter
            </a>
            <a href="/contact" className="text-gray-700 hover:text-pink-600 transition-colors">
              Contact
            </a>
          </nav>



          <Button 
            variant="outline" 
            size="sm"
            onClick={onCartClick}
            className="relative"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
