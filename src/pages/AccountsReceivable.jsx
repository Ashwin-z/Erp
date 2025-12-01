import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  FileText, Plus, Search, Filter, Download, Send, Mail,
  CheckCircle2, Clock, AlertTriangle, Sparkles, TrendingUp, Phone
} from 'lucide-react';

const invoices = [
  { id: 'INV-2024-0892', customer: 'TechStart Pte Ltd', amount: 4500, date: '2024-12-01', due: '2024-12-15', status: 'overdue', daysOverdue: 3, collectionScore: 85, aiAction: 'Send email reminder' },
  { id: 'INV-2024-0891', customer: 'Marina Foods Pte Ltd', amount: 8450, date: '2024-11-25', due: '2024-12-10', status: 'overdue', daysOverdue: 8, collectionScore: 92, aiAction: 'Schedule call' },
  { id: 'INV-2024-0890', customer: 'Urban Retail SG', amount: 12400, date: '2024-12-05', due: '2024-12-19', status: 'sent', daysOverdue: 0, collectionScore: 45, aiAction: null },
  { id: 'INV-2024-0889', customer: 'Global Logistics SG', amount: 6500, date: '2024-12-10', due: '2024-12-24', status: 'viewed', daysOverdue: 0, collectionScore: 38, aiAction: null },
  { id: 'INV-2024-0888', customer: 'Skyline Properties', amount: 15800, date: '2024-12-12', due: '2024-12-26', status: 'paid', daysOverdue: 0, collectionScore: 0, aiAction: null },
  { id: 'INV-2024-0887', customer: 'CapitaLand Commercial', amount: 24500, date: '2024-12-08', due: '2024-12-22', status: 'sent', daysOverdue: 0, collectionScore: 32, aiAction: null },
  { id: 'INV-2024-0886', customer: 'DBS Corporate', amount: 18200, date: '2024-12-06', due: '2024-12-20', status: 'viewed', daysOverdue: 0, collectionScore: 28, aiAction: null },
  { id: 'INV-2024-0885', customer: 'Changi Airport Group', amount: 35000, date: '2024-12-02', due: '2024-12-16', status: 'paid', daysOverdue: 0, collectionScore: 0, aiAction: null },
];

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700', icon: Clock },
  sent: { label: 'Sent', color: 'bg-blue-100 text-blue-700', icon: Send },
  viewed: { label: 'Viewed', color: 'bg-indigo-100 text-indigo-700', icon: CheckCircle2 },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
  paid: { label: 'Paid', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
};

export default function AccountsReceivable() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1800px] mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <FileText className="w-7 h-7 text-blue-600" />
                  Accounts Receivable
                </h1>
                <p className="text-slate-500 text-sm">Manage customer invoices and collections</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
                <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" />New Invoice</Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Total Outstanding', value: 'S$32,450', sub: '8 invoices' },
                { label: 'Overdue', value: 'S$12,950', sub: '2 invoices', alert: true },
                { label: 'Collected This Month', value: 'S$48,200', sub: '+15.3%' },
                { label: 'AI Collection Score', value: '78%', sub: 'Avg. collection likelihood' },
              ].map((stat, i) => (
                <Card key={i} className={`border-slate-200 ${stat.alert ? 'border-red-200 bg-red-50' : ''}`}>
                  <CardContent className="p-5">
                    <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.alert ? 'text-red-600' : 'text-slate-900'}`}>{stat.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Collections Alert */}
            <Card className="border-slate-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">AI Collections Recommendations</h3>
                      <p className="text-sm text-slate-600">2 customers require immediate follow-up based on payment patterns</p>
                    </div>
                  </div>
                  <Button className="bg-amber-600 hover:bg-amber-700">View Actions</Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Invoices Table */}
              <Card className="lg:col-span-2 border-slate-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Customer Invoices</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input placeholder="Search invoices..." className="pl-9 w-64" />
                      </div>
                      <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>AI Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((inv) => {
                        const status = statusConfig[inv.status];
                        return (
                          <TableRow key={inv.id} className="hover:bg-slate-50 cursor-pointer">
                            <TableCell className="font-medium">{inv.id}</TableCell>
                            <TableCell>{inv.customer}</TableCell>
                            <TableCell className="font-semibold">S${inv.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              {inv.due}
                              {inv.daysOverdue > 0 && (
                                <span className="text-red-500 text-xs ml-2">({inv.daysOverdue}d overdue)</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge className={status.color}>
                                <status.icon className="w-3 h-3 mr-1" />
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {inv.collectionScore > 0 ? (
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${
                                    inv.collectionScore > 70 ? 'bg-red-500' : 
                                    inv.collectionScore > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                                  }`} />
                                  <span className="text-sm">{inv.collectionScore}%</span>
                                </div>
                              ) : '-'}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Collection Queue */}
              <Card className="border-slate-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    Priority Collections
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {invoices.filter(i => i.aiAction).map((inv) => (
                    <div key={inv.id} className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-slate-200 text-slate-600 text-sm">
                            {inv.customer.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 text-sm">{inv.customer}</p>
                          <p className="text-xs text-slate-500">S${inv.amount.toLocaleString()} • {inv.daysOverdue}d overdue</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-violet-100 text-violet-700 text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {inv.aiAction}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Phone className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}