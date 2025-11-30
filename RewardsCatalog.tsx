import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Gift, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  userEmail: string;
}

export default function RewardsCatalog({ userEmail }: Props) {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loyaltyData, setLoyaltyData] = useState<any>(null);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRewards();
    if (userEmail) fetchLoyaltyData();
  }, [userEmail]);

  const fetchRewards = async () => {
    const { data } = await supabase
      .from('rewards_catalog')
      .select('*')
      .eq('active', true)
      .order('points_cost', { ascending: true });
    
    setRewards(data || []);
  };

  const fetchLoyaltyData = async () => {
    const { data } = await supabase
      .from('loyalty_points')
      .select('*')
      .eq('email', userEmail)
      .single();
    
    setLoyaltyData(data);
  };

  const handleRedeem = async (rewardId: string) => {
    if (!userEmail) {
      toast({ title: 'Please enter your email first', variant: 'destructive' });
      return;
    }

    setRedeeming(rewardId);
    
    const { data, error } = await supabase.functions.invoke('redeem-reward', {
      body: { email: userEmail, rewardId }
    });

    if (error || data.error) {
      toast({ 
        title: 'Redemption failed', 
        description: data?.error || error.message,
        variant: 'destructive' 
      });
    } else {
      toast({ 
        title: 'Reward redeemed!', 
        description: `Your code: ${data.code}` 
      });
      fetchLoyaltyData();
    }

    setRedeeming(null);
  };

  const canRedeem = (reward: any) => {
    if (!loyaltyData) return false;
    const tierOrder = { Bronze: 0, Silver: 1, Gold: 2, Platinum: 3 };
    return loyaltyData.points >= reward.points_cost && 
           tierOrder[loyaltyData.tier as keyof typeof tierOrder] >= tierOrder[reward.min_tier as keyof typeof tierOrder];
  };

  return (
    <div className="space-y-6">
      {loyaltyData && (
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Available Points</p>
                <p className="text-4xl font-bold">{loyaltyData.points}</p>
              </div>
              <Sparkles className="h-12 w-12 opacity-80" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <Card key={reward.id} className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Gift className="h-8 w-8 text-purple-600" />
                <Badge variant="secondary">{reward.min_tier}</Badge>
              </div>
              <CardTitle className="mt-4">{reward.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{reward.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-purple-600">
                  {reward.points_cost} pts
                </span>
                <Button
                  onClick={() => handleRedeem(reward.id)}
                  disabled={!canRedeem(reward) || redeeming === reward.id}
                  size="sm"
                >
                  {redeeming === reward.id ? 'Redeeming...' : 'Redeem'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}