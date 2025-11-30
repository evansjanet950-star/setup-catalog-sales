import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Video } from 'lucide-react';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    event_date: string;
    location: string;
    event_type: string;
    max_attendees: number | null;
    current_attendees: number;
    tier_required: string;
    image_url?: string;
  };
  userTier: string;
  hasRSVPd: boolean;
  onRSVP: (eventId: string) => void;
}

export default function EventCard({ event, userTier, hasRSVPd, onRSVP }: EventCardProps) {
  const eventDate = new Date(event.event_date);
  const isUpcoming = eventDate > new Date();
  const isFull = event.max_attendees && event.current_attendees >= event.max_attendees;
  
  const tierLevels: Record<string, number> = { 'Bronze': 1, 'Silver': 2, 'Gold': 3, 'Platinum': 4 };
  const canAttend = tierLevels[userTier] >= tierLevels[event.tier_required];

  return (
    <Card className="overflow-hidden">
      {event.image_url && (
        <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover" />
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{event.title}</CardTitle>
          <Badge variant={event.tier_required === 'Platinum' ? 'default' : 'secondary'}>
            {event.tier_required}
          </Badge>
        </div>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          {eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          {event.event_type === 'virtual' ? <Video className="w-4 h-4 mr-2" /> : <MapPin className="w-4 h-4 mr-2" />}
          {event.location}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="w-4 h-4 mr-2" />
          {event.current_attendees} {event.max_attendees ? `/ ${event.max_attendees}` : ''} attending
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onRSVP(event.id)} 
          disabled={!canAttend || !isUpcoming || isFull || hasRSVPd}
          className="w-full"
        >
          {hasRSVPd ? 'Already RSVP\'d' : isFull ? 'Event Full' : !canAttend ? 'Tier Required' : !isUpcoming ? 'Event Passed' : 'RSVP Now'}
        </Button>
      </CardFooter>
    </Card>
  );
}