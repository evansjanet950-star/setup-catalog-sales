import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { Copy, Users, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  userEmail: string;
}

export default function ReferralTracker({ userEmail }: Props) {
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (userEmail) {
      fetchReferralData();
    }
  }, [userEmail]);

  const fetchReferralData = async () => {
    const { data: loyaltyData } = await supabase
      .from('loyalty_points')
      .select('referral_code')
      .eq('email', userEmail)
      .single();
    
    if (loyaltyData) {
      setReferralCode(loyaltyData.referral_code);
      
      const { data: referralData } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_email', userEmail)
        .order('created_at', { ascending: false });
      
      setReferrals(referralData || []);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast({ title: 'Copied!', description: 'Referral code copied to clipboard' });
  };

  const shareUrl = `${window.location.origin}?ref=${referralCode}`;

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({ title: 'Copied!', description: 'Share link copied to clipboard' });
  };

  if (!userEmail) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-gray-600">Please enter your email to view referral information</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              value={referralCode}
              readOnly
              className="bg-white/20 border-white/30 text-white text-xl font-bold"
            />
            <Button onClick={copyToClipboard} variant="secondary">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              value={shareUrl}
              readOnly
              className="bg-white/20 border-white/30 text-white text-sm"
            />
            <Button onClick={copyShareUrl} variant="secondary">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm opacity-90">
            Share your code and earn 500 points when friends make their first purchase!
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Referrals</CardTitle>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold">{referrals.length}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No referrals yet. Start sharing!</p>
          ) : (
            <div className="space-y-3">
              {referrals.map((ref) => (
                <div key={ref.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{ref.referee_email}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(ref.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {ref.status === 'completed' && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-1" />
                      <span className="font-bold">+{ref.points_awarded}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}