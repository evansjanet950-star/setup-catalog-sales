import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Crown } from 'lucide-react';

interface MemberBenefitsCardProps {
  tier: string;
  name: string;
  points: number;
  memberSince: string;
}

export function MemberBenefitsCard({ tier, name, points, memberSince }: MemberBenefitsCardProps) {
  const downloadCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d')!;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 500);
    gradient.addColorStop(0, tier === 'Platinum' ? '#1e293b' : '#78350f');
    gradient.addColorStop(1, tier === 'Platinum' ? '#334155' : '#92400e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 500);

    // Card content
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.fillText('WE DO NOT CARE CLUB', 50, 80);
    
    ctx.font = '32px Arial';
    ctx.fillText(`${tier} Member`, 50, 140);
    
    ctx.font = '24px Arial';
    ctx.fillText(name, 50, 250);
    ctx.fillText(`${points.toLocaleString()} Points`, 50, 290);
    ctx.fillText(`Member Since: ${memberSince}`, 50, 330);

    // Download
    const link = document.createElement('a');
    link.download = `vip-card-${tier.toLowerCase()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-6 h-6 text-amber-500" />
        <h3 className="text-xl font-bold">Your VIP Benefits Card</h3>
      </div>
      <p className="text-gray-600 mb-4">Download your exclusive member card to access VIP benefits in-store and online.</p>
      <Button onClick={downloadCard} className="w-full">
        <Download className="w-4 h-4 mr-2" />
        Download Card
      </Button>
    </Card>
  );
}
