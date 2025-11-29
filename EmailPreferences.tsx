import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

export default function EmailPreferences() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({
    subscribe_marketing: true,
    subscribe_transactional: true,
    subscribe_abandoned_cart: true,
    subscribe_restock: true,
    subscribe_vip: false,
  });
  const [smsPrefs, setSmsPrefs] = useState({
    order_confirmations: true,
    shipping_updates: true,
    restock_alerts: true,
    marketing_messages: false,
    opted_out: false,
  });


  const loadPreferences = async (emailToLoad: string) => {
    const { data } = await supabase
      .from('email_preferences')
      .select('*')
      .eq('email', emailToLoad)
      .single();
    
    if (data) {
      setPrefs({
        subscribe_marketing: data.subscribe_marketing,
        subscribe_transactional: data.subscribe_transactional,
        subscribe_abandoned_cart: data.subscribe_abandoned_cart,
        subscribe_restock: data.subscribe_restock,
        subscribe_vip: data.subscribe_vip,
      });
    }

    // Load SMS preferences
    const { data: smsData } = await supabase
      .from('sms_preferences')
      .select('*')
      .eq('email', emailToLoad)
      .single();
    
    if (smsData) {
      setPhone(smsData.phone_number);
      setSmsPrefs({
        order_confirmations: smsData.order_confirmations,
        shipping_updates: smsData.shipping_updates,
        restock_alerts: smsData.restock_alerts,
        marketing_messages: smsData.marketing_messages,
        opted_out: smsData.opted_out,
      });
    }
  };

  const savePreferences = async () => {
    setLoading(true);
    try {
      await supabase.from('email_preferences').upsert({
        email,
        ...prefs,
        updated_at: new Date().toISOString(),
      });

      // Save SMS preferences if phone provided
      if (phone) {
        await supabase.from('sms_preferences').upsert({
          email,
          phone_number: phone,
          ...smsPrefs,
          updated_at: new Date().toISOString(),
        });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
    setLoading(false);
  };


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-2">Communication Preferences</h1>
          <p className="text-gray-600 mb-8">Manage your email and SMS subscriptions</p>

          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">Your Email</label>
            <div className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1"
              />
              <Button onClick={() => loadPreferences(email)} variant="outline">
                Load
              </Button>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4">Email Preferences</h2>
          <div className="space-y-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Marketing Emails</h3>
                <p className="text-sm text-gray-600">New products, sales, and promotions</p>
              </div>
              <Switch
                checked={prefs.subscribe_marketing}
                onCheckedChange={(checked) => setPrefs({ ...prefs, subscribe_marketing: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Order Updates</h3>
                <p className="text-sm text-gray-600">Shipping confirmations and receipts</p>
              </div>
              <Switch
                checked={prefs.subscribe_transactional}
                onCheckedChange={(checked) => setPrefs({ ...prefs, subscribe_transactional: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Abandoned Cart Reminders</h3>
                <p className="text-sm text-gray-600">Reminders about items left in your cart</p>
              </div>
              <Switch
                checked={prefs.subscribe_abandoned_cart}
                onCheckedChange={(checked) => setPrefs({ ...prefs, subscribe_abandoned_cart: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Restock Notifications</h3>
                <p className="text-sm text-gray-600">Alerts when products are back in stock</p>
              </div>
              <Switch
                checked={prefs.subscribe_restock}
                onCheckedChange={(checked) => setPrefs({ ...prefs, subscribe_restock: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">VIP Member Exclusives</h3>
                <p className="text-sm text-gray-600">Early access and VIP-only offers</p>
              </div>
              <Switch
                checked={prefs.subscribe_vip}
                onCheckedChange={(checked) => setPrefs({ ...prefs, subscribe_vip: checked })}
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">SMS Preferences</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Order Confirmations</h3>
                  <p className="text-sm text-gray-600">SMS alerts for order confirmations</p>
                </div>
                <Switch
                  checked={smsPrefs.order_confirmations}
                  onCheckedChange={(checked) => setSmsPrefs({ ...smsPrefs, order_confirmations: checked })}
                  disabled={!phone}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Shipping Updates</h3>
                  <p className="text-sm text-gray-600">SMS alerts when orders ship</p>
                </div>
                <Switch
                  checked={smsPrefs.shipping_updates}
                  onCheckedChange={(checked) => setSmsPrefs({ ...smsPrefs, shipping_updates: checked })}
                  disabled={!phone}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Restock Alerts</h3>
                  <p className="text-sm text-gray-600">SMS when items are back in stock</p>
                </div>
                <Switch
                  checked={smsPrefs.restock_alerts}
                  onCheckedChange={(checked) => setSmsPrefs({ ...smsPrefs, restock_alerts: checked })}
                  disabled={!phone}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Marketing Messages</h3>
                  <p className="text-sm text-gray-600">Promotional SMS messages</p>
                </div>
                <Switch
                  checked={smsPrefs.marketing_messages}
                  onCheckedChange={(checked) => setSmsPrefs({ ...smsPrefs, marketing_messages: checked })}
                  disabled={!phone}
                />
              </div>
            </div>
          </div>

          <Button
            onClick={savePreferences}
            disabled={!email || loading}
            className="w-full mt-8"
          >
            {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Preferences'}
          </Button>
        </Card>
      </div>
    </div>
  );
}
