import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Package, Plus, Search, Truck, CheckCircle2, AlertTriangle,
  Eye, ClipboardCheck, FileText, Clock
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import SOPGuide from '../components/modules/SOPGuide';
import ModuleDashboard from '../components/modules/ModuleDashboard';

const grnSOP = {
  title: "Goods Receipt Note Workflow",
  description: "Receive → Inspect → Record → Store",
  steps: [
    { name: "Receive", description: "Receive goods from delivery.", checklist: ["Match PO number", "Count packages", "Check condition", "Sign delivery note"] },
    { name: "Inspect", description: "Quality inspection of received goods.", checklist: ["Visual inspection", "Quantity verification", "Quality check", "Document defects"] },
    { name: "Record", description: "Create GRN and update inventory.", checklist: ["Create GRN", "Update stock qty", "Record batch/serial", "Link to PO"] },
    { name: "Store", description: "Store goods in designated location.", checklist: ["Assign location", "Label items", "Update bin card", "FIFO placement"] }
  ]
};

export default function GRN() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { label: 'Pending Receipt', value: 12, icon: Truck, color: 'bg-amber-500', trend: -5 },
    { label: 'Received Today', value: 8, icon: Package, color: 'bg-blue-500', trend: 15 },
    { label: 'Quality Issues', value: 2, icon: AlertTriangle, color: 'bg-red-500', trend: -20 },
    { label: 'Completed', value: 156, icon: CheckCircle2, color: 'bg-green-500', trend: 12 }
  ];

  const grns = [
    { id: 'GRN-2024-089', po: 'PO-2024-089', vendor: 'Ace Supplies', date: '2024-12-20', items: 5, received: 5, status: 'completed', quality: 'passed' },
    { id: 'GRN-2024-088', po: 'PO-2024-088', vendor: 'TechSource', date: '2024-12-20', items: 3, received: 3, status: 'inspecting', quality: 'pending' },
    { id: 'GRN-2024-087', po: 'PO-2024-087', vendor: 'Global Parts', date: '2024-12-19', items: 8, received: 6, status: 'partial', quality: 'issues' },
    { id: 'GRN-2024-086', po: 'PO-2024-086', vendor: 'Prime Materials', date: '2024-12-19', items: 4, received: 4, status: 'completed', quality: 'passed' },
    { id: 'GRN-2024-085', po: 'PO-2024-085', vendor: 'Eastern Trading', date: '2024-12-18', items: 10, received: 10, status: 'completed', quality: 'passed' }
  ];

  const pendingDeliveries = [
    { po: 'PO-2024-090', vendor: 'Ace Supplies', expected: '2024-12-21', items: 6 },
    { po: 'PO-2024-091', vendor: 'TechSource', expected: '2024-12-22', items: 4 },
    { po: 'PO-2024-092', vendor: 'Global Parts', expected: '2024-12-23', items: 8 }
  ];

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    inspecting: 'bg-blue-100 text-blue-700',
    partial: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700'
  };

  const qualityColors = {
    pending: 'bg-slate-100 text-slate-700',
    passed: 'bg-green-100 text-green-700',
    issues: 'bg-red-100 text-red-700'
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
                <h1 className="text-2xl font-bold text-slate-900">Goods Receipt Note (GRN)</h1>
                <p className="text-slate-500">Receive, inspect, and record incoming goods</p>
              </div>
              <Button className="bg-lime-500 hover:bg-lime-600">
                <Plus className="w-4 h-4 mr-2" />
                New GRN
              </Button>
            </div>

            <SOPGuide {...grnSOP} />
            <ModuleDashboard stats={stats} />

            {/* Pending Deliveries */}
            <Card className="mb-6 border-amber-200 bg-amber-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-600" />
                  Expected Deliveries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {pendingDeliveries.map((delivery, i) => (
                    <div key={i} className="flex-shrink-0 bg-white rounded-lg p-3 border border-amber-200 min-w-[200px]">
                      <p className="font-mono text-sm font-medium">{delivery.po}</p>
                      <p className="text-sm text-slate-600">{delivery.vendor}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {delivery.expected}
                        </span>
                        <span>{delivery.items} items</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Search */}
            <div className="mb-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search GRNs..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* GRN Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>GRN #</TableHead>
                      <TableHead>PO #</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Received</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Quality</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grns.map((grn) => (
                      <TableRow key={grn.id}>
                        <TableCell className="font-mono font-medium">{grn.id}</TableCell>
                        <TableCell className="font-mono text-sm">{grn.po}</TableCell>
                        <TableCell>{grn.vendor}</TableCell>
                        <TableCell>{grn.date}</TableCell>
                        <TableCell>{grn.items}</TableCell>
                        <TableCell>
                          <span className={grn.received === grn.items ? 'text-green-600' : 'text-amber-600'}>
                            {grn.received}/{grn.items}
                          </span>
                        </TableCell>
                        <TableCell><Badge className={statusColors[grn.status]}>{grn.status}</Badge></TableCell>
                        <TableCell><Badge className={qualityColors[grn.quality]}>{grn.quality}</Badge></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon"><ClipboardCheck className="w-4 h-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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