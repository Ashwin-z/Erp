import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Package, Plus, Search, AlertTriangle, TrendingDown,
  Warehouse, BarChart3, RefreshCw, Eye, Edit
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SOPGuide from '@/components/modules/SOPGuide';
import ModuleDashboard from '@/components/modules/ModuleDashboard';

const inventorySOP = {
  title: "Inventory Management Workflow",
  description: "Stock In → Storage → Stock Out → Reorder",
  steps: [
    { name: "Receiving", description: "Receive goods from purchase orders and update inventory.", checklist: ["Match PO with delivery", "Quality inspection", "Update stock qty", "Store in location"] },
    { name: "Storage", description: "Proper storage with location, batch, and expiry tracking.", checklist: ["Assign bin location", "Record batch/serial", "Set expiry alerts", "Update system"] },
    { name: "Picking", description: "Pick items for sales orders or transfers.", checklist: ["Generate pick list", "FIFO/FEFO selection", "Verify quantities", "Update reserved qty"] },
    { name: "Shipping", description: "Pack and ship items to customers.", checklist: ["Pack items", "Generate DO", "Update shipped qty", "Notify customer"] },
    { name: "Reorder", description: "AI-driven reorder suggestions based on consumption.", checklist: ["Review AI alerts", "Create PR/PO", "Approve order", "Track delivery"] }
  ]
};

export default function Inventory() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [searchTerm, setSearchTerm] = useState('');

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list('-created_date', 100)
  });

  const stats = [
    { label: 'Total SKUs', value: products.length || 1247, icon: Package, color: 'bg-blue-500', trend: 5 },
    { label: 'Low Stock Items', value: 23, icon: AlertTriangle, color: 'bg-amber-500', trend: -8 },
    { label: 'Warehouses', value: 8, icon: Warehouse, color: 'bg-purple-500', trend: 0 },
    { label: 'Stock Value', value: '$2.4M', icon: BarChart3, color: 'bg-emerald-500', trend: 12 }
  ];

  const sampleProducts = [
    { id: 1, sku: 'SKU-001', name: 'Premium Widget A', category: 'Electronics', warehouse: 'Main WH', location: 'A-12-3', quantity: 450, reorder_level: 100, cost_price: 25, selling_price: 45, status: 'active' },
    { id: 2, sku: 'SKU-002', name: 'Industrial Sensor B', category: 'Electronics', warehouse: 'Main WH', location: 'B-05-1', quantity: 85, reorder_level: 100, cost_price: 120, selling_price: 199, status: 'low_stock' },
    { id: 3, sku: 'SKU-003', name: 'Office Chair Pro', category: 'Furniture', warehouse: 'Secondary WH', location: 'C-01-5', quantity: 234, reorder_level: 50, cost_price: 150, selling_price: 299, status: 'active' },
    { id: 4, sku: 'SKU-004', name: 'Laptop Stand X1', category: 'Accessories', warehouse: 'Main WH', location: 'A-08-2', quantity: 12, reorder_level: 50, cost_price: 35, selling_price: 79, status: 'critical' },
    { id: 5, sku: 'SKU-005', name: 'Wireless Mouse Z', category: 'Electronics', warehouse: 'Main WH', location: 'A-10-1', quantity: 890, reorder_level: 200, cost_price: 18, selling_price: 39, status: 'active' }
  ];

  const getStockStatus = (qty, reorder) => {
    const ratio = qty / reorder;
    if (ratio <= 0.5) return { status: 'critical', color: 'bg-red-500', badge: 'bg-red-100 text-red-700' };
    if (ratio <= 1) return { status: 'low', color: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700' };
    return { status: 'ok', color: 'bg-green-500', badge: 'bg-green-100 text-green-700' };
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1800px] mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
                <p className="text-slate-500">Track stock levels, locations, and AI reorder predictions</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Stock Count
                </Button>
                <Button className="bg-lime-500 hover:bg-lime-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>

            {/* SOP Guide */}
            <SOPGuide {...inventorySOP} />

            {/* Dashboard Stats */}
            <ModuleDashboard stats={stats} />

            {/* AI Reorder Alerts */}
            <Card className="mb-6 border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <div className="flex-1">
                    <p className="font-medium text-amber-800">AI Reorder Alert: 5 items predicted to stockout within 14 days</p>
                    <p className="text-sm text-amber-600">Based on current consumption rate and lead times</p>
                  </div>
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700">Review & Reorder</Button>
                </div>
              </CardContent>
            </Card>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by SKU, name, or location..."
                className="pl-10 max-w-md"
              />
            </div>

            {/* Products Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Warehouse / Location</TableHead>
                      <TableHead>Stock Level</TableHead>
                      <TableHead>Cost / Sell</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleProducts.map((product) => {
                      const stockStatus = getStockStatus(product.quantity, product.reorder_level);
                      return (
                        <TableRow key={product.id}>
                          <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                          <TableCell>
                            <p className="font-medium">{product.name}</p>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{product.warehouse}</p>
                              <p className="text-xs text-slate-500">{product.location}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="w-32">
                              <div className="flex justify-between text-sm mb-1">
                                <span>{product.quantity}</span>
                                <span className="text-slate-400">/ {product.reorder_level}</span>
                              </div>
                              <Progress 
                                value={Math.min((product.quantity / product.reorder_level) * 50, 100)} 
                                className={`h-2 ${stockStatus.color}`}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">${product.cost_price}</p>
                              <p className="text-xs text-slate-500">${product.selling_price}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={stockStatus.badge}>{stockStatus.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}