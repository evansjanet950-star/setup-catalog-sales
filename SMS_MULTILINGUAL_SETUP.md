# SMS Multi-Language Support Setup Guide

## Overview
The SMS chatbot system now supports automatic language detection and responses in 5 languages: English, Spanish, French, German, and Mandarin Chinese.

## Features
- **Automatic Language Detection**: AI detects customer's language from their first message
- **Language Preference Tracking**: Stores preferences in database for returning customers
- **Multi-Language AI Responses**: Contextual responses generated in customer's preferred language
- **Multi-Language Keywords**: Supports opt-out keywords in all languages (STOP, ALTO, ARRÊTER, STOPPEN, 停止)
- **Language Analytics**: Track conversations by language in admin dashboard

## Supported Languages
| Language | Code | Example Greeting |
|----------|------|------------------|
| English | en | "Hello! How can I help you?" |
| Spanish | es | "¡Hola! ¿Cómo puedo ayudarte?" |
| French | fr | "Bonjour! Comment puis-je vous aider?" |
| German | de | "Hallo! Wie kann ich Ihnen helfen?" |
| Mandarin | zh | "你好！我能帮你什么？" |

## How It Works

### 1. Language Detection Flow
```
Customer sends SMS → AI detects language → Saves preference → Responds in detected language
```

### 2. Returning Customer Flow
```
Customer sends SMS → Retrieves saved preference → Responds in preferred language
```

### 3. Database Schema
The system uses the shared `customer_language_preferences` table:
- `phone_number`: Customer's phone number
- `preferred_language`: Language code (en, es, fr, de, zh)
- `detection_method`: How language was detected (sms_auto, voice_ivr, etc.)
- `last_updated`: Timestamp of last update

## Edge Function: handle-sms-response

### Language Detection Process
1. Check if customer has saved language preference
2. If not, use AI to detect language from message content
3. Save detected language to database
4. Generate response in detected language

### Multi-Language Keywords
The system recognizes opt-out keywords in all languages:
- English: STOP, UNSUBSCRIBE
- Spanish: ALTO
- French: ARRÊTER
- German: STOPPEN
- Mandarin: 停止

### AI Prompt Structure
```javascript
const languageInstructions = {
  en: 'Respond in English.',
  es: 'Responde en español.',
  fr: 'Répondez en français.',
  de: 'Antworten Sie auf Deutsch.',
  zh: '用中文回复。'
};
```

## Admin Dashboard

### SMS Response Dashboard Features
- **Language Badges**: Each message displays language badge with color coding
- **Language Filtering**: View conversations by language
- **Language Analytics**: Track message volume by language

### Language Color Coding
- English (en): Blue
- Spanish (es): Orange
- French (fr): Purple
- German (de): Green
- Mandarin (zh): Red

## Testing Multi-Language SMS

### Test Scenarios

#### 1. Spanish Customer
```
Customer: "Hola, ¿cuánto cuesta el producto?"
Bot: "¡Hola! Nuestros productos varían en precio. ¿Qué producto te interesa?"
```

#### 2. French Customer
```
Customer: "Bonjour, je voudrais commander"
Bot: "Bonjour! Je serais ravi de vous aider avec votre commande."
```

#### 3. German Customer
```
Customer: "Guten Tag, ich habe eine Frage"
Bot: "Guten Tag! Wie kann ich Ihnen helfen?"
```

#### 4. Mandarin Customer
```
Customer: "你好，我想买东西"
Bot: "你好！我很乐意帮助您购物。"
```

## Best Practices

### 1. Message Length
- Keep responses under 160 characters per SMS segment
- AI is instructed to generate concise responses
- Multi-byte characters (Chinese) count as more characters

### 2. Cultural Considerations
- AI generates culturally appropriate responses
- Formal vs informal language based on context
- Appropriate greetings and closings

### 3. Fallback Handling
- If language detection fails, defaults to English
- Customers can always text in their preferred language
- System will adapt to detected language

### 4. Opt-Out Compliance
- All opt-out keywords work regardless of language
- Confirmation messages sent in customer's language
- Compliant with SMS regulations globally

## Integration with Voice Calls

The SMS system shares the `customer_language_preferences` table with the voice call system:
- Language preference set via SMS applies to voice calls
- Language preference set via voice IVR applies to SMS
- Seamless multi-channel language experience

## Monitoring & Analytics

### Key Metrics to Track
1. **Messages by Language**: Volume of conversations per language
2. **Response Quality**: AI confidence scores by language
3. **Opt-Out Rates**: Compare across languages
4. **Agent Handoff Rates**: Track by language for quality assessment

### Database Queries

#### Get Language Distribution
```sql
SELECT detected_language, COUNT(*) as message_count
FROM sms_conversations
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY detected_language
ORDER BY message_count DESC;
```

#### Get Customer Language Preferences
```sql
SELECT preferred_language, COUNT(*) as customer_count
FROM customer_language_preferences
WHERE detection_method = 'sms_auto'
GROUP BY preferred_language;
```

## Troubleshooting

### Issue: Wrong Language Detected
**Solution**: Language preferences are stored. Customer can send a message in their preferred language and the system will update the preference.

### Issue: Mixed Language Conversation
**Solution**: System detects language per message. If customer switches languages, responses will adapt.

### Issue: Special Characters Not Displaying
**Solution**: Ensure SMS provider supports Unicode/UTF-8 encoding for international characters.

## Future Enhancements
- Add more languages (Italian, Portuguese, Japanese, Korean)
- Implement language selection via SMS command (e.g., "LANGUAGE ES")
- Add translation API for agent responses
- Support for regional dialects and variations
- Emoji support based on cultural preferences

## Support
For issues or questions about multi-language SMS support, check the SMS Response Dashboard in the admin panel or review conversation logs for language detection accuracy.
