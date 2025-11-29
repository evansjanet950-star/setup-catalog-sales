# AI-Powered SMS Chatbot Setup Guide

## Overview
This guide covers the setup of an intelligent SMS chatbot that handles complex customer inquiries using AI, with intent classification, entity extraction, and seamless agent handoff capabilities.

## Features
- **AI-Powered Responses**: Uses Google Gemini Flash via API Gateway for contextual responses
- **Intent Classification**: Automatically categorizes customer inquiries (product_inquiry, order_status, support, etc.)
- **Entity Extraction**: Identifies products, order IDs, and issues from customer messages
- **Conversation Context**: Maintains conversation history for better responses
- **Product Catalog Integration**: Bot has access to product information for accurate answers
- **Order Status Lookup**: Can check recent orders for the customer
- **Agent Handoff**: Automatically escalates complex queries to human agents
- **Training Dashboard**: Admins can review and improve bot responses
- **Confidence Scoring**: Low-confidence responses trigger agent handoff

## Database Tables Created
1. **sms_bot_training** - Stores all bot interactions for training
2. **sms_agent_handoffs** - Manages escalations to human agents
3. **sms_bot_metrics** - Tracks bot performance metrics

## How It Works

### 1. Customer Sends SMS
When a customer texts your Twilio number, the message is received by the `handle-sms-response` edge function.

### 2. Simple Keywords (Fast Path)
For basic keywords like STOP, START, YES, NO - the bot uses predefined responses from `sms_response_rules` table.

### 3. Complex Queries (AI Path)
For everything else, the bot:
- Retrieves conversation history (last 5 messages)
- Fetches product catalog for context
- Looks up customer's recent orders
- Sends all context to Gemini Flash AI
- AI returns: intent, entities, response, confidence score, needs_human flag

### 4. Response Generation
The AI generates a response based on:
- Customer's question
- Conversation history
- Available products
- Customer's order history
- Company policies

### 5. Agent Handoff (When Needed)
Bot automatically escalates to human agent when:
- Confidence score < 0.6
- AI determines query needs human (complex issue, complaint, etc.)
- Customer explicitly asks for help

## Admin Dashboards

### AI Bot Training Dashboard
**Location**: Admin → AI Bot Training tab

**Features**:
- View all bot interactions with confidence scores
- Filter by pending/approved/all responses
- Approve good responses
- Provide feedback and improved responses
- Train the bot over time

**Usage**:
1. Review pending bot responses daily
2. Approve accurate responses
3. For incorrect responses, click "Improve"
4. Provide feedback explaining what was wrong
5. Write an improved response
6. Save - this trains the bot for future similar queries

### Agent Handoff Dashboard
**Location**: Admin → Agent Handoffs tab

**Features**:
- View all escalated conversations
- Filter by status (pending/assigned/resolved)
- Assign conversations to specific agents
- Add notes to conversations
- Mark conversations as resolved
- Priority indicators (urgent/high/medium/low)

**Usage**:
1. Check pending handoffs regularly
2. Click "Assign Agent" and enter agent name
3. Add notes about the customer's issue
4. Handle the customer inquiry via SMS or phone
5. Mark as "Resolved" when complete

## Best Practices

### For Admins
1. **Review Training Data Daily**: Check AI Bot Training tab to improve accuracy
2. **Monitor Handoffs**: Respond to escalated conversations within 1 hour
3. **Provide Detailed Feedback**: When improving responses, explain why the original was wrong
4. **Track Patterns**: If many similar queries are escalated, add them to training data

### For Bot Responses
- Keep responses under 160 characters when possible
- Be friendly and helpful
- Include specific product names when relevant
- Provide order numbers when discussing orders
- Always offer to escalate if customer is frustrated

### For Agent Handoffs
- High priority: Complaints, urgent issues, angry customers
- Medium priority: Complex product questions, order modifications
- Low priority: General inquiries that just need human touch

## Example Conversations

### Product Inquiry (AI Handled)
**Customer**: "Do you have any red t-shirts in stock?"
**Bot**: "Yes! We have the Classic Red Tee for $29.99 in sizes S-XXL. Would you like to order one? Reply YES to get a link."

### Order Status (AI Handled)
**Customer**: "Where is my order?"
**Bot**: "I see your recent order #ABC123 for $89.99. It shipped yesterday! Tracking: 1Z999. Expect delivery in 2-3 days."

### Complex Issue (Agent Handoff)
**Customer**: "I received the wrong item and need a refund immediately"
**Bot**: "I'm sorry about that! This requires immediate attention. A specialist will reach out shortly to resolve this for you."
*[Creates agent handoff with HIGH priority]*

## Monitoring Performance

### Bot Metrics
Check `sms_bot_metrics` table for daily stats:
- Total messages received
- AI-handled vs keyword-handled
- Agent handoff rate
- Average confidence score

### Success Indicators
- **High confidence scores** (>0.8): Bot is learning well
- **Low handoff rate** (<20%): Bot handling most queries
- **Quick response times**: Customers getting instant help
- **Positive feedback**: Customers satisfied with bot responses

## Troubleshooting

### Bot gives wrong answers
1. Go to AI Bot Training dashboard
2. Find the incorrect response
3. Click "Improve" and provide correct answer
4. Add feedback explaining the context
5. Save - bot will learn for next time

### Too many handoffs
1. Review common handoff reasons in Agent Handoff dashboard
2. Add training data for those query types
3. Update product catalog if information is missing
4. Consider adding more response rules for common patterns

### Slow responses
1. Check API Gateway status
2. Verify Gemini Flash model is responding
3. Review conversation history size (limit to 5 messages)
4. Check product catalog query performance

## Integration with Existing Systems

The AI chatbot integrates with:
- **SMS Campaigns**: Uses same phone number and preferences
- **Order System**: Accesses order data for status updates
- **Product Catalog**: References products table for accurate info
- **Customer Preferences**: Respects opt-in/opt-out status

## Next Steps

1. **Test the Bot**: Send various queries to your Twilio number
2. **Train Responses**: Review and improve bot answers in training dashboard
3. **Monitor Handoffs**: Ensure human agents respond quickly
4. **Analyze Patterns**: Look for common queries to optimize responses
5. **Expand Knowledge**: Add more product details and FAQs to improve accuracy

## Support

For issues or questions:
1. Check bot training dashboard for recent interactions
2. Review agent handoff dashboard for escalated issues
3. Monitor sms_conversations table for full message history
4. Check edge function logs for technical errors
