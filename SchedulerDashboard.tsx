import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, Send, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface ScheduledJob {
  id: string;
  name: string;
  description: string;
  schedule: string;
  lastRun?: string;
  nextRun?: string;
  status: 'active' | 'paused' | 'running';
  endpoint: string;
}

const scheduledJobs: ScheduledJob[] = [
  {
    id: 'post-purchase',
    name: 'Post-Purchase Follow-ups',
    description: 'Sends follow-up emails 7 days after order completion',
    schedule: 'Daily at 9:00 AM UTC',
    endpoint: 'send-scheduled-post-purchase',
    status: 'active',
  },
  {
    id: 'restock',
    name: 'Restock Notifications',
    description: 'Notifies customers when requested products are back in stock',
    schedule: 'Every 6 hours',
    endpoint: 'send-scheduled-restock',
    status: 'active',
  },
  {
    id: 'vip-digest',
    name: 'VIP Weekly Digest',
    description: 'Sends weekly exclusive content to VIP members',
    schedule: 'Mondays at 10:00 AM UTC',
    endpoint: 'send-vip-weekly-digest',
    status: 'active',
  },
];

export function SchedulerDashboard() {
  const [jobs, setJobs] = useState(scheduledJobs);
  const [triggering, setTriggering] = useState<string | null>(null);
  const [lastResults, setLastResults] = useState<Record<string, any>>({});

  const handleManualTrigger = async (job: ScheduledJob) => {
    setTriggering(job.id);
    try {
      const { data, error } = await supabase.functions.invoke(job.endpoint);
      
      if (error) throw error;
      
      setLastResults(prev => ({
        ...prev,
        [job.id]: { success: true, ...data, timestamp: new Date().toISOString() }
      }));
      
      alert(`✓ ${job.name} triggered successfully!\n${data.message || ''}`);
    } catch (error: any) {
      setLastResults(prev => ({
        ...prev,
        [job.id]: { success: false, error: error.message, timestamp: new Date().toISOString() }
      }));
      alert(`✗ Error: ${error.message}`);
    } finally {
      setTriggering(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Email Scheduler</h2>
        <p className="text-gray-600">Automated email campaigns and manual triggers</p>
      </div>

      <div className="grid gap-4">
        {jobs.map(job => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {job.name}
                    <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                      {job.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{job.description}</CardDescription>
                </div>
                <Button
                  onClick={() => handleManualTrigger(job)}
                  disabled={triggering === job.id}
                  size="sm"
                >
                  {triggering === job.id ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-4 h-4 mr-2" /> Trigger Now</>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Schedule: {job.schedule}</span>
                </div>
                
                {lastResults[job.id] && (
                  <div className={`p-3 rounded-lg ${lastResults[job.id].success ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {lastResults[job.id].success ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="font-medium text-sm">
                        Last Run: {new Date(lastResults[job.id].timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {lastResults[job.id].message || lastResults[job.id].error}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Setup Cron Jobs</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800">
          <p className="mb-2">To enable automatic scheduling, set up cron jobs in Supabase:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Go to Supabase Dashboard → Database → Extensions</li>
            <li>Enable "pg_cron" extension</li>
            <li>Run the SQL commands in CRON_SETUP.md</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}