# Twilio Voice Call Integration Setup Guide

## Overview
This system enables AI-powered voice call handling with automatic transcription, intelligent responses, voicemail management, and callback scheduling.

## Features
- **AI Voice Recognition**: Transcribes customer speech in real-time
- **Intelligent Responses**: Uses Gemini Flash AI to generate contextual responses
- **Text-to-Speech**: Converts AI responses to natural-sounding voice
- **Call Recording**: Automatically records all calls
- **Voicemail Transcription**: Transcribes voicemail messages
- **Callback Scheduling**: Manages missed calls and callback requests
- **Call Log Dashboard**: Admin interface to view all call history

## Database Tables Created
1. **voice_calls** - Stores call logs with transcriptions and AI responses
2. **voicemails** - Manages voicemail recordings and transcriptions
3. **scheduled_callbacks** - Tracks callback requests and scheduling

## Edge Functions Deployed
1. **handle-voice-call** - Initial call webhook handler
2. **process-voice-input** - Processes speech and generates AI responses
3. **handle-voicemail** - Manages voicemail recordings

## Twilio Configuration

### 1. Configure Voice Webhook
In your Twilio Console:
1. Go to Phone Numbers → Manage → Active Numbers
2. Select your phone number
3. Under "Voice & Fax", set:
   - **A Call Comes In**: Webhook
   - **URL**: `https://api.databasepad.com/functions/v1/handle-voice-call`
   - **HTTP Method**: POST

### 2. Enable Call Recording (Optional)
1. In the same phone number settings
2. Under "Voice Configuration":
   - Enable "Record Calls"
   - Set recording webhook to: `https://api.databasepad.com/functions/v1/handle-voicemail`

### 3. Configure Voicemail
1. Set up voicemail in Twilio Studio or via TwiML
2. Point recording callback to: `https://api.databasepad.com/functions/v1/handle-voicemail`

## How It Works

### Call Flow
1. Customer calls business number
2. Twilio triggers `handle-voice-call` function
3. AI greets customer and asks how it can help
4. Customer speaks their inquiry
5. `process-voice-input` transcribes speech
6. AI generates contextual response using conversation history
7. Response is converted to speech and played to customer
8. Process repeats until call ends

### AI Response Generation
- Uses Google Gemini Flash for fast, intelligent responses
- Considers conversation history for context
- Keeps responses concise (under 50 words) for voice
- Can access product catalog and order information

### Voicemail Handling
- If customer leaves voicemail, recording is saved
- Transcription is generated automatically
- Admins can view in Call Logs dashboard
- Can schedule callbacks from voicemail

## Admin Dashboard

Access the Call Logs dashboard at `/admin` → "Call Logs" tab.

### Features:
- **Call Statistics**: Total calls, average duration, escalations
- **Call History**: View all calls with transcriptions
- **AI Responses**: See what the AI said to customers
- **Escalation Tracking**: Identify calls that need human follow-up
- **Duration Tracking**: Monitor call lengths

## Customization

### Modify AI Voice
Edit the `voice` parameter in edge functions:
- Current: `Polly.Joanna` (female voice)
- Options: `Polly.Matthew`, `Polly.Salli`, `Polly.Joey`, etc.

### Adjust AI Behavior
Modify the system prompt in `process-voice-input`:
```typescript
{ 
  role: 'system', 
  content: 'You are a helpful customer service agent...' 
}
```

### Change Speech Timeout
Adjust `speechTimeout` in `handle-voice-call`:
```xml
<Gather input="speech" speechTimeout="3">
```

## Testing

### Test the System:
1. Call your Twilio phone number
2. Speak your inquiry when prompted
3. Listen to AI response
4. Check Call Logs dashboard for transcription

### Common Issues:
- **No response**: Check edge function logs
- **Poor transcription**: Ensure clear audio and proper speechTimeout
- **AI errors**: Verify GATEWAY_API_KEY is configured

## Best Practices

1. **Keep responses short**: Voice calls need concise answers
2. **Monitor escalations**: Review calls flagged for human follow-up
3. **Train the AI**: Use conversation history to improve responses
4. **Test regularly**: Call your number to ensure system works
5. **Review voicemails**: Check voicemails daily for urgent issues

## Next Steps

Consider adding:
- **Call routing**: Direct calls to specific departments
- **IVR menu**: Let customers choose options before AI
- **Sentiment analysis**: Track customer satisfaction during calls
- **Call analytics**: Measure response times and resolution rates
- **Multi-language support**: Handle calls in different languages
