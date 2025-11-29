# Newsletter Integration Setup Guide

## Overview
The newsletter signup system is now integrated with both **ConvertKit** and **Mailchimp** APIs for automated email marketing and welcome sequences.

## Environment Variables
The following API keys are already configured in Supabase:
- `CONVERTKIT_API_KEY` - Your ConvertKit API key
- `MAILCHIMP_API_KEY` - Your Mailchimp API key

## Configuration Required

### ConvertKit Setup
1. **Get Your Form ID:**
   - Log into ConvertKit
   - Go to Forms → Select your form
   - Copy the Form ID from the URL or settings
   - Update line 47 in `newsletter-signup` function: `const formId = 'YOUR_FORM_ID';`

2. **Get Tag IDs (for segmentation):**
   - Go to Subscribers → Tags
   - Create tags like "Website Signup", "Footer Form", "Newsletter Page"
   - Copy tag IDs and update line 52: `tags: [TAG_ID_1, TAG_ID_2]`

3. **Set Up Welcome Automation:**
   - Go to Automations → Create New
   - Trigger: "Subscribes to a form" (select your form)
   - Add welcome email sequence
   - ConvertKit will automatically send this when users sign up

### Mailchimp Setup
1. **Get Your List ID:**
   - Log into Mailchimp
   - Go to Audience → Settings
   - Copy the Unique ID for this list
   - Update line 64 in `newsletter-signup` function: `const listId = 'YOUR_LIST_ID';`

2. **Set Up Tags (for segmentation):**
   - Tags are automatically applied: "WE DO NOT CARE CLUB" and source tag
   - You can customize tags on line 73

3. **Set Up Welcome Automation:**
   - Go to Campaigns → Create → Email → Automated
   - Choose "Welcome new subscribers"
   - Design your welcome email
   - Mailchimp will automatically send when users subscribe

## How It Works

### Signup Flow
1. User enters email in footer or newsletter page
2. Email is validated and stored in Supabase database
3. Email is synced to ConvertKit (if configured)
4. Email is synced to Mailchimp (if configured)
5. Welcome emails are triggered automatically by the platforms

### Segmentation & Tracking
- **Source tracking:** Each signup includes source ("footer", "newsletter_page", "website")
- **ConvertKit tags:** Applied automatically for segmentation
- **Mailchimp tags:** Applied automatically for list organization
- **Custom fields:** Source is passed to both platforms for advanced segmentation

## Testing

### Test the Integration
```bash
# Test signup via curl
curl -X POST https://api.databasepad.com/functions/v1/newsletter-signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","source":"test"}'
```

### Verify Success
1. Check Supabase database for new record
2. Check ConvertKit subscribers list
3. Check Mailchimp audience list
4. Verify welcome email was sent

## Privacy & Compliance
- Privacy notice is displayed on all signup forms
- Users are informed about email usage
- Emails are stored securely in Supabase
- Both platforms handle unsubscribe automatically

## Error Handling
- If ConvertKit sync fails, signup still succeeds (logged to console)
- If Mailchimp sync fails, signup still succeeds (logged to console)
- Supabase is the source of truth for all signups
- Duplicate emails are handled gracefully

## Next Steps
1. Replace placeholder IDs in the edge function
2. Set up welcome email sequences in ConvertKit/Mailchimp
3. Create segments for targeted campaigns
4. Monitor signup rates and engagement
