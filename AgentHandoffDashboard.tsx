import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, Clock, User } from 'lucide-react';

interface Handoff {
  id: string;
  customer_phone: string;
  customer_name: string;
  reason: string;
  priority: string;
  status: string;
  assigned_to: string;
  conversation_summary: string;
  notes: string;
  created_at: string;
  assigned_at: string;
  resolved_at: string;
}

export default function AgentHandoffDashboard() {
  const [handoffs, setHandoffs] = useState<Handoff[]>([]);
  const [filter, setFilter] = useState<string>('pending');
  const [selectedHandoff, setSelectedHandoff] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
    loadHandoffs();
  }, [filter]);

  const loadHandoffs = async () => {
    let query = supabase
      .from('sms_agent_handoffs')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data } = await query;
    setHandoffs(data || []);
  };

  const updateStatus = async (id: string, status: string) => {
    const updates: any = { status };
    if (status === 'assigned') updates.assigned_at = new Date().toISOString();
    if (status === 'resolved') updates.resolved_at = new Date().toISOString();

    await supabase
      .from('sms_agent_handoffs')
      .update(updates)
      .eq('id', id);
    loadHandoffs();
  };

  const assignAgent = async (id: string) => {
    await supabase
      .from('sms_agent_handoffs')
      .update({
        assigned_to: assignedTo,
        status: 'assigned',
        assigned_at: new Date().toISOString()
      })
      .eq('id', id);
    setSelectedHandoff(null);
    setAssignedTo('');
    loadHandoffs();
  };

  const addNotes = async (id: string) => {
    await supabase
      .from('sms_agent_handoffs')
      .update({ notes })
      .eq('id', id);
    setSelectedHandoff(null);
    setNotes('');
    loadHandoffs();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      default: return 'bg-blue-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'assigned': return <User className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agent Handoff Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {handoffs.map((handoff) => (
              <Card key={handoff.id}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(handoff.status)}
                          <span className="font-medium">{handoff.customer_phone}</span>
                          <Badge className={getPriorityColor(handoff.priority)}>
                            {handoff.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{handoff.customer_name}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(handoff.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline">{handoff.status}</Badge>
                    </div>

                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm font-medium">Reason:</p>
                      <p className="text-sm">{handoff.reason}</p>
                    </div>

                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm font-medium">Customer Message:</p>
                      <p className="text-sm">{handoff.conversation_summary}</p>
                    </div>

                    {handoff.assigned_to && (
                      <p className="text-sm">
                        <span className="font-medium">Assigned to:</span> {handoff.assigned_to}
                      </p>
                    )}

                    {handoff.notes && (
                      <div className="bg-yellow-50 p-3 rounded">
                        <p className="text-sm font-medium">Notes:</p>
                        <p className="text-sm">{handoff.notes}</p>
                      </div>
                    )}

                    {selectedHandoff === handoff.id ? (
                      <div className="space-y-3 border-t pt-3">
                        <Input
                          placeholder="Assign to agent..."
                          value={assignedTo}
                          onChange={(e) => setAssignedTo(e.target.value)}
                        />
                        <Textarea
                          placeholder="Add notes..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => assignAgent(handoff.id)}>
                            Assign
                          </Button>
                          <Button onClick={() => addNotes(handoff.id)}>
                            Save Notes
                          </Button>
                          <Button variant="outline" onClick={() => setSelectedHandoff(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 border-t pt-3">
                        {handoff.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => setSelectedHandoff(handoff.id)}
                          >
                            Assign Agent
                          </Button>
                        )}
                        {handoff.status === 'assigned' && (
                          <Button
                            size="sm"
                            onClick={() => updateStatus(handoff.id, 'resolved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Mark Resolved
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedHandoff(handoff.id);
                            setNotes(handoff.notes || '');
                          }}
                        >
                          Add Notes
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}