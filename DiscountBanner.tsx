import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface DiscountBannerProps {
  onClaim?: () => void;
}

export const DiscountBanner = ({ onClaim }: DiscountBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 relative">
      <div className="container mx-auto flex items-center justify-center gap-4 text-sm md:text-base flex-wrap">
        <span className="font-semibold">First-Time Purchase: 10% OFF</span>
        <span className="hidden md:inline">|</span>
        <span className="text-xs md:text-sm">
          Ends in {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
        {onClaim && (
          <>
            <span className="hidden md:inline">|</span>
            <button 
              onClick={onClaim}
              className="text-xs md:text-sm underline hover:opacity-80 font-semibold"
            >
              Claim Now
            </button>
          </>
        )}
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
