import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PointsDashboard from '@/components/rewards/PointsDashboard';
import RewardsCatalog from '@/components/rewards/RewardsCatalog';
import ReferralTracker from '@/components/rewards/ReferralTracker';

export default function Rewards() {
  const [userEmail, setUserEmail] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Loyalty Rewards
          </h1>
          <p className="text-xl text-gray-600">
            Earn points, unlock rewards, and enjoy exclusive benefits
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <PointsDashboard userEmail={userEmail} setUserEmail={setUserEmail} />
          </TabsContent>

          <TabsContent value="rewards">
            <RewardsCatalog userEmail={userEmail} />
          </TabsContent>

          <TabsContent value="referrals">
            <ReferralTracker userEmail={userEmail} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}