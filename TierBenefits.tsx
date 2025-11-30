import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface Props {
  currentTier: string;
}

export default function TierBenefits({ currentTier }: Props) {
  const tiers = [
    {
      name: 'Bronze',
      threshold: 0,
      benefits: ['Earn 1 point per $1', 'Birthday bonus', 'Exclusive member sales']
    },
    {
      name: 'Silver',
      threshold: 2000,
      benefits: ['All Bronze benefits', 'Earn 1.25 points per $1', 'Free shipping on orders $50+', 'Early sale access']
    },
    {
      name: 'Gold',
      threshold: 5000,
      benefits: ['All Silver benefits', 'Earn 1.5 points per $1', 'Free shipping on all orders', 'VIP customer service', 'Exclusive Gold rewards']
    },
    {
      name: 'Platinum',
      threshold: 10000,
      benefits: ['All Gold benefits', 'Earn 2 points per $1', 'Personal stylist', 'First access to new products', 'Platinum-only events']
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tier Benefits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`p-4 rounded-lg border-2 ${
                tier.name === currentTier
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">{tier.name}</h3>
                {tier.name === currentTier && (
                  <Badge variant="default">Current</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {tier.threshold > 0 ? `${tier.threshold}+ points` : 'Starting tier'}
              </p>
              <ul className="space-y-2">
                {tier.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start text-sm">
                    <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}