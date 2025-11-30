import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export default function EventCreationForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    event_type: 'virtual',
    max_attendees: '',
    tier_required: 'Gold',
    image_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data, error } = await supabase.functions.invoke('create-vip-event', {
      body: {
        ...formData,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null
      }
    });

    if (error || data.error) {
      toast({ title: 'Failed to create event', variant: 'destructive' });
    } else {
      toast({ title: 'Event created successfully!' });
      setFormData({
        title: '',
        description: '',
        event_date: '',
        location: '',
        event_type: 'virtual',
        max_attendees: '',
        tier_required: 'Gold',
        image_url: ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border space-y-4">
      <h3 className="text-xl font-bold">Create VIP Event</h3>
      
      <Input
        placeholder="Event Title"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        required
      />
      
      <Textarea
        placeholder="Event Description"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        required
      />
      
      <Input
        type="datetime-local"
        value={formData.event_date}
        onChange={(e) => setFormData({...formData, event_date: e.target.value})}
        required
      />
      
      <Input
        placeholder="Location (URL for virtual, address for in-person)"
        value={formData.location}
        onChange={(e) => setFormData({...formData, location: e.target.value})}
        required
      />
      
      <Select value={formData.event_type} onValueChange={(v) => setFormData({...formData, event_type: v})}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="virtual">Virtual</SelectItem>
          <SelectItem value="in-person">In-Person</SelectItem>
          <SelectItem value="hybrid">Hybrid</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={formData.tier_required} onValueChange={(v) => setFormData({...formData, tier_required: v})}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Gold">Gold</SelectItem>
          <SelectItem value="Platinum">Platinum</SelectItem>
        </SelectContent>
      </Select>
      
      <Input
        type="number"
        placeholder="Max Attendees (optional)"
        value={formData.max_attendees}
        onChange={(e) => setFormData({...formData, max_attendees: e.target.value})}
      />
      
      <Input
        placeholder="Image URL (optional)"
        value={formData.image_url}
        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
      />
      
      <Button type="submit" className="w-full">Create Event</Button>
    </form>
  );
}