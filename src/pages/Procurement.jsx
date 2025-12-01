import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  ShoppingBag, Plus, Search, FileText, TrendingDown,
  Truck, CheckCircle2, Clock, Eye, Edit, Star, Sparkles
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import SOPGuide from '../components/modules/SOPGuide';
import ModuleDashboard from '../components/modules/ModuleDashboard';

const procurementSOP = {
  title: "Procurement Workflow Guide",
  description: "Request → PO → GRN → Invoice → Payment",
  steps: [
    { name: "Purchase Request", description: "Create and submit purchase requisition.", checklist: ["Identify need", "Get quotes", "Submit PR", "Approval workflow"] },
    { name: "Purchase Order", description: "Convert approved PR to purchase order.", checklist: ["Select vendor", "Confirm pricing", "Issue PO", "Send to vendor"] },
    { name: "Goods Receipt", description: "Receive and inspect delivered goods.", checklist: ["Receive delivery", "Quality check", "Create GRN", "Update inventory"] },
    { name: "Invoice Match", description: "Match vendor invoice to PO and GRN.", checklist: ["Receive invoice", "3-way match", "Resolve variances", "Approve payment"] },
    { name: "Payment", description: "Process vendor payment.", checklist: ["Schedule payment", "Execute transfer", "Update ledger", "Send remittance"] }
  ]
};

export default function Procurement() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [activeTab, setActiveTab] = useState('orders');

  const stats = [
    { label: 'Open POs', value: 23, icon: ShoppingBag, color: 'bg-blue-500', trend: 5 },
    { label: 'Pending GRN', value: 8, icon: Truck, color: 'bg-amber-500', trend: -12 },
    { label: 'This Month', value: '$245K', icon: TrendingDown, color: 'bg-purple-500', trend: 8 },
    { label: 'Avg Lead Time', value: '5.2 days', icon: Clock, color: 'bg-green-500', trend: -15 }
  ];

  const orders = [
    { id: 'PO-2024-089', vendor: 'Ace Supplies Pte Ltd', date: '2024-12-20', total: 12500, status: 'ordered', received: 0, vendorScore: 92 },
    { id: 'PO-2024-088', vendor: 'Global Parts Co', date: '2024-12-19', total: 8900, status: 'partial_received', received: 65, vendorScore: 85 },
    { id: 'PO-2024-087', vendor: 'TechSource SG', date: '2024-12-18', total: 45000, status: 'received', received: 100, vendorScore: 95 },
    { id: 'PO-2024-086', vendor: 'Prime Materials', date: '2024-12-17', total: 6750, status: 'pending_approval', received: 0, vendorScore: 78 },
    { id: 'PO-2024-085', vendor: 'Eastern Trading', date: '2024-12-16', total: 23400, status: 'approved', received: 0, vendorScore: 88 }
  ];

  const vendors = [
    { id: 1, name: 'Ace Supplies Pte Ltd', category: 'Electronics', orders: 45, totalSpend: 125000, score: 92, onTime: 96 },
    { id: 2, name: 'TechSource SG', category: 'Technology', orders: 32, totalSpend: 280000, score: 95, onTime: 98 },
    { id: 3, name: 'Global Parts Co', category: 'Components', orders: 67, totalSpend: 89000, score: 85, onTime: 88 },
    { id: 4, name: 'Prime Materials', category: 'Raw Materials', orders: 23, totalSpend: 156000, score: 78, onTime: 82 }
  ];

  const statusColors = {
    draft: 'bg-slate-100 text-slate-700',
    pending_approval: 'bg-amber-100 text-amber-700',
    approved: 'bg-blue-100 text-blue-700',
    ordered: 'bg-purple-100 text-purple-700',
    partial_received: 'bg-orange-100 text-orange-700',
    received: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Procurement</h1>
                <p className="text-slate-500">Purchase orders, vendor management, and goods receipt</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Suggest Vendor
                </Button>
                <Button className="bg-lime-500 hover:bg-lime-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New PO
                </Button>
              </div>
            </div>

            <SOPGuide {...procurementSOP} />
            <ModuleDashboard stats={stats} />

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
                <TabsTrigger value="grn">Goods Receipt</TabsTrigger>
                <TabsTrigger value="vendors">Vendors</TabsTrigger>
              </TabsList>

              <TabsContent value="orders">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>PO #</TableHead>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Received</TableHead>
                          <TableHead>Vendor Score</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-mono font-medium">{order.id}</TableCell>
                            <TableCell>{order.vendor}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell className="font-medium">${order.total.toLocaleString()}</TableCell>
                            <TableCell><Badge className={statusColors[order.status]}>{order.status.replace('_', ' ')}</Badge></TableCell>
                            <TableCell>{order.received}%</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Star className={`w-4 h-4 ${order.vendorScore >= 90 ? 'text-green-500' : order.vendorScore >= 80 ? 'text-amber-500' : 'text-red-500'}`} />
                                {order.vendorScore}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vendors">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Orders</TableHead>
                          <TableHead>Total Spend</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>On-Time %</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vendors.map((vendor) => (
                          <TableRow key={vendor.id}>
                            <TableCell className="font-medium">{vendor.name}</TableCell>
                            <TableCell>{vendor.category}</TableCell>
                            <TableCell>{vendor.orders}</TableCell>
                            <TableCell>${vendor.totalSpend.toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Star className={`w-4 h-4 ${vendor.score >= 90 ? 'text-green-500' : 'text-amber-500'}`} />
                                {vendor.score}
                              </div>
                            </TableCell>
                            <TableCell>{vendor.onTime}%</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">View</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  );
}