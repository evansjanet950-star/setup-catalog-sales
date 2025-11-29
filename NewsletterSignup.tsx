import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NewsletterSignupProps {
  source?: string;
  variant?: 'footer' | 'page';
}

export default function NewsletterSignup({ source = 'footer', variant = 'footer' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const { data, error } = await supabase.functions.invoke('newsletter-signup', {
        body: { email, source },
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

  if (variant === 'footer') {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-bold">Join the Unbothered</h3>
        <p className="text-sm text-gray-400">
          Subscribe for early drops, exclusive bundles & unapologetic content.
        </p>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-gray-800 border-gray-700"
            disabled={status === 'loading'}
          />
          <Button type="submit" className="w-full" disabled={status === 'loading'}>
            {status === 'loading' ? 'Joining...' : 'Join Now'}
          </Button>
        </form>
        {status === 'success' && (
          <p className="text-sm text-green-400">{message}</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-400">{message}</p>
        )}
        <p className="text-xs text-gray-500">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  return null;
}
