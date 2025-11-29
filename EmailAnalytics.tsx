import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import SMSMetricsCards from '@/components/analytics/SMSMetricsCards';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function EmailAnalytics() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [smsCampaigns, setSmsCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    loadCampaigns();
  }, []);

  useEffect(() => {
    if (selectedCampaign) {
      loadCampaignEvents(selectedCampaign);
    }
  }, [selectedCampaign]);

  const loadCampaigns = async () => {
    const { data } = await supabase
      .from('email_campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setCampaigns(data);
    
    const { data: smsData } = await supabase
      .from('sms_campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    if (smsData) setSmsCampaigns(smsData);
  };


  const loadCampaignEvents = async (campaignId: string) => {
    const { data } = await supabase
      .from('email_events')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });
    if (data) setEvents(data);
  };

  const calculateRate = (numerator: number, denominator: number) => {
    return denominator > 0 ? ((numerator / denominator) * 100).toFixed(1) : '0.0';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Email Campaign Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {campaigns.slice(0, 1).map((campaign) => (
            <>
              <Card className="p-6">
                <div className="text-sm text-gray-600 mb-1">Total Sent</div>
                <div className="text-3xl font-bold">{campaign.sent_count}</div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-gray-600 mb-1">Open Rate</div>
                <div className="text-3xl font-bold">
                  {calculateRate(campaign.opened_count, campaign.sent_count)}%
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-gray-600 mb-1">Click Rate</div>
                <div className="text-3xl font-bold">
                  {calculateRate(campaign.clicked_count, campaign.opened_count)}%
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-gray-600 mb-1">Revenue</div>
                <div className="text-3xl font-bold">${campaign.revenue_generated}</div>
              </Card>
            </>
          ))}
        </div>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">All Campaigns</h2>
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
                  <tr
                    key={campaign.id}
                    onClick={() => setSelectedCampaign(campaign.id)}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="py-3 px-4">{campaign.name}</td>
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
                    <td className="text-right py-3 px-4">${campaign.revenue_generated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
