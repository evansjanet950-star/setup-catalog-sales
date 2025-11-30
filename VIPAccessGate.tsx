import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface VIPAccessGateProps {
  children: React.ReactNode;
  requiredTier?: 'Gold' | 'Platinum';
}

export function VIPAccessGate({ children, requiredTier = 'Gold' }: VIPAccessGateProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [userTier, setUserTier] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      setHasAccess(false);
      return;
    }

    const { data } = await supabase
      .from('vip_members')
      .select('tier, total_points')
      .eq('email', email)
      .single();

    if (data && ['Gold', 'Platinum'].includes(data.tier)) {
      setUserTier(data.tier);
      if (requiredTier === 'Platinum' && data.tier !== 'Platinum') {
        setHasAccess(false);
      } else {
        setHasAccess(true);
      }
    } else {
      setHasAccess(false);
    }
  };

  if (hasAccess === null) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <Lock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">VIP Access Required</h1>
          <p className="text-gray-600 mb-6">
            This exclusive area is only available to {requiredTier} and Platinum tier members.
          </p>
          <Button onClick={() => navigate('/rewards')} className="w-full">
            View Rewards Program
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
