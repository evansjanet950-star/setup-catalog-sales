import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Mail, TrendingUp, MousePointer, DollarSign } from 'lucide-react';

export const EmailCampaignManager = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('email_campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setCampaigns(data);
    setLoading(false);
  };

  const calculateRate = (num: number, denom: number) => {
    return denom > 0 ? ((num / denom) * 100).toFixed(1) : '0.0';
  };

  const totals = campaigns.reduce((acc, c) => ({
    sent: acc.sent + c.sent_count,
    opened: acc.opened + c.opened_count,
    clicked: acc.clicked + c.clicked_count,
    revenue: acc.revenue + parseFloat(c.revenue_generated || 0)
  }), { sent: 0, opened: 0, clicked: 0, revenue: 0 });

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <div className="text-sm text-gray-600">Total Sent</div>
          </div>
          <div className="text-3xl font-bold">{totals.sent}</div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div className="text-sm text-gray-600">Open Rate</div>
          </div>
          <div className="text-3xl font-bold">{calculateRate(totals.opened, totals.sent)}%</div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <MousePointer className="w-5 h-5 text-purple-600" />
            <div className="text-sm text-gray-600">Click Rate</div>
          </div>
          <div className="text-3xl font-bold">{calculateRate(totals.clicked, totals.opened)}%</div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-yellow-600" />
            <div className="text-sm text-gray-600">Revenue</div>
          </div>
          <div className="text-3xl font-bold">${totals.revenue.toFixed(2)}</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">All Campaigns</h2>
          <Button onClick={() => window.location.href = '/admin/email-analytics'}>
            View Detailed Analytics
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Campaign</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-right py-3 px-4">Sent</th>
                  <th className="text-right py-3 px-4">Opened</th>
                  <th className="text-right py-3 px-4">Clicked</th>
                  <th className="text-right py-3 px-4">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{campaign.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {campaign.type}
                      </span>
                    </td>
                    <td className="text-right py-3 px-4">{campaign.sent_count}</td>
                    <td className="text-right py-3 px-4">
                      {campaign.opened_count} ({calculateRate(campaign.opened_count, campaign.sent_count)}%)
                    </td>
                    <td className="text-right py-3 px-4">
                      {campaign.clicked_count} ({calculateRate(campaign.clicked_count, campaign.opened_count)}%)
                    </td>
                    <td className="text-right py-3 px-4">${parseFloat(campaign.revenue_generated || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
