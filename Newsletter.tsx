import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const { data, error } = await supabase.functions.invoke('newsletter-signup', {
        body: { email, source: 'newsletter-page' },
      });

      if (error) throw error;

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Failed to subscribe. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-black text-white py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-[#00D9FF] rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to the Club!</h1>
          <p className="text-xl text-gray-400 mb-8">{message}</p>
          <p className="text-gray-500">
            You'll receive updates on new drops, exclusive bundles, and unapologetic content straight to your inbox.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Join the Unbothered</h1>
          <p className="text-xl text-gray-400">
            Get early access to new drops, exclusive bundles & unapologetic content.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">What You'll Get:</h2>
            <ul className="space-y-4">
              {[
                'Early access to new product drops',
                'Exclusive bundle deals & discounts',
                'Behind-the-scenes content',
                'Members-only designs',
                'Unapologetic lifestyle tips'
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-[#00D9FF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-900 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Subscribe Now</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 h-12"
                  disabled={status === 'loading'}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-lg" 
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Subscribing...' : 'Join the Club'}
              </Button>
            </form>

            {status === 'error' && (
              <p className="text-sm text-red-400 mt-4">{message}</p>
            )}

            <div className="mt-6 pt-6 border-t border-gray-800">
              <h3 className="font-bold mb-2">Privacy Notice</h3>
              <p className="text-sm text-gray-400">
                We respect your privacy. Your email will only be used to send you updates about WE DO NOT CARE CLUB products and content. We'll never share your information with third parties. You can unsubscribe anytime with one click.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
