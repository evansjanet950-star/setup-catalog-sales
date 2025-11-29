# Email Notifications & Analytics Dashboard Setup Guide

## Overview
This guide covers setting up:
1. Order confirmation emails
2. Shipping notification emails
3. Abandoned cart recovery emails (1h, 24h, 3d intervals)
4. Comprehensive analytics dashboard

## 1. Resend API Setup

### Get Your API Key
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain or use their test domain
3. Get your API key from the dashboard

### Add to Supabase Secrets
```bash
supabase secrets set RESEND_API_KEY=re_your_api_key_here
```

## 2. Database Schema

### Orders Table (if not exists)
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address JSONB NOT NULL,
  order_items JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  tracking_number TEXT,
  shipped_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Abandoned Carts Table
```sql
CREATE TABLE abandoned_carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  cart_data JSONB NOT NULL,
  discount_code TEXT NOT NULL,
  reminder_1h_sent BOOLEAN DEFAULT FALSE,
  reminder_24h_sent BOOLEAN DEFAULT FALSE,
  reminder_3d_sent BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_abandoned_carts_email ON abandoned_carts(email);
CREATE INDEX idx_abandoned_carts_created ON abandoned_carts(created_at);
```

## 3. Edge Functions

### Function 1: send-order-email
**Purpose:** Send order confirmation and shipping notification emails

**Code:**
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  const { email, customerName, orderNumber, totalAmount, shippingAddress, type } = await req.json()

  const isShipping = type === 'shipping'
  const subject = isShipping ? `Your order ${orderNumber} has shipped!` : `Order Confirmation - ${orderNumber}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
        <h1 style="color: white; margin: 0;">WE DO NOT CARE CLUB</h1>
      </div>
      <div style="padding: 40px; background: #f9fafb;">
        <h2>${isShipping ? 'Your Order Has Shipped!' : 'Order Confirmed!'}</h2>
        <p>Hi ${customerName},</p>
        <p>${isShipping ? 'Great news! Your order is on its way.' : 'Thank you for your order!'}</p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Total:</strong> $${totalAmount.toFixed(2)}</p>
        </div>
        <p style="color: #6b7280;">Questions? Contact us at support@wedonotcareclub.com</p>
      </div>
    </div>
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'WE DO NOT CARE CLUB <orders@wedonotcareclub.com>',
      to: [email],
      subject,
      html
    })
  })

  return new Response(JSON.stringify(await res.json()), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### Function 2: save-abandoned-cart
**Purpose:** Save cart data when user adds items

**Code:**
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { email, cartData } = await req.json()
  
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const discountCode = `SAVE${Math.floor(Math.random() * 9000) + 1000}`

  const { data, error } = await supabaseClient
    .from('abandoned_carts')
    .upsert({
      email,
      cart_data: cartData,
      discount_code: discountCode,
      updated_at: new Date().toISOString()
    }, { onConflict: 'email' })

  return new Response(JSON.stringify({ success: !error, data }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### Function 3: send-abandoned-cart-emails
**Purpose:** Check for abandoned carts and send reminder emails

**Code:**
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { data: carts } = await supabaseClient
    .from('abandoned_carts')
    .select('*')
    .eq('completed', false)

  const emailsSent = []

  for (const cart of carts || []) {
    const hoursSince = (Date.now() - new Date(cart.created_at).getTime()) / (1000 * 60 * 60)
    
    let shouldSend = false
    let reminderType = ''
    let discount = 10

    if (hoursSince >= 72 && !cart.reminder_3d_sent) {
      shouldSend = true
      reminderType = 'reminder_3d_sent'
      discount = 20
    } else if (hoursSince >= 24 && !cart.reminder_24h_sent) {
      shouldSend = true
      reminderType = 'reminder_24h_sent'
      discount = 15
    } else if (hoursSince >= 1 && !cart.reminder_1h_sent) {
      shouldSend = true
      reminderType = 'reminder_1h_sent'
      discount = 10
    }

    if (shouldSend) {
      const total = cart.cart_data.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
            <h1 style="color: white;">WE DO NOT CARE CLUB</h1>
          </div>
          <div style="padding: 40px;">
            <h2>You left something behind!</h2>
            <p>Complete your order and save ${discount}% with code: <strong>${cart.discount_code}</strong></p>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              ${cart.cart_data.map((item: any) => `
                <div style="margin: 10px 0;">
                  <strong>${item.name}</strong> - $${item.price} x ${item.quantity}
                </div>
              `).join('')}
              <div style="border-top: 2px solid #e5e7eb; margin-top: 15px; padding-top: 15px;">
                <strong>Total: $${total.toFixed(2)}</strong>
              </div>
            </div>
            <a href="https://yoursite.com/checkout" style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px;">Complete Purchase</a>
          </div>
        </div>
      `

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'WE DO NOT CARE CLUB <cart@wedonotcareclub.com>',
          to: [cart.email],
          subject: `Don't miss out! ${discount}% off your cart`,
          html
        })
      })

      await supabaseClient
        .from('abandoned_carts')
        .update({ [reminderType]: true })
        .eq('id', cart.id)

      emailsSent.push(cart.email)
    }
  }

  return new Response(JSON.stringify({ emailsSent }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

## 4. Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy send-order-email
supabase functions deploy save-abandoned-cart
supabase functions deploy send-abandoned-cart-emails

# Set up cron job for abandoned cart emails (runs every hour)
# In Supabase Dashboard > Database > Extensions > pg_cron
SELECT cron.schedule(
  'send-abandoned-cart-reminders',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/send-abandoned-cart-emails',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  );
  $$
);
```

## 5. Analytics Dashboard

The analytics dashboard is now available in the Admin panel under the "Analytics" tab.

### Features:
- **Key Metrics Cards:** Total orders, revenue, conversion rate, cart recovery rate
- **Revenue Trends Chart:** Visual line chart showing daily revenue
- **Top Products Table:** Best-selling products by revenue
- **Date Range Filters:** Preset options (7, 30, 90 days) or custom range
- **CSV Export:** Download complete analytics report

### Usage:
1. Navigate to `/admin`
2. Click "Analytics" tab
3. Select date range or use presets
4. View metrics and charts
5. Click "Export CSV" to download report

## 6. Testing

### Test Order Confirmation
```bash
curl -X POST https://your-project.supabase.co/functions/v1/send-order-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "customerName": "Test User",
    "orderNumber": "ORD-12345",
    "totalAmount": 99.99,
    "type": "confirmation"
  }'
```

### Test Abandoned Cart
1. Add items to cart
2. Enter email in popup
3. Wait 1 hour
4. Check email for reminder

## 7. Customization

### Email Branding
Edit the HTML templates in edge functions to match your brand:
- Colors: Update gradient and button colors
- Logo: Add your logo URL
- Content: Customize messaging

### Analytics Metrics
Add custom metrics in `src/components/Analytics.tsx`:
```typescript
const customMetric = orders.filter(o => /* your logic */).length
```

## Support
For issues or questions, check:
- Supabase logs for edge function errors
- Resend dashboard for email delivery status
- Browser console for frontend errors
