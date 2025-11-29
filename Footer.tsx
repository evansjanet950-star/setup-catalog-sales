import { LOGO_CDN_URL, LOGO_ALT_TEXT } from '../constants/branding';
import NewsletterSignup from './NewsletterSignup';

export const Footer = () => {
  return (
    <footer className="bg-black text-white border-t border-gray-800 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img 
              src={LOGO_CDN_URL} 
              alt={LOGO_ALT_TEXT} 
              className="h-20 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-gray-400 text-sm">
              Unbothered. Unapologetic. Unstoppable.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/#products" className="hover:text-[#00D9FF]">All Products</a></li>
              <li><a href="/#bundles" className="hover:text-[#00D9FF]">Bundles</a></li>
              <li><a href="/#featured" className="hover:text-[#00D9FF]">Featured</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/contact" className="hover:text-[#00D9FF]">Contact Us</a></li>
              <li><a href="/faq" className="hover:text-[#00D9FF]">FAQ</a></li>
              <li><a href="/returns" className="hover:text-[#00D9FF]">Returns</a></li>
              <li><a href="/order-tracking" className="hover:text-[#00D9FF]">Track Order</a></li>
              <li><a href="/newsletter" className="hover:text-[#00D9FF]">Newsletter</a></li>
            </ul>
          </div>


          <div>
            <NewsletterSignup source="footer" variant="footer" />
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2024 WE DO NOT CARE CLUB™ | Confidence. Printed.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-[#00D9FF]">Privacy</a>
            <a href="#" className="hover:text-[#00D9FF]">Terms</a>
            <a href="/returns" className="hover:text-[#00D9FF]">Refunds</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
