# SMS Notification System Setup Guide

## Overview
SMS notification system integrated with Twilio for order confirmations, shipping updates, and restock alerts.

## Database Tables Created
- `sms_campaigns` - Track SMS campaign performance
- `sms_preferences` - Customer SMS subscription preferences
- `sms_events` - Individual SMS event tracking

## Edge Functions
1. **send-sms-notification** - Core SMS sending function with Twilio integration
2. **send-order-sms** - Send order confirmation and shipping update SMS

## Features Implemented
- Phone number collection during checkout
- SMS opt-in checkbox on checkout page
- SMS preferences in Communication Preferences page (/email-preferences)
- SMS campaign tracking in analytics dashboard
- Delivery rate and opt-out management

## Usage
Customers can:
1. Add phone number during checkout
2. Opt-in to SMS notifications
3. Manage SMS preferences at /email-preferences
4. Receive order confirmations and shipping updates via SMS

## Admin Features
- View SMS campaign metrics in Email Analytics dashboard
- Track delivery rates, failures, and opt-outs
- Monitor SMS campaign performance alongside email campaigns
