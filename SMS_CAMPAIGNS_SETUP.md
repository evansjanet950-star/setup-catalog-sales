# SMS Campaign System Setup Guide

## Overview
Comprehensive automated SMS marketing system with birthday messages, win-back campaigns, flash sales, A/B testing, and response tracking.

## Features Implemented

### 1. Automated SMS Campaigns
- **Birthday Messages**: Automatic birthday greetings with discount codes
- **Win-back Campaigns**: Re-engage inactive customers (60+ days)
- **Flash Sale Alerts**: Targeted promotional messages
- **A/B Testing**: Test message variations with split testing
- **Response Tracking**: Monitor customer responses and engagement

### 2. Database Tables Created
```sql
-- SMS scheduled campaigns
sms_scheduled_campaigns (id, campaign_name, campaign_type, message_template, 
  schedule_type, scheduled_time, ab_test_enabled, ab_variant_b_message, 
  ab_split_percentage, sent_count, delivered_count, failed_count, response_count)

-- Customer responses
sms_customer_responses (id, campaign_id, customer_email, phone_number, 
  response_text, response_type, received_at, follow_up_sent)

-- A/B test results
sms_ab_test_results (id, campaign_id, variant, customer_email, 
  sent_at, delivered, responded, response_text)

-- Customer activity tracking
customer_activity (id, customer_email, last_order_date, total_orders, 
  total_spent, last_activity_date, is_inactive, winback_sent)

-- Birthday tracking (added to sms_preferences)
birthday, birthday_sms_sent_this_year
```

### 3. Edge Functions Created

#### send-birthday-sms
- Sends birthday messages with 20% discount code
- Checks for birthdays matching today's date
- Marks customers as sent for the year
- Respects SMS preferences

#### send-winback-sms
- Targets customers inactive for 60+ days
- Sends 25% discount code (14-day validity)
- Updates customer activity tracking
- One-time send per customer

#### send-flash-sale-sms
- Sends promotional messages to targeted audiences
- Supports A/B testing with message variations
- Tracks delivery and response rates
- VIP-only targeting option

### 4. Admin Dashboard Components

#### SMSCampaignCreator
- Create new SMS campaigns
- Configure A/B testing
- Set scheduling (immediate or scheduled)
- Target specific audiences (VIP, all customers)
- Message preview and validation

#### SMSSchedulerDashboard
- View all scheduled campaigns
- Monitor campaign performance
- Manual trigger for campaigns
- Real-time status updates
- Delivery and response metrics

## Setup Instructions

### 1. Set Up Cron Jobs
Create cron jobs in your Supabase database to automate campaigns:

```sql
-- Birthday SMS (daily at 9 AM)
SELECT cron.schedule(
  'send-birthday-sms-daily',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url:='YOUR_SUPABASE_URL/functions/v1/send-birthday-sms',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  ) AS request_id;
  $$
);

-- Win-back SMS (weekly on Mondays at 10 AM)
SELECT cron.schedule(
  'send-winback-sms-weekly',
  '0 10 * * 1',
  $$
  SELECT net.http_post(
    url:='YOUR_SUPABASE_URL/functions/v1/send-winback-sms',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  ) AS request_id;
  $$
);
```

### 2. Customer Data Collection
Phone numbers are collected during:
- Checkout process (with SMS opt-in checkbox)
- Email preferences page (Communication Preferences)
- VIP membership signup

### 3. Campaign Creation Workflow
1. Go to Admin Dashboard → SMS Campaigns tab
2. Fill in campaign details:
   - Campaign name
   - Campaign type (birthday, winback, flash_sale, custom)
   - Message content (Variant A)
   - Enable A/B testing (optional)
   - Message Variant B (if A/B testing)
   - Split percentage for Variant B
   - Schedule type (immediate or scheduled)
   - Target audience filters
3. Click "Create Campaign"

### 4. A/B Testing
- Enable A/B testing in campaign creator
- Write two message variations
- Set split percentage (e.g., 50% for equal split)
- System automatically tracks which variant performs better
- View results in SMS Scheduler dashboard

### 5. Response Tracking
Responses are automatically tracked in `sms_customer_responses` table:
- Positive responses trigger follow-up actions
- Negative responses pause future campaigns
- Opt-out responses update preferences
- Response analytics available in dashboard

## Usage Examples

### Birthday Campaign
```
Message: "🎉 Happy Birthday! Enjoy 20% off your next purchase with code BDAY20. Valid for 7 days. Reply STOP to opt out."
```

### Win-back Campaign
```
Message: "We miss you! Come back and get 25% off your next order with code WELCOME25. Valid for 14 days. Reply STOP to opt out."
```

### Flash Sale
```
Variant A: "⚡ FLASH SALE! 30% off everything for the next 4 hours. Shop now: [link]"
Variant B: "Limited Time: Save 30% on your favorite items. Ends in 4 hours! [link]"
```

## Best Practices

1. **Timing**: Send campaigns during business hours (9 AM - 7 PM)
2. **Frequency**: Limit to 2-3 marketing messages per week
3. **Personalization**: Use customer names and purchase history
4. **Clear CTAs**: Include specific actions and discount codes
5. **Opt-out**: Always include "Reply STOP to opt out"
6. **A/B Testing**: Test subject lines, CTAs, and timing
7. **Segmentation**: Target specific customer groups
8. **Compliance**: Follow TCPA regulations

## Monitoring & Analytics

### Key Metrics
- Sent count
- Delivered count
- Failed count
- Response count
- Opt-out rate
- Conversion rate (track via discount codes)

### Dashboard Views
- Campaign performance overview
- A/B test results comparison
- Customer response timeline
- Delivery success rates
- Revenue attribution

## Troubleshooting

### Messages Not Sending
- Check Twilio credentials in Supabase secrets
- Verify phone number format (+1XXXXXXXXXX)
- Confirm SMS preferences are enabled
- Check edge function logs

### Low Delivery Rates
- Validate phone numbers
- Check Twilio account balance
- Review message content for spam triggers
- Verify customer opt-in status

### A/B Test Not Working
- Ensure ab_test_enabled is true
- Verify ab_variant_b_message is set
- Check split_percentage value (1-100)
- Review campaign status

## Future Enhancements
- Automated follow-ups based on responses
- Advanced segmentation rules
- Multi-step campaign sequences
- SMS + Email coordinated campaigns
- Predictive send time optimization
- Customer journey automation
