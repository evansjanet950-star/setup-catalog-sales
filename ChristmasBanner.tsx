import { Gift } from 'lucide-react';

export const ChristmasBanner = () => {
  return (
    <div className="bg-gradient-to-r from-red-600 via-green-600 to-red-600 text-white py-2 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
        <div className="inline-flex items-center gap-2 mx-4">
          <Gift className="h-4 w-4" />
          <span className="font-bold text-sm md:text-base">
            CHRISTMAS BUNDLE SALE - Save 25% on All Bundles!
          </span>
          <Gift className="h-4 w-4" />
        </div>
        <div className="inline-flex items-center gap-2 mx-4">
          <Gift className="h-4 w-4" />
          <span className="font-bold text-sm md:text-base">
            CHRISTMAS BUNDLE SALE - Save 25% on All Bundles!
          </span>
          <Gift className="h-4 w-4" />
        </div>
        <div className="inline-flex items-center gap-2 mx-4">
          <Gift className="h-4 w-4" />
          <span className="font-bold text-sm md:text-base">
            CHRISTMAS BUNDLE SALE - Save 25% on All Bundles!
          </span>
          <Gift className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};
