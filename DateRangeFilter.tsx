import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download } from 'lucide-react';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onExport: () => void;
}

export function DateRangeFilter({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange,
  onExport 
}: DateRangeFilterProps) {
  const setPreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    onStartDateChange(start.toISOString().split('T')[0]);
    onEndDateChange(end.toISOString().split('T')[0]);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setPreset(7)}>Last 7 Days</Button>
        <Button variant="outline" onClick={() => setPreset(30)}>Last 30 Days</Button>
        <Button variant="outline" onClick={() => setPreset(90)}>Last 90 Days</Button>
      </div>
      <div className="flex gap-2 items-center">
        <Input 
          type="date" 
          value={startDate} 
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-40"
        />
        <span>to</span>
        <Input 
          type="date" 
          value={endDate} 
          onChange={(e) => onEndDateChange(e.target.value)}
          className="w-40"
        />
      </div>
      <Button onClick={onExport} variant="outline">
        <Download className="w-4 h-4 mr-2" />
        Export CSV
      </Button>
    </div>
  );
}