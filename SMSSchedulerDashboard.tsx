import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

export default function SMSSchedulerDashboard() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    const { data } = await supabase
      .from('sms_scheduled_campaigns')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    setCampaigns(data || []);
  };

  const triggerCampaign = async (campaignId: string, type: string) => {
    setLoading(true);
    try {
      const campaign = campaigns.find(c => c.id === campaignId);
      
      let functionName = 'send-flash-sale-sms';
      if (type === 'birthday') functionName = 'send-birthday-sms';
      if (type === 'winback') functionName = 'send-winback-sms';

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { 
          campaignId, 
          message: campaign?.message_template,
          targetAudience: campaign?.target_audience 
        }
      });

      if (error) throw error;
      alert(`Campaign triggered! Sent: ${data.sent}, Failed: ${data.failed}`);
      loadCampaigns();
    } catch (error) {
      console.error('Error triggering campaign:', error);
      alert('Failed to trigger campaign');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-500',
      scheduled: 'bg-blue-500',
      sending: 'bg-yellow-500',
      completed: 'bg-green-500',
      paused: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">SMS Campaign Scheduler</h2>
        <Button onClick={loadCampaigns}>Refresh</Button>
      </div>

      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{campaign.campaign_name}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Type: {campaign.campaign_type}
                  </p>
                </div>
                <Badge className={getStatusColor(campaign.status)}>
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">{campaign.message_template}</p>
                
                {campaign.ab_test_enabled && (
                  <Badge variant="outline">A/B Test Enabled</Badge>
                )}

                <div className="flex gap-4 text-sm text-gray-600">
                  <span>Sent: {campaign.sent_count}</span>
                  <span>Delivered: {campaign.delivered_count}</span>
                  <span>Failed: {campaign.failed_count}</span>
                  <span>Responses: {campaign.response_count}</span>
                </div>

                {campaign.scheduled_time && (
                  <p className="text-sm">
                    Scheduled: {new Date(campaign.scheduled_time).toLocaleString()}
                  </p>
                )}

                {campaign.status !== 'completed' && (
                  <Button 
                    onClick={() => triggerCampaign(campaign.id, campaign.campaign_type)}
                    disabled={loading}
                    size="sm"
                  >
                    Trigger Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
