import { useState } from 'react';
import { StarRating } from './StarRating';
import { Button } from './ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  title: string;
  review_text: string;
  created_at: string;
  helpful_count: number;
  not_helpful_count: number;
  verified_purchase: boolean;
}

interface ReviewListProps {
  reviews: Review[];
  onVoteSuccess?: () => void;
}

export function ReviewList({ reviews, onVoteSuccess }: ReviewListProps) {
  const [votedReviews, setVotedReviews] = useState<Set<string>>(new Set());

  const handleVote = async (reviewId: string, voteType: 'helpful' | 'not_helpful') => {
    if (votedReviews.has(reviewId)) {
      return;
    }

    const voterIdentifier = localStorage.getItem('voterId') || crypto.randomUUID();
    localStorage.setItem('voterId', voterIdentifier);

    try {
      const { error } = await supabase.functions.invoke('vote-review', {
        body: { reviewId, voteType, voterIdentifier }
      });

      if (!error) {
        setVotedReviews(new Set([...votedReviews, reviewId]));
        if (onVoteSuccess) onVoteSuccess();
      }
    } catch (err) {
      console.error('Vote error:', err);
    }
  };

  if (reviews.length === 0) {
    return <div className="text-center py-8 text-gray-500">No reviews yet. Be the first to review!</div>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{review.customer_name}</span>
                {review.verified_purchase && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                    Verified Purchase
                  </span>
                )}
              </div>
              <StarRating rating={review.rating} size={16} />
            </div>
            <span className="text-sm text-gray-500">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <h4 className="font-semibold mb-2">{review.title}</h4>
          <p className="text-gray-700 mb-4">{review.review_text}</p>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Was this helpful?</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote(review.id, 'helpful')}
              disabled={votedReviews.has(review.id)}
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              {review.helpful_count}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote(review.id, 'not_helpful')}
              disabled={votedReviews.has(review.id)}
            >
              <ThumbsDown className="w-4 h-4 mr-1" />
              {review.not_helpful_count}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
