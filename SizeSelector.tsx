import { Size } from '@/types/product';

interface SizeSelectorProps {
  selectedSize: Size | null;
  onSizeSelect: (size: Size) => void;
  sizes?: Size[];
  required?: boolean;
}

const defaultSizes: Size[] = ['S', 'M', 'L', 'XL', 'XXL'];

export const SizeSelector = ({ 
  selectedSize, 
  onSizeSelect, 
  sizes = defaultSizes,
  required = false 
}: SizeSelectorProps) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold mb-2">
        Size {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-2 flex-wrap">
        {sizes.map(size => (
          <button
            key={size}
            type="button"
            onClick={() => onSizeSelect(size)}
            className={`px-4 py-2 border rounded-lg transition-all ${
              selectedSize === size 
                ? 'border-pink-600 bg-pink-50 text-pink-700 font-semibold' 
                : 'border-gray-300 hover:border-pink-400'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
      {required && !selectedSize && (
        <p className="text-xs text-gray-500 mt-1">Please select a size</p>
      )}
    </div>
  );
};
