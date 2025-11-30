import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  tier: string;
  avatar_url?: string;
  bio?: string;
  total_points: number;
  joined_at: string;
}

export function MemberDirectory() {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const { data } = await supabase
      .from('vip_members')
      .select('*')
      .eq('is_public', true)
      .order('total_points', { ascending: false })
      .limit(50);

    if (data) setMembers(data);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-amber-500" />
        <h2 className="text-2xl font-bold">VIP Member Directory</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map(member => (
          <Card key={member.id} className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={member.avatar_url} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{member.name}</h3>
                <Badge variant={member.tier === 'Platinum' ? 'default' : 'secondary'} className="text-xs">
                  {member.tier}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">{member.bio || 'No bio yet'}</p>
                <p className="text-xs text-gray-500 mt-2">{member.total_points.toLocaleString()} points</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
