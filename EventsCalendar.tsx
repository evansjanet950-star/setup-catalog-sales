import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import EventCard from './EventCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface EventsCalendarProps {
  userEmail: string;
  userName: string;
  userTier: string;
}

export default function EventsCalendar({ userEmail, userName, userTier }: EventsCalendarProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [myRSVPs, setMyRSVPs] = useState<string[]>([]);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
    loadMyRSVPs();
  }, []);

  const loadEvents = async () => {
    const { data, error } = await supabase
      .from('vip_events')
      .select('*')
      .order('event_date', { ascending: true });

    if (error) {
      toast({ title: 'Error loading events', variant: 'destructive' });
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const loadMyRSVPs = async () => {
    const { data } = await supabase
      .from('vip_event_rsvps')
      .select('event_id')
      .eq('user_email', userEmail);

    setMyRSVPs(data?.map(r => r.event_id) || []);
  };

  const handleRSVP = async (eventId: string) => {
    const { data, error } = await supabase.functions.invoke('rsvp-to-event', {
      body: { event_id: eventId, user_email: userEmail, user_name: userName, tier: userTier }
    });

    if (error || data.error) {
      toast({ title: data?.error || 'Failed to RSVP', variant: 'destructive' });
    } else {
      toast({ title: 'RSVP Successful!', description: 'You will receive a reminder before the event.' });
      loadEvents();
      loadMyRSVPs();
    }
  };

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.event_date);
    const now = new Date();
    
    if (filter === 'upcoming' && eventDate <= now) return false;
    if (filter === 'past' && eventDate > now) return false;
    if (filter === 'my-rsvps' && !myRSVPs.includes(event.id)) return false;
    if (typeFilter !== 'all' && event.event_type !== typeFilter) return false;
    
    return true;
  });

  if (loading) return <div className="text-center py-8">Loading events...</div>;

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past Events</SelectItem>
            <SelectItem value="my-rsvps">My RSVPs</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="virtual">Virtual</SelectItem>
            <SelectItem value="in-person">In-Person</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <EventCard
            key={event.id}
            event={event}
            userTier={userTier}
            hasRSVPd={myRSVPs.includes(event.id)}
            onRSVP={handleRSVP}
          />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No events found matching your filters.
        </div>
      )}
    </div>
  );
}