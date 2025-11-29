import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

const DiscountModal: React.FC<DiscountModalProps> = ({ isOpen, onClose, onApply }) => {
  const [email, setEmail] = useState('');
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onApply();
      setApplied(true);
      setTimeout(() => {
        onClose();
        setApplied(false);
        setEmail('');
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {!applied ? (
          <>
            <div className="text-center mb-6">
              <div className="inline-block bg-gradient-to-br from-pink-100 to-purple-100 p-4 rounded-full mb-4">
                <span className="text-4xl">👑</span>
              </div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Get 10% OFF
              </h2>
              <p className="text-gray-600">
                Enter your email to receive your first-time customer discount code
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                Claim My 10% Discount
              </button>

            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              By submitting, you agree to receive promotional emails. Unsubscribe anytime.
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="inline-block bg-green-100 p-4 rounded-full mb-4">
              <Check className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Discount Applied!</h3>
            <p className="text-gray-600">Your 10% discount has been activated</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountModal;
