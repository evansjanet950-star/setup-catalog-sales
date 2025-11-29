# SMS Response Handler Setup Guide

## Overview
Automated SMS response system that processes incoming customer replies with keyword detection, sentiment analysis, and automatic follow-up actions.

## Features Implemented

### 1. Keyword Detection & Auto-Responses
- **YES/INTERESTED**: Sends 15% discount code automatically
- **NO**: Polite acknowledgment with opt-out reminder
- **STOP/UNSUBSCRIBE**: Automatically unsubscribes customer
- **START**: Re-subscribes customer to SMS notifications
- **HELP**: Escalates to customer service team

### 2. Sentiment Analysis
- Uses AI Gateway (Gemini Flash) for real-time sentiment analysis
- Scores messages from -1 (negative) to 1 (positive)
- Labels: positive, negative, neutral
- Tracks sentiment trends per customer

### 3. Response Dashboard
- View all conversation threads
- See unread messages and escalations
- Full message history per customer
- Sentiment indicators for each message
- Real-time conversation view

## Twilio Webhook Setup

### Configure Twilio Webhook URL
1. Go to Twilio Console → Phone Numbers
2. Select your SMS-enabled phone number
3. Under "Messaging", set webhook URL:
   ```
   https://api.databasepad.com/functions/v1/handle-sms-response
   ```
4. Set HTTP method to POST
5. Save configuration

### Test Webhook
Send a test SMS to your Twilio number:
- "YES" → Should receive discount code
- "HELP" → Should escalate and get support message
- "STOP" → Should unsubscribe

## Database Tables

### sms_conversations
Stores all SMS messages (inbound and outbound):
- customer_phone, customer_email
- message_direction (inbound/outbound)
- message_body
- keyword_detected
- sentiment_score, sentiment_label
- auto_response_sent, escalated

### sms_response_rules
Configurable keyword responses:
- keyword (YES, NO, STOP, etc.)
- response_template
- action_type (send_discount, unsubscribe, escalate, send_info)
- discount_code, discount_percentage
- priority, active status

## Customizing Response Rules

Add custom keywords via SQL:
```sql
INSERT INTO sms_response_rules (keyword, response_template, action_type, discount_code, discount_percentage)
VALUES ('DEAL', 'Special deal! Use code {discount_code} for 20% off!', 'send_discount', 'DEAL20', 20);
```

## Admin Dashboard Access

Navigate to: `/admin` → "SMS Responses" tab

Features:
- View all conversation threads
- Click to see full conversation history
- Identify escalated conversations (red alert icon)
- See unread message counts
- Monitor sentiment trends

## Best Practices

1. **Response Times**: Auto-responses are instant
2. **Escalations**: Check HELP escalations daily
3. **Sentiment Monitoring**: Address negative sentiment quickly
4. **Opt-Out Compliance**: STOP is processed immediately
5. **Discount Codes**: Ensure codes are active in your system

## Integration with Other Systems

The response handler integrates with:
- SMS Preferences (opt-out management)
- Order System (customer identification)
- Analytics (response tracking)
- Campaign System (follow-up triggers)

## Troubleshooting

### Messages not being received:
- Verify Twilio webhook URL is correct
- Check edge function logs: Admin → Functions → handle-sms-response
- Ensure phone number format matches (E.164 format)

### Auto-responses not sending:
- Verify Twilio credentials in environment variables
- Check sms_response_rules table for active rules
- Review edge function logs for errors

### Sentiment analysis not working:
- Verify GATEWAY_API_KEY is configured
- Check API Gateway quota/limits
- Falls back to neutral if AI fails

## Future Enhancements

Potential additions:
- Multi-language support
- Custom response flows per campaign
- Integration with CRM systems
- Advanced sentiment analysis with emotion detection
- Automated escalation routing
