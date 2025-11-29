import { useState } from 'react';
import { StarRating } from './StarRating';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { supabase } from '@/lib/supabase';

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (rating === 0) {
      setError('Please select a rating');
      setLoading(false);
      return;
    }

    try {
      const { data, error: submitError } = await supabase.functions.invoke('submit-review', {
        body: {
          productId,
          customerName: name,
          customerEmail: email,
          rating,
          title,
          reviewText: review,
          photos: []
        }
      });

      if (submitError) throw submitError;

      // Award points for review
      await supabase.functions.invoke('allocate-points', {
        body: { email, source: 'review' }
      });

      setMessage(data.message + ' You earned 50 loyalty points!');

      if (submitError) throw submitError;

      setMessage(data.message);
      setName('');
      setEmail('');
      setRating(0);
      setTitle('');
      setReview('');
      
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border">
      <h3 className="text-xl font-bold">Write a Review</h3>
      
      <div>
        <label className="block text-sm font-medium mb-2">Your Rating *</label>
        <StarRating rating={rating} interactive onRatingChange={setRating} size={32} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name *</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email *</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Review Title *</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Your Review *</label>
        <Textarea 
          value={review} 
          onChange={(e) => setReview(e.target.value)} 
          rows={5}
          required 
        />
      </div>

      {message && <div className="text-green-600 text-sm">{message}</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
