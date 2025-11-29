import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, Package, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export function InventoryManager() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-inventory', {
        body: {}
      });

      if (error) throw error;
      setInventory(data.inventory || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: "Error",
        description: "Failed to load inventory data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id: number, newStock: number) => {
    setUpdating(id);
    try {
      const item = inventory.find(i => i.id === id);
      const { error } = await supabase.functions.invoke('update-inventory', {
        body: {
          product_id: item.product_id,
          size: item.size,
          color: item.color,
          stock_quantity: newStock
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Stock level updated successfully.",
      });
      
      fetchInventory();
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock level.",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const lowStockItems = inventory.filter(item => 
    item.stock_quantity <= item.low_stock_threshold && item.stock_quantity > 0
  );

  const outOfStockItems = inventory.filter(item => item.stock_quantity === 0);

  if (loading) {
    return <div className="text-center py-8">Loading inventory...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <Button onClick={fetchInventory} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Alerts */}
      {outOfStockItems.length > 0 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">
              {outOfStockItems.length} item(s) out of stock
            </span>
          </div>
        </Card>
      )}

      {lowStockItems.length > 0 && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-center gap-2 text-amber-800">
            <Package className="w-5 h-5" />
            <span className="font-semibold">
              {lowStockItems.length} item(s) running low
            </span>
          </div>
        </Card>
      )}

      {/* Inventory Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Product ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Size</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Color</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {inventory.map((item) => (
                <InventoryRow
                  key={item.id}
                  item={item}
                  updating={updating === item.id}
                  onUpdate={(newStock) => updateStock(item.id, newStock)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function InventoryRow({ item, updating, onUpdate }: any) {
  const [editMode, setEditMode] = useState(false);
  const [newStock, setNewStock] = useState(item.stock_quantity);

  const getStatusColor = () => {
    if (item.stock_quantity === 0) return 'text-red-600';
    if (item.stock_quantity <= item.low_stock_threshold) return 'text-amber-600';
    return 'text-green-600';
  };

  const getStatusText = () => {
    if (item.stock_quantity === 0) return 'Out of Stock';
    if (item.stock_quantity <= item.low_stock_threshold) return 'Low Stock';
    return 'In Stock';
  };

  const handleSave = () => {
    onUpdate(newStock);
    setEditMode(false);
  };

  return (
    <tr>
      <td className="px-4 py-3 text-sm">{item.product_id}</td>
      <td className="px-4 py-3 text-sm">{item.size || 'N/A'}</td>
      <td className="px-4 py-3 text-sm">{item.color || 'N/A'}</td>
      <td className="px-4 py-3 text-sm">
        {editMode ? (
          <Input
            type="number"
            value={newStock}
            onChange={(e) => setNewStock(parseInt(e.target.value))}
            className="w-20"
            min="0"
          />
        ) : (
          item.stock_quantity
        )}
      </td>
      <td className="px-4 py-3 text-sm">
        <span className={`font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </td>
      <td className="px-4 py-3 text-sm">
        {editMode ? (
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={updating}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>
            Edit
          </Button>
        )}
      </td>
    </tr>
  );
}
