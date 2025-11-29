# Multi-Language Voice Call System Setup

## Overview
The voice call system now supports 5 languages with automatic detection and IVR menu selection:
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Mandarin Chinese (zh)

## Features
✅ Interactive IVR menu for language selection
✅ Automatic language detection from speech
✅ Language preference tracking per phone number
✅ AI responses in caller's preferred language
✅ Multi-language voicemail transcription
✅ Language badges in admin dashboard

## Database Schema

### customer_language_preferences
Tracks language preferences for each customer:
- `phone_number` - Customer's phone number (unique)
- `preferred_language` - Last selected/detected language
- `detected_languages` - Array of all detected languages
- `last_updated` - When preference was last updated

### Updated Tables
- `voice_calls.language` - Language used in the call
- `voicemails.language` - Language detected in voicemail

## How It Works

### First-Time Callers
1. Caller hears IVR menu in all 5 languages
2. Presses digit (1-5) to select language
3. Preference is saved to database
4. AI responds in selected language

### Returning Callers
1. System checks for saved language preference
2. Skips IVR menu and uses saved language
3. AI responds in preferred language immediately
4. Preference updated if different language detected

### Language Detection
- AI analyzes speech transcription
- Detects language automatically
- Updates preference if different from saved
- Works for both calls and voicemails

## Voice Configuration

### Polly Voices by Language
- English: Polly.Joanna
- Spanish: Polly.Lupe
- French: Polly.Celine
- German: Polly.Vicki
- Mandarin: Polly.Zhiyu

### Speech Recognition Languages
- English: en-US
- Spanish: es-ES
- French: fr-FR
- German: de-DE
- Mandarin: zh-CN

## Edge Functions

### handle-voice-call
- Shows IVR menu for new callers
- Loads saved language preference
- Routes to appropriate language flow
- Saves language selection

### process-voice-input
- Receives language parameter from IVR
- Generates AI responses in caller's language
- Detects language from transcription
- Updates language preference

### handle-voicemail
- Detects language from transcription
- Saves voicemail with language tag
- Updates customer language preference

## Admin Dashboard

The Call Log Dashboard now displays:
- Language badge for each call
- Language name (not just code)
- Filter calls by language (future enhancement)

## Testing

### Test Language Selection
1. Call your Twilio number
2. Listen to IVR menu
3. Press digit for desired language
4. Speak your inquiry in that language
5. Verify AI responds in same language

### Test Language Detection
1. Call and select English (press 1)
2. Speak in Spanish
3. AI should detect and respond in Spanish
4. Call again - should default to Spanish

### Test Returning Caller
1. Call and select a language
2. Hang up and call again
3. Should skip IVR and use saved language

## Customization

### Add New Language
1. Update `langMap` in handle-voice-call
2. Add voice and prompts to `langConfig` in process-voice-input
3. Update `getLanguageName()` in CallLogDashboard
4. Add to IVR menu in handle-voice-call

### Change Default Language
Update the default in database schema:
```sql
ALTER TABLE voice_calls 
ALTER COLUMN language SET DEFAULT 'es'; -- Change to your default
```

## Best Practices

1. **Keep Prompts Concise**: Voice responses should be under 50 words
2. **Test Each Language**: Verify AI quality for all supported languages
3. **Monitor Detection**: Check if language detection is accurate
4. **Update Preferences**: Allow customers to change language preference
5. **Fallback to English**: If detection fails, default to English

## Troubleshooting

### Language Not Detected
- Check transcription quality
- Ensure speech is clear
- Verify AI Gateway is working
- Check language detection prompt

### Wrong Language Response
- Verify language preference in database
- Check if detection is overriding saved preference
- Review AI prompt for language instruction

### IVR Menu Not Playing
- Verify Twilio webhook URL is correct
- Check edge function logs
- Ensure all voices are available in your region

## Future Enhancements

- Add more languages (Italian, Portuguese, Japanese, etc.)
- Language preference in customer portal
- Real-time translation for agent handoffs
- Language-specific knowledge base
- Multi-language SMS responses
