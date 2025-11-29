import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StarRating } from '@/components/StarRating';
import { supabase } from '@/lib/supabase';
import { Check, X, Package, Send, Mail } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Analytics } from '@/components/Analytics';
import EventCreationForm from '@/components/admin/EventCreationForm';
import { InventoryManager } from '@/components/admin/InventoryManager';
import { EmailCampaignManager } from '@/components/admin/EmailCampaignManager';
import { SchedulerDashboard } from '@/components/admin/SchedulerDashboard';
import SMSCampaignCreator from '@/components/admin/SMSCampaignCreator';
import SMSSchedulerDashboard from '@/components/admin/SMSSchedulerDashboard';
import SMSResponseDashboard from '@/components/admin/SMSResponseDashboard';
import AIBotTrainingDashboard from '@/components/admin/AIBotTrainingDashboard';
import AgentHandoffDashboard from '@/components/admin/AgentHandoffDashboard';
import CallLogDashboard from '@/components/admin/CallLogDashboard';










export default function Admin() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [abandonedCarts, setAbandonedCarts] = useState<any[]>([]);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(false);
  const [trackingNumbers, setTrackingNumbers] = useState<{[key: string]: string}>({});
  const [sendingEmails, setSendingEmails] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchOrders();
    fetchAbandonedCarts();
  }, [filter]);


  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('status', filter)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchAbandonedCarts = async () => {
    try {
      const { data, error } = await supabase
        .from('abandoned_carts')
        .select('*')
        .eq('completed', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAbandonedCarts(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const sendAbandonedCartEmails = async () => {
    setSendingEmails(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-abandoned-cart-emails');
      
      if (error) throw error;
      
      alert(`Sent ${data.emailsSent?.length || 0} abandoned cart reminder emails`);
      fetchAbandonedCarts();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send emails');
    } finally {
      setSendingEmails(false);
    }
  };

  const updateReviewStatus = async (reviewId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('product_reviews')
        .update({ status })
        .eq('id', reviewId);

      if (error) throw error;
      fetchReviews();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const sendShippingNotification = async (order: any) => {
    const tracking = trackingNumbers[order.id];
    if (!tracking) {
      alert('Please enter a tracking number');
      return;
    }

    try {
      // Update order with tracking info
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          tracking_number: tracking,
          shipped_at: new Date().toISOString(),
          status: 'shipped'
        })
        .eq('id', order.id);

      if (updateError) throw updateError;

      // Send shipping email
      const { error: emailError } = await supabase.functions.invoke('send-order-email', {
        body: {
          email: order.email,
          customerName: order.customer_name,
          orderNumber: order.order_number,
          totalAmount: order.total_amount,
          shippingAddress: order.shipping_address,
          type: 'shipping'
        }
      });

      if (emailError) throw emailError;

      alert('Shipping notification sent!');
      fetchOrders();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send notification');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onCartClick={() => {}} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="analytics">
          <TabsList className="flex-wrap">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="abandoned-carts">Abandoned Carts</TabsTrigger>
            <TabsTrigger value="vip-events">VIP Events</TabsTrigger>
            <TabsTrigger value="email-campaigns">Email Campaigns</TabsTrigger>
            <TabsTrigger value="sms-campaigns">SMS Campaigns</TabsTrigger>
            <TabsTrigger value="sms-scheduler">SMS Scheduler</TabsTrigger>
            <TabsTrigger value="sms-responses">SMS Responses</TabsTrigger>
            <TabsTrigger value="ai-training">AI Bot Training</TabsTrigger>
            <TabsTrigger value="agent-handoffs">Agent Handoffs</TabsTrigger>
            <TabsTrigger value="call-logs">Call Logs</TabsTrigger>

          </TabsList>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManager />
          </TabsContent>

          <TabsContent value="reviews">
            <div className="flex gap-4 mb-8">
              <Button 
                variant={filter === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilter('pending')}
              >
                Pending
              </Button>
              <Button 
                variant={filter === 'approved' ? 'default' : 'outline'}
                onClick={() => setFilter('approved')}
              >
                Approved
              </Button>
              <Button 
                variant={filter === 'rejected' ? 'default' : 'outline'}
                onClick={() => setFilter('rejected')}
              >
                Rejected
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No {filter} reviews</div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-lg border">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-semibold text-lg">{review.customer_name}</div>
                        <div className="text-sm text-gray-500">{review.customer_email}</div>
                      </div>
                      <StarRating rating={review.rating} size={20} />
                    </div>
                    <h3 className="font-bold mb-2">{review.title}</h3>
                    <p className="text-gray-700 mb-4">{review.review_text}</p>
                    {filter === 'pending' && (
                      <div className="flex gap-2">
                        <Button onClick={() => updateReviewStatus(review.id, 'approved')} className="bg-green-600">
                          <Check className="w-4 h-4 mr-2" />Approve
                        </Button>
                        <Button onClick={() => updateReviewStatus(review.id, 'rejected')} variant="destructive">
                          <X className="w-4 h-4 mr-2" />Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-lg border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-bold text-lg">{order.order_number}</div>
                      <div className="text-sm text-gray-600">{order.customer_name}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl">${order.total_amount.toFixed(2)}</div>
                      <div className={`text-sm px-2 py-1 rounded ${
                        order.status === 'shipped' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                  
                  {order.status !== 'shipped' && (
                    <div className="flex gap-2 mt-4">
                      <Input
                        placeholder="Enter tracking number"
                        value={trackingNumbers[order.id] || ''}
                        onChange={(e) => setTrackingNumbers({...trackingNumbers, [order.id]: e.target.value})}
                      />
                      <Button onClick={() => sendShippingNotification(order)}>
                        <Send className="w-4 h-4 mr-2" />
                        Ship & Notify
                      </Button>
                    </div>
                  )}
                  
                  {order.tracking_number && (
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                      <Package className="w-4 h-4 inline mr-2" />
                      Tracking: {order.tracking_number}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="abandoned-carts">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Abandoned Carts ({abandonedCarts.length})</h2>
              <Button onClick={sendAbandonedCartEmails} disabled={sendingEmails}>
                <Mail className="w-4 h-4 mr-2" />
                {sendingEmails ? 'Sending...' : 'Send Reminder Emails'}
              </Button>
            </div>
            <div className="space-y-6">
              {abandonedCarts.map((cart) => {
                const total = cart.cart_data.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
                return (
                  <div key={cart.id} className="bg-white p-6 rounded-lg border">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-bold text-lg">{cart.email}</div>
                        <div className="text-sm text-gray-500">
                          Created: {new Date(cart.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl">${total.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">{cart.cart_data.length} items</div>
                      </div>
                    </div>
                    <div className="text-sm space-y-1">
                      <div>1h reminder: {cart.reminder_1h_sent ? '✓ Sent' : '✗ Not sent'}</div>
                      <div>24h reminder: {cart.reminder_24h_sent ? '✓ Sent' : '✗ Not sent'}</div>
                      <div>3d reminder: {cart.reminder_3d_sent ? '✓ Sent' : '✗ Not sent'}</div>
                      <div className="mt-2 font-mono text-xs">Discount: {cart.discount_code}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="vip-events">
            <EventCreationForm />
          </TabsContent>

          <TabsContent value="email-campaigns">
            <EmailCampaignManager />
          </TabsContent>

          <TabsContent value="scheduler">
            <SchedulerDashboard />
          </TabsContent>

          <TabsContent value="sms-campaigns">
            <SMSCampaignCreator />
          </TabsContent>

          <TabsContent value="sms-scheduler">
            <SMSSchedulerDashboard />
          </TabsContent>

          <TabsContent value="sms-responses">
            <SMSResponseDashboard />
          </TabsContent>

          <TabsContent value="ai-training">
            <AIBotTrainingDashboard />
          </TabsContent>

          <TabsContent value="agent-handoffs">
            <AgentHandoffDashboard />
          </TabsContent>

          <TabsContent value="call-logs">
            <CallLogDashboard />
          </TabsContent>



        </Tabs>







      </main>

      <Footer />
    </div>
  );
}
