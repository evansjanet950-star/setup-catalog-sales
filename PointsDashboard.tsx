import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Trophy, TrendingUp, Gift, Award } from 'lucide-react';
import TierBenefits from './TierBenefits';
import TransactionHistory from './TransactionHistory';

interface Props {
  userEmail: string;
  setUserEmail: (email: string) => void;
}

export default function PointsDashboard({ userEmail, setUserEmail }: Props) {
  const [email, setEmail] = useState('');
  const [loyaltyData, setLoyaltyData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userEmail) {
      fetchLoyaltyData(userEmail);
    }
  }, [userEmail]);

  const fetchLoyaltyData = async (emailToFetch: string) => {
    setLoading(true);
    const { data } = await supabase
      .from('loyalty_points')
      .select('*')
      .eq('email', emailToFetch)
      .single();
    
    setLoyaltyData(data);
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserEmail(email);
    fetchLoyaltyData(email);
  };

  const getTierColor = (tier: string) => {
    const colors = {
      Bronze: 'text-orange-600 bg-orange-100',
      Silver: 'text-gray-600 bg-gray-200',
      Gold: 'text-yellow-600 bg-yellow-100',
      Platinum: 'text-purple-600 bg-purple-100'
    };
    return colors[tier as keyof typeof colors] || colors.Bronze;
  };

  if (!userEmail) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Check Your Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">View My Rewards</Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Points Balance</p>
                <p className="text-3xl font-bold">{loyaltyData?.points || 0}</p>
              </div>
              <Trophy className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Tier</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getTierColor(loyaltyData?.tier)}`}>
                  {loyaltyData?.tier || 'Bronze'}
                </span>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earned</p>
                <p className="text-2xl font-bold">{loyaltyData?.total_earned || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Redeemed</p>
                <p className="text-2xl font-bold">{loyaltyData?.total_spent || 0}</p>
              </div>
              <Gift className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <TierBenefits currentTier={loyaltyData?.tier || 'Bronze'} />
      <TransactionHistory userEmail={userEmail} />
    </div>
  );
}