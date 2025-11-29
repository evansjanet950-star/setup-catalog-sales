import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface TrainingItem {
  id: string;
  customer_phone: string;
  customer_message: string;
  bot_response: string;
  intent: string;
  entities: any;
  confidence_score: number;
  is_approved: boolean;
  admin_feedback: string;
  approved_response: string;
  created_at: string;
}

export default function AIBotTrainingDashboard() {
  const [trainingData, setTrainingData] = useState<TrainingItem[]>([]);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [improvedResponse, setImprovedResponse] = useState('');

  useEffect(() => {
    loadTrainingData();
  }, [filter]);

  const loadTrainingData = async () => {
    let query = supabase
      .from('sms_bot_training')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (filter === 'pending') {
      query = query.eq('is_approved', false);
    } else if (filter === 'approved') {
      query = query.eq('is_approved', true);
    }

    const { data } = await query;
    setTrainingData(data || []);
  };

  const approveResponse = async (id: string, approve: boolean) => {
    await supabase
      .from('sms_bot_training')
      .update({
        is_approved: approve,
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'admin'
      })
      .eq('id', id);
    loadTrainingData();
  };

  const saveImprovement = async (id: string) => {
    await supabase
      .from('sms_bot_training')
      .update({
        admin_feedback: feedback,
        approved_response: improvedResponse,
        is_approved: true,
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'admin'
      })
      .eq('id', id);
    setEditingId(null);
    setFeedback('');
    setImprovedResponse('');
    loadTrainingData();
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Bot Training Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
            <TabsList>
              <TabsTrigger value="pending">Pending Review</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="all">All Responses</TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="space-y-4 mt-4">
              {trainingData.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">{item.customer_phone}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(item.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Badge variant="outline">{item.intent}</Badge>
                          <div className={`w-2 h-2 rounded-full ${getConfidenceColor(item.confidence_score)}`} />
                          <span className="text-sm">{(item.confidence_score * 100).toFixed(0)}%</span>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-sm font-medium">Customer:</p>
                        <p className="text-sm">{item.customer_message}</p>
                      </div>

                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm font-medium">Bot Response:</p>
                        <p className="text-sm">{item.bot_response}</p>
                      </div>

                      {item.entities && Object.keys(item.entities).length > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">Entities: </span>
                          {JSON.stringify(item.entities)}
                        </div>
                      )}

                      {editingId === item.id ? (
                        <div className="space-y-3 border-t pt-3">
                          <Textarea
                            placeholder="Admin feedback..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={2}
                          />
                          <Textarea
                            placeholder="Improved response..."
                            value={improvedResponse}
                            onChange={(e) => setImprovedResponse(e.target.value)}
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button onClick={() => saveImprovement(item.id)}>
                              Save Improvement
                            </Button>
                            <Button variant="outline" onClick={() => setEditingId(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 border-t pt-3">
                          {!item.is_approved ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => approveResponse(item.id, true)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingId(item.id);
                                  setImprovedResponse(item.bot_response);
                                }}
                              >
                                <AlertCircle className="w-4 h-4 mr-1" />
                                Improve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => approveResponse(item.id, false)}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          ) : (
                            <Badge className="bg-green-600">Approved</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}