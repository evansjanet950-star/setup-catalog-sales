import { Card } from '@/components/ui/card';
import { MessageSquare, CheckCircle, XCircle, UserX } from 'lucide-react';

interface SMSMetricsCardsProps {
  totalSent: number;
  delivered: number;
  failed: number;
  optOuts: number;
}

export default function SMSMetricsCards({ totalSent, delivered, failed, optOuts }: SMSMetricsCardsProps) {
  const deliveryRate = totalSent > 0 ? ((delivered / totalSent) * 100).toFixed(1) : '0.0';
  const failureRate = totalSent > 0 ? ((failed / totalSent) * 100).toFixed(1) : '0.0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Sent</p>
            <p className="text-3xl font-bold mt-2">{totalSent.toLocaleString()}</p>
          </div>
          <MessageSquare className="w-12 h-12 text-blue-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Delivered</p>
            <p className="text-3xl font-bold mt-2">{delivered.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">{deliveryRate}% rate</p>
          </div>
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Failed</p>
            <p className="text-3xl font-bold mt-2">{failed.toLocaleString()}</p>
            <p className="text-xs text-red-600 mt-1">{failureRate}% rate</p>
          </div>
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Opt-Outs</p>
            <p className="text-3xl font-bold mt-2">{optOuts.toLocaleString()}</p>
          </div>
          <UserX className="w-12 h-12 text-orange-500" />
        </div>
      </Card>
    </div>
  );
}
