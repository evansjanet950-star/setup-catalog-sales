# Automated Email Cron Jobs Setup

This guide explains how to set up automated email campaigns using Supabase pg_cron extension.

## Prerequisites

- Supabase project with pg_cron extension enabled
- Edge functions deployed (send-scheduled-post-purchase, send-scheduled-restock, send-vip-weekly-digest)
- RESEND_API_KEY configured in Supabase secrets

## Enable pg_cron Extension

1. Go to your Supabase Dashboard
2. Navigate to **Database** → **Extensions**
3. Search for "pg_cron"
4. Click **Enable** on the pg_cron extension

## Setup Cron Jobs

Run the following SQL commands in your Supabase SQL Editor:

### 1. Post-Purchase Follow-up (Daily at 9:00 AM UTC)

```sql
SELECT cron.schedule(
  'send-post-purchase-followups',
  '0 9 * * *',
  $$
  SELECT
    net.http_post(
      url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-scheduled-post-purchase',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
    ) as request_id;
  $$
);
```

### 2. Restock Notifications (Every 6 hours)

```sql
SELECT cron.schedule(
  'send-restock-notifications',
  '0 */6 * * *',
  $$
  SELECT
    net.http_post(
      url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-scheduled-restock',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
    ) as request_id;
  $$
);
```

### 3. VIP Weekly Digest (Mondays at 10:00 AM UTC)

```sql
SELECT cron.schedule(
  'send-vip-weekly-digest',
  '0 10 * * 1',
  $$
  SELECT
    net.http_post(
      url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-vip-weekly-digest',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
    ) as request_id;
  $$
);
```

## Replace Placeholders

Before running the SQL commands, replace:
- `YOUR_PROJECT_REF` with your Supabase project reference (e.g., `abcdefghijklmnop`)
- `YOUR_ANON_KEY` with your Supabase anon/public key

Find these in: **Supabase Dashboard** → **Settings** → **API**

## Verify Cron Jobs

Check active cron jobs:

```sql
SELECT * FROM cron.job;
```

## View Cron Job Logs

Check execution history:

```sql
SELECT * FROM cron.job_run_details 
ORDER BY start_time DESC 
LIMIT 10;
```

## Unschedule a Job

If you need to remove a cron job:

```sql
SELECT cron.unschedule('job-name-here');
```

## Cron Schedule Format

The cron schedule uses standard cron syntax:
```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, Sunday = 0 or 7)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

### Common Examples:
- `0 9 * * *` - Daily at 9:00 AM
- `0 */6 * * *` - Every 6 hours
- `0 10 * * 1` - Mondays at 10:00 AM
- `*/30 * * * *` - Every 30 minutes
- `0 0 * * 0` - Sundays at midnight

## Manual Testing

You can manually trigger any scheduled job from the Admin Dashboard:
1. Go to `/admin`
2. Click the **Email Scheduler** tab
3. Click **Trigger Now** on any campaign

## Troubleshooting

### Jobs not running?
- Check pg_cron is enabled
- Verify your project URL and anon key are correct
- Check cron.job_run_details for error messages

### Emails not sending?
- Verify RESEND_API_KEY is set in Supabase secrets
- Check edge function logs: `supabase functions logs send-scheduled-post-purchase`
- Ensure email_preferences table has records with subscriptions enabled

## Email Campaign Flow

### Post-Purchase (7 days after order)
1. Cron runs daily at 9 AM
2. Finds orders from exactly 7 days ago
3. Checks if follow-up already sent
4. Sends email via Resend
5. Logs campaign in email_campaigns table

### Restock Notifications (every 6 hours)
1. Cron runs every 6 hours
2. Finds pending restock_notifications
3. Checks current inventory levels
4. Sends emails for items back in stock
5. Marks notifications as sent

### VIP Weekly Digest (Mondays at 10 AM)
1. Cron runs every Monday
2. Finds VIP members with email preferences enabled
3. Fetches upcoming VIP events
4. Sends personalized digest
5. Logs campaign

## Production Recommendations

- Set up monitoring alerts for failed cron jobs
- Review cron.job_run_details weekly
- Test all campaigns in staging before production
- Keep backup of cron job definitions
- Monitor email deliverability rates in Resend dashboard
