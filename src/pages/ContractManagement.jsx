import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  FileText, Plus, Search, Calendar, AlertTriangle, CheckCircle2,
  Clock, DollarSign, Sparkles, Eye, Edit, Bell
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ModuleDashboard from '../components/modules/ModuleDashboard';

export default function ContractManagement() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [activeTab, setActiveTab] = useState('all');

  const stats = [
    { label: 'Active Contracts', value: 89, icon: FileText, color: 'bg-blue-500', trend: 8 },
    { label: 'Expiring Soon', value: 7, icon: AlertTriangle, color: 'bg-amber-500', trend: 0 },
    { label: 'Total Value', value: '$2.4M', icon: DollarSign, color: 'bg-green-500', trend: 15 },
    { label: 'Renewal Rate', value: '94%', icon: CheckCircle2, color: 'bg-purple-500', trend: 5 }
  ];

  const contracts = [
    { id: 'CON-2024-045', title: 'Annual Service Agreement', party: 'TechStart Pte Ltd', type: 'customer', value: 125000, start: '2024-01-01', end: '2024-12-31', status: 'active', daysLeft: 11, autoRenew: true },
    { id: 'CON-2024-044', title: 'Software License - SAP', party: 'SAP SE', type: 'vendor', value: 85000, start: '2024-06-01', end: '2025-05-31', status: 'active', daysLeft: 162, autoRenew: false },
    { id: 'CON-2024-043', title: 'Office Lease Agreement', party: 'CapitaLand', type: 'lease', value: 240000, start: '2023-01-01', end: '2025-12-31', status: 'active', daysLeft: 371, autoRenew: true },
    { id: 'CON-2024-042', title: 'NDA - Global Logistics', party: 'Global Logistics SG', type: 'nda', value: 0, start: '2024-03-15', end: '2026-03-14', status: 'active', daysLeft: 449, autoRenew: false },
    { id: 'CON-2024-041', title: 'Maintenance Contract', party: 'Ace Supplies', type: 'service', value: 12000, start: '2024-01-01', end: '2024-12-31', status: 'expiring', daysLeft: 11, autoRenew: false }
  ];

  const statusColors = {
    draft: 'bg-slate-100 text-slate-700',
    pending_approval: 'bg-amber-100 text-amber-700',
    active: 'bg-green-100 text-green-700',
    expiring: 'bg-red-100 text-red-700',
    expired: 'bg-slate-100 text-slate-700',
    terminated: 'bg-red-100 text-red-700'
  };

  const typeColors = {
    customer: 'bg-blue-100 text-blue-700',
    vendor: 'bg-purple-100 text-purple-700',
    lease: 'bg-amber-100 text-amber-700',
    nda: 'bg-slate-100 text-slate-700',
    service: 'bg-green-100 text-green-700'
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
                <h1 className="text-2xl font-bold text-slate-900">Contract Management</h1>
                <p className="text-slate-500">Track contracts, renewals, and obligations with AI insights</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Review
                </Button>
                <Button className="bg-lime-500 hover:bg-lime-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New Contract
                </Button>
              </div>
            </div>

            {/* Expiring Soon Alert */}
            <Card className="mb-6 border-amber-200 bg-amber-50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-900">7 contracts expiring in the next 30 days</p>
                    <p className="text-sm text-amber-700">Review and take action before expiration</p>
                  </div>
                </div>
                <Button variant="outline" className="border-amber-300 text-amber-700">View All</Button>
              </CardContent>
            </Card>

            <ModuleDashboard stats={stats} />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Contracts</TabsTrigger>
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="vendor">Vendor</TabsTrigger>
                <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid gap-4">
              {contracts.map(contract => (
                <Card key={contract.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm text-slate-500">{contract.id}</span>
                            <Badge className={typeColors[contract.type]}>{contract.type}</Badge>
                            <Badge className={statusColors[contract.status]}>{contract.status}</Badge>
                          </div>
                          <h3 className="font-semibold">{contract.title}</h3>
                          <p className="text-sm text-slate-500">{contract.party}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-lg font-bold">{contract.value > 0 ? `$${contract.value.toLocaleString()}` : 'N/A'}</p>
                          <p className="text-xs text-slate-500">Contract Value</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${contract.daysLeft < 30 ? 'text-red-600' : ''}`}>{contract.daysLeft} days</p>
                          <p className="text-xs text-slate-500">Until Expiry</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {contract.autoRenew && (
                            <Badge variant="outline" className="text-green-600 border-green-200">Auto-renew</Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon"><Bell className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t flex items-center gap-6 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {contract.start} to {contract.end}
                      </span>
                      {contract.daysLeft < 60 && (
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Contract Progress</span>
                            <span>{Math.round((1 - contract.daysLeft / 365) * 100)}%</span>
                          </div>
                          <Progress value={(1 - contract.daysLeft / 365) * 100} className="h-1.5" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}