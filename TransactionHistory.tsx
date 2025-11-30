import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Props {
  userEmail: string;
}

export default function TransactionHistory({ userEmail }: Props) {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, [userEmail]);

  const fetchTransactions = async () => {
    const { data } = await supabase
      .from('point_transactions')
      .select('*')
      .eq('email', userEmail)
      .order('created_at', { ascending: false })
      .limit(10);
    
    setTransactions(data || []);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No transactions yet</p>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {tx.type === 'earn' ? (
                    <div className="p-2 bg-green-100 rounded-full">
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    </div>
                  ) : (
                    <div className="p-2 bg-red-100 rounded-full">
                      <ArrowDown className="h-4 w-4 text-red-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`font-bold ${tx.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'earn' ? '+' : ''}{tx.points}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}