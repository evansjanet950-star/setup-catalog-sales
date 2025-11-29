import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';


export default function Checkout() {
  const { items, total } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    smsOptIn: true
  });


  // Check if any apparel items are missing sizes
  const hasInvalidApparelItems = items.some(item => 
    (item.category === 'Fashion' || item.category === 'Apparel') && !item.selectedSize
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate sizes for apparel items
    if (hasInvalidApparelItems) {
      toast({
        title: "Size Selection Required",
        description: "Please select sizes for all apparel items in your cart.",
        variant: "destructive",
      });
      return;
    }
    
    
    setLoading(true);


    try {
      // Save SMS preferences if phone number provided
      if (formData.phone && formData.smsOptIn) {
        await supabase.from('sms_preferences').upsert({
          email: formData.email,
          phone_number: formData.phone,
          sms_enabled: true,
          order_updates: true,
          marketing_sms: true
        });
      }

      // Allocate points for purchase
      await supabase.functions.invoke('allocate-points', {
        body: {
          email: formData.email,
          source: 'purchase',
          orderId: `ORDER-${Date.now()}`,
          orderTotal: total
        }
      });

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          items: items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            size: item.selectedSize,
            color: item.selectedColor
          })),
          customerEmail: formData.email,
          customerPhone: formData.phone,
          successUrl: `${window.location.origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/checkout`
        }
      });

      if (error) throw error;
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };




  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => navigate('/')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {hasInvalidApparelItems && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Size Selection Required</h3>
            <p className="text-sm text-red-700">Please go back to your cart and select sizes for all apparel items before proceeding.</p>
          </div>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" required value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" required value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" required value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" required value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})} />
                </div>
              </div>
              <div>
                <Label htmlFor="zip">ZIP Code</Label>
                <Input id="zip" required value={formData.zip}
                  onChange={(e) => setFormData({...formData, zip: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number (optional)</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                <p className="text-xs text-gray-500 mt-1">For order updates and shipping notifications</p>
              </div>
              {formData.phone && (
                <div className="flex items-center space-x-2">
                  <Checkbox id="smsOptIn" checked={formData.smsOptIn}
                    onCheckedChange={(checked) => setFormData({...formData, smsOptIn: checked as boolean})} />
                  <label htmlFor="smsOptIn" className="text-sm text-gray-700 cursor-pointer">
                    Send me SMS updates about my order and exclusive offers
                  </label>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading || hasInvalidApparelItems}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : 'Proceed to Payment'}
              </Button>

            </form>
          </Card>
        </div>
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={`${item.id}-${item.selectedSize}-${idx}`} className="flex gap-4 pb-4 border-b">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    {item.selectedSize && <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>}
                    {item.selectedColor && <p className="text-sm text-gray-600">Color: {item.selectedColor}</p>}
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
