import { Button } from './ui/button';
import { LOGO_CDN_URL, LOGO_ALT_TEXT } from '../constants/branding';
import { useState, useEffect } from 'react';

export const Hero = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 58, seconds: 55 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 flex flex-col">
      {/* Discount Banner */}
      <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 py-6 text-center">
        <h2 className="text-white text-3xl md:text-4xl font-bold mb-2">First-Time Purchase: 10% OFF</h2>
        <p className="text-white text-xl md:text-2xl">
          Ends in <span className="underline">{timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Large Logo on Black */}
        <div className="mb-12 w-full max-w-4xl">
          <div className="bg-black p-8 md:p-16 rounded-lg shadow-2xl">
            <img 
              src={LOGO_CDN_URL} 
              alt={LOGO_ALT_TEXT} 
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Brand Statement */}
        <div className="max-w-3xl text-center space-y-6 mb-12">
          <p className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed">
            Join the movement of unapologetic self-expression. WE do.not CARE CLUB is more than just apparel—It's a lifestyle statement for those who refuse to conform.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 flex-wrap justify-center">
          <Button 
            size="lg" 
            className="bg-pink-500 hover:bg-pink-600 text-white text-lg px-8 py-6 rounded-full"
            onClick={scrollToProducts}
          >
            Shop the Collection
          </Button>
        </div>
      </div>
    </div>
  );
};