import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Receipt, Plus, Search, Filter, Download, Upload, Eye,
  CheckCircle2, Clock, AlertTriangle, Sparkles, FileText
} from 'lucide-react';

const invoices = [
  { id: 'AP-2024-0156', vendor: 'Amazon Web Services Singapore', amount: 2450, date: '2024-12-15', due: '2024-12-30', status: 'pending_approval', ocr: true, confidence: 98 },
  { id: 'AP-2024-0155', vendor: 'Microsoft Singapore', amount: 890, date: '2024-12-14', due: '2024-12-28', status: 'approved', ocr: true, confidence: 95 },
  { id: 'AP-2024-0154', vendor: 'Popular Bookstore', amount: 345, date: '2024-12-12', due: '2024-12-26', status: 'paid', ocr: true, confidence: 92 },
  { id: 'AP-2024-0153', vendor: 'Singtel Enterprise', amount: 589, date: '2024-12-10', due: '2024-12-25', status: 'approved', ocr: false, confidence: 0 },
  { id: 'AP-2024-0152', vendor: 'DBS Bank', amount: 145, date: '2024-12-08', due: '2024-12-22', status: 'paid', ocr: true, confidence: 99 },
  { id: 'AP-2024-0151', vendor: 'Marina Bay Suites', amount: 8500, date: '2024-12-05', due: '2024-12-20', status: 'pending_approval', ocr: true, confidence: 97 },
  { id: 'AP-2024-0150', vendor: 'OCBC Bank', amount: 85, date: '2024-12-03', due: '2024-12-18', status: 'paid', ocr: true, confidence: 99 },
  { id: 'AP-2024-0149', vendor: 'Grab for Business', amount: 456, date: '2024-12-01', due: '2024-12-16', status: 'approved', ocr: true, confidence: 94 },
];

const statusConfig = {
  pending_approval: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
  approved: { label: 'Approved', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
  paid: { label: 'Paid', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
};

export default function AccountsPayable() {
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
                  <Receipt className="w-7 h-7 text-orange-600" />
                  Accounts Payable
                </h1>
                <p className="text-slate-500 text-sm">Manage vendor invoices and payments</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline"><Upload className="w-4 h-4 mr-2" />Upload Invoice</Button>
                <Button className="bg-orange-600 hover:bg-orange-700"><Plus className="w-4 h-4 mr-2" />New Invoice</Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Total Outstanding', value: 'S$18,900', sub: '12 invoices' },
                { label: 'Due This Week', value: 'S$5,340', sub: '4 invoices' },
                { label: 'Overdue', value: 'S$0', sub: '0 invoices' },
                { label: 'AI Processed', value: '95%', sub: 'OCR accuracy' },
              ].map((stat, i) => (
                <Card key={i} className="border-slate-200">
                  <CardContent className="p-5">
                    <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI OCR Queue */}
            <Card className="border-slate-200 bg-gradient-to-r from-violet-50 to-purple-50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-violet-500 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">AI OCR Processing</h3>
                      <p className="text-sm text-slate-600">3 documents ready for review with 96% average confidence</p>
                    </div>
                  </div>
                  <Button className="bg-violet-600 hover:bg-violet-700">Review Documents</Button>
                </div>
              </CardContent>
            </Card>

            {/* Invoices Table */}
            <Card className="border-slate-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Vendor Invoices</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input placeholder="Search invoices..." className="pl-9 w-64" />
                    </div>
                    <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
                    <Button variant="outline" size="icon"><Download className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>OCR</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((inv) => {
                      const status = statusConfig[inv.status];
                      return (
                        <TableRow key={inv.id} className="hover:bg-slate-50">
                          <TableCell className="font-medium">{inv.id}</TableCell>
                          <TableCell>{inv.vendor}</TableCell>
                          <TableCell className="font-semibold">S${inv.amount.toLocaleString()}</TableCell>
                          <TableCell>{inv.date}</TableCell>
                          <TableCell>{inv.due}</TableCell>
                          <TableCell>
                            {inv.ocr ? (
                              <div className="flex items-center gap-2">
                                <Progress value={inv.confidence} className="w-16 h-2" />
                                <span className="text-xs text-slate-500">{inv.confidence}%</span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">Manual</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={status.color}>
                              <status.icon className="w-3 h-3 mr-1" />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <FileText className="w-4 h-4" />
                              </Button>
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