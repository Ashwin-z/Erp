import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  FileText, Plus, Search, Send, Clock, CheckCircle2,
  XCircle, Eye, Edit, Copy, DollarSign, TrendingUp, Sparkles
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import SOPGuide from '../components/modules/SOPGuide';
import ModuleDashboard from '../components/modules/ModuleDashboard';

const quotationSOP = {
  title: "Quotation Workflow",
  description: "Request → Create → Review → Send → Follow-up",
  steps: [
    { name: "Request", description: "Receive quotation request from customer.", checklist: ["Log inquiry", "Gather requirements", "Check availability", "Assign to sales"] },
    { name: "Create", description: "Prepare quotation with pricing and terms.", checklist: ["Add line items", "Calculate pricing", "Apply discounts", "Set validity"] },
    { name: "Review", description: "Review and approve quotation.", checklist: ["Check margins", "Verify stock", "Manager approval", "Final review"] },
    { name: "Send", description: "Send quotation to customer.", checklist: ["Generate PDF", "Send email", "Log activity", "Set follow-up"] },
    { name: "Follow-up", description: "Track and convert quotation.", checklist: ["Customer contact", "Handle objections", "Negotiate terms", "Convert to SO"] }
  ]
};

export default function QuotationManagement() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const stats = [
    { label: 'Total Quotes', value: 156, icon: FileText, color: 'bg-blue-500', trend: 12 },
    { label: 'Pending', value: 23, icon: Clock, color: 'bg-amber-500', trend: 5 },
    { label: 'Won', value: 89, icon: CheckCircle2, color: 'bg-green-500', trend: 18 },
    { label: 'Quote Value', value: '$1.2M', icon: DollarSign, color: 'bg-purple-500', trend: 25 }
  ];

  const quotations = [
    { id: 'QT-2024-156', customer: 'TechStart Pte Ltd', date: '2024-12-20', valid_until: '2025-01-20', total: 45000, margin: 32, status: 'sent', probability: 75 },
    { id: 'QT-2024-155', customer: 'Marina Foods', date: '2024-12-19', valid_until: '2025-01-19', total: 28900, margin: 28, status: 'draft', probability: 0 },
    { id: 'QT-2024-154', customer: 'Global Logistics', date: '2024-12-18', valid_until: '2025-01-18', total: 125000, margin: 35, status: 'negotiating', probability: 60 },
    { id: 'QT-2024-153', customer: 'Urban Retail', date: '2024-12-17', valid_until: '2025-01-17', total: 67500, margin: 30, status: 'won', probability: 100 },
    { id: 'QT-2024-152', customer: 'Skyline Properties', date: '2024-12-16', valid_until: '2025-01-16', total: 34200, margin: 25, status: 'lost', probability: 0 },
    { id: 'QT-2024-151', customer: 'Eastern Trading', date: '2024-12-15', valid_until: '2025-01-15', total: 89000, margin: 33, status: 'expired', probability: 0 }
  ];

  const statusColors = {
    draft: 'bg-slate-100 text-slate-700',
    sent: 'bg-blue-100 text-blue-700',
    viewed: 'bg-purple-100 text-purple-700',
    negotiating: 'bg-amber-100 text-amber-700',
    won: 'bg-green-100 text-green-700',
    lost: 'bg-red-100 text-red-700',
    expired: 'bg-slate-100 text-slate-700'
  };

  const filteredQuotations = quotations.filter(q => {
    const matchesSearch = q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || q.status === activeTab;
    return matchesSearch && matchesTab;
  });

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
                <h1 className="text-2xl font-bold text-slate-900">Quotation Management</h1>
                <p className="text-slate-500">Create, track, and convert quotations to sales orders</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Generate
                </Button>
                <Button className="bg-lime-500 hover:bg-lime-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New Quotation
                </Button>
              </div>
            </div>

            <SOPGuide {...quotationSOP} />
            <ModuleDashboard stats={stats} />

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search quotations..."
                  className="pl-10"
                />
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                  <TabsTrigger value="sent">Sent</TabsTrigger>
                  <TabsTrigger value="negotiating">Negotiating</TabsTrigger>
                  <TabsTrigger value="won">Won</TabsTrigger>
                  <TabsTrigger value="lost">Lost</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Quotations Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quote #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Valid Until</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Margin</TableHead>
                      <TableHead>Probability</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuotations.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell className="font-mono font-medium">{quote.id}</TableCell>
                        <TableCell>{quote.customer}</TableCell>
                        <TableCell>{quote.date}</TableCell>
                        <TableCell>{quote.valid_until}</TableCell>
                        <TableCell className="font-medium">${quote.total.toLocaleString()}</TableCell>
                        <TableCell className="text-green-600">{quote.margin}%</TableCell>
                        <TableCell>
                          {quote.probability > 0 ? (
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${quote.probability >= 75 ? 'bg-green-500' : quote.probability >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                  style={{ width: `${quote.probability}%` }}
                                />
                              </div>
                              <span className="text-sm">{quote.probability}%</span>
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell><Badge className={statusColors[quote.status]}>{quote.status}</Badge></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon"><Copy className="w-4 h-4" /></Button>
                            {quote.status === 'draft' && (
                              <Button variant="ghost" size="icon"><Send className="w-4 h-4" /></Button>
                            )}
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