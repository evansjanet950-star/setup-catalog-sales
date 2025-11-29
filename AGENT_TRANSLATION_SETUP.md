# SMS Agent Translation System Setup Guide

## Overview
The SMS Agent Translation System enables customer service agents to respond in English while automatically translating messages to the customer's preferred language. The system includes translation quality indicators, bilingual message storage, and the ability to view both original and translated text.

## Features
- **Real-time Translation**: Agents type in English, messages are automatically translated
- **Translation Preview**: See translated message before sending
- **Quality Indicators**: AI-powered quality scores for each translation
- **Bilingual Storage**: Both original and translated versions stored in database
- **Toggle View**: Agents can view original or translated text in conversation history
- **Language Detection**: Automatic customer language preference tracking
- **Multi-language Support**: English, Spanish, French, German, Mandarin

## Database Schema

### Translation Columns (sms_conversations)
```sql
-- Original message (what agent typed in English)
original_message TEXT

-- Translated message (what customer received)
translated_message TEXT

-- Quality score from 0.00 to 1.00
translation_quality DECIMAL(3,2)

-- Whether message was translated
was_translated BOOLEAN DEFAULT false

-- Target language code
translation_language VARCHAR(10)
```

## Edge Function: translate-agent-message

### Purpose
Translates agent messages from English to customer's preferred language using AI Gateway.

### Request Body
```json
{
  "message": "Thank you for your order!",
  "targetLanguage": "es",
  "phoneNumber": "+1234567890"
}
```

### Response
```json
{
  "originalMessage": "Thank you for your order!",
  "translatedMessage": "¡Gracias por tu pedido!",
  "translationQuality": 0.95,
  "wasTranslated": true,
  "targetLanguage": "es",
  "phoneNumber": "+1234567890"
}
```

### Quality Scoring
- **0.90-1.00**: High Quality (Green badge)
- **0.70-0.89**: Good (Yellow badge)
- **0.00-0.69**: Review Needed (Red badge)

## Agent Message Composer Component

### Features
1. **English Input**: Agent types message in English
2. **Real-time Preview**: Translation appears automatically after 500ms
3. **Quality Badge**: Shows translation quality score
4. **Send Button**: Disabled until translation completes
5. **Auto-detection**: Detects customer's preferred language

### Usage in Dashboard
```tsx
<AgentMessageComposer
  phoneNumber={selectedPhone}
  targetLanguage={customerLanguage}
  onMessageSent={() => loadMessages(selectedPhone)}
/>
```

## Message Display Features

### Translation Badges
- **Language Badge**: Shows detected language with color coding
- **Translated Badge**: Purple badge indicating message was translated
- **Quality Badge**: Shows translation quality score

### Toggle Original/Translation
Agents can click button to switch between:
- **Original**: What agent typed in English
- **Translation**: What customer received in their language

## Workflow

### 1. Agent Composes Message
- Agent types message in English
- System detects customer's preferred language
- Translation preview appears automatically

### 2. Translation Process
- Message sent to `translate-agent-message` function
- AI Gateway translates using Gemini Flash model
- Quality score calculated based on AI confidence

### 3. Message Storage
```sql
INSERT INTO sms_conversations (
  customer_phone,
  message_direction,
  message_body,           -- Translated version
  original_message,       -- English version
  translated_message,     -- Translated version
  translation_quality,    -- Quality score
  was_translated,         -- true
  translation_language    -- Target language code
)
```

### 4. Message Sending
- Translated message sent via Twilio
- Customer receives message in their language
- Both versions stored for quality assurance

## Quality Assurance Features

### View Original Messages
Agents can review original English text to:
- Verify translation accuracy
- Understand what was actually sent
- Train and improve translations

### Quality Indicators
- Visual badges show translation quality
- Low quality scores flag messages for review
- Helps identify translation issues

### Audit Trail
- Complete history of original and translated text
- Timestamp tracking
- Language preference tracking

## Best Practices

### For Agents
1. **Write Clear English**: Simple, direct language translates better
2. **Avoid Idioms**: Idiomatic expressions may not translate well
3. **Check Preview**: Review translation before sending
4. **Watch Quality Scores**: Low scores may need manual review

### For Administrators
1. **Monitor Quality Scores**: Track average translation quality
2. **Review Low Scores**: Investigate messages with quality < 0.7
3. **Train Agents**: Provide feedback on effective writing
4. **Update Prompts**: Refine translation prompts based on results

## Language Support

### Supported Languages
- **en**: English (no translation needed)
- **es**: Spanish (Español)
- **fr**: French (Français)
- **de**: German (Deutsch)
- **zh**: Mandarin Chinese (中文)

### Language Preference Tracking
System automatically tracks customer language preferences:
- Detected from inbound messages
- Stored in `customer_language_preferences` table
- Used for all future agent responses

## Integration with Existing Systems

### SMS Response Handler
- Detects customer language from inbound messages
- Updates language preferences automatically
- Triggers appropriate translations

### Voice Call System
- Shares language preference data
- Consistent multi-channel experience
- Unified customer profile

## Troubleshooting

### Translation Not Appearing
- Check customer language preference in database
- Verify AI Gateway key is configured
- Check browser console for errors

### Low Quality Scores
- Review original message clarity
- Check for complex idioms or slang
- Consider manual translation for critical messages

### Message Not Sending
- Verify Twilio credentials
- Check phone number format
- Review error logs in edge function

## Future Enhancements

### Potential Improvements
1. **Translation Memory**: Store common phrases for consistency
2. **Manual Override**: Allow agents to edit translations
3. **Glossary Support**: Custom terminology for brand/product names
4. **Batch Translation**: Translate multiple messages at once
5. **A/B Testing**: Test different translation approaches

## Support

For issues or questions:
1. Check edge function logs: `read_recent_function_logs('translate-agent-message')`
2. Review database records for translation data
3. Monitor translation quality metrics
4. Test with different languages and message types
