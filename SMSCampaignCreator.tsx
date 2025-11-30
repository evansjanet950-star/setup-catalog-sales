import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';

export default function SMSCampaignCreator() {
  const [campaignName, setCampaignName] = useState('');
  const [campaignType, setCampaignType] = useState('flash_sale');
  const [messageA, setMessageA] = useState('');
  const [messageB, setMessageB] = useState('');
  const [abTestEnabled, setAbTestEnabled] = useState(false);
  const [splitPercentage, setSplitPercentage] = useState(50);
  const [scheduleType, setScheduleType] = useState('immediate');
  const [scheduledTime, setScheduledTime] = useState('');
  const [vipOnly, setVipOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateCampaign = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sms_scheduled_campaigns')
        .insert({
          campaign_name: campaignName,
          campaign_type: campaignType,
          message_template: messageA,
          ab_variant_b_message: abTestEnabled ? messageB : null,
          ab_test_enabled: abTestEnabled,
          ab_split_percentage: splitPercentage,
          schedule_type: scheduleType,
          scheduled_time: scheduleType === 'scheduled' ? scheduledTime : null,
          target_audience: { vipOnly },
          status: scheduleType === 'immediate' ? 'sending' : 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;

      if (scheduleType === 'immediate') {
        await supabase.functions.invoke('send-flash-sale-sms', {
          body: { campaignId: data.id, message: messageA, targetAudience: { vipOnly } }
        });
      }

      alert('Campaign created successfully!');
      setCampaignName('');
      setMessageA('');
      setMessageB('');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create SMS Campaign</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Campaign Name</Label>
          <Input value={campaignName} onChange={(e) => setCampaignName(e.target.value)} />
        </div>

        <div>
          <Label>Campaign Type</Label>
          <Select value={campaignType} onValueChange={setCampaignType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flash_sale">Flash Sale</SelectItem>
              <SelectItem value="birthday">Birthday</SelectItem>
              <SelectItem value="winback">Win-back</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Message (Variant A)</Label>
          <Textarea value={messageA} onChange={(e) => setMessageA(e.target.value)} rows={3} />
        </div>

        <div className="flex items-center space-x-2">
          <Switch checked={abTestEnabled} onCheckedChange={setAbTestEnabled} />
          <Label>Enable A/B Testing</Label>
        </div>

        {abTestEnabled && (
          <>
            <div>
              <Label>Message (Variant B)</Label>
              <Textarea value={messageB} onChange={(e) => setMessageB(e.target.value)} rows={3} />
            </div>
            <div>
              <Label>Split % (Variant B)</Label>
              <Input type="number" value={splitPercentage} onChange={(e) => setSplitPercentage(Number(e.target.value))} />
            </div>
          </>
        )}

        <div>
          <Label>Schedule</Label>
          <Select value={scheduleType} onValueChange={setScheduleType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Send Immediately</SelectItem>
              <SelectItem value="scheduled">Schedule for Later</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {scheduleType === 'scheduled' && (
          <div>
            <Label>Scheduled Time</Label>
            <Input type="datetime-local" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Switch checked={vipOnly} onCheckedChange={setVipOnly} />
          <Label>VIP Members Only</Label>
        </div>

        <Button onClick={handleCreateCampaign} disabled={loading} className="w-full">
          {loading ? 'Creating...' : 'Create Campaign'}
        </Button>
      </CardContent>
    </Card>
  );
}
