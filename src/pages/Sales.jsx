import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  ShoppingCart, Plus, Search, FileText, TrendingUp,
  DollarSign, Send, CheckCircle2, Clock, Eye, Edit, Sparkles, Receipt, ExternalLink
} from 'lucide-react';
import QuotationList from '../components/sales/QuotationList';
import QuotationForm from '../components/sales/QuotationForm';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import SOPGuide from '../components/modules/SOPGuide';
import ModuleDashboard from '../components/modules/ModuleDashboard';

const salesSOP = {
  title: "Sales Workflow Guide",
  description: "Quotation → Sales Order → Delivery → Invoice → Payment",
  steps: [
    { name: "Quotation", description: "Create and send quotation to customer with pricing.", checklist: ["Select customer", "Add line items", "Set markup/discount", "Send for approval"] },
    { name: "Sales Order", description: "Convert approved quotation to sales order.", checklist: ["Confirm availability", "Lock pricing", "Get customer PO", "Approve order"] },
    { name: "Delivery", description: "Pick, pack and ship items to customer.", checklist: ["Generate pick list", "Pack items", "Create delivery order", "Ship & track"] },
    { name: "Invoice", description: "Generate invoice upon delivery confirmation.", checklist: ["Create invoice", "Apply terms", "Send to customer", "Track payment"] },
    { name: "Payment", description: "Collect and reconcile payment.", checklist: ["Receive payment", "Match to invoice", "Update GL", "Send receipt"] }
  ]
};

export default function Sales() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  const stats = [
    { label: 'Total Sales', value: '$1.2M', icon: DollarSign, color: 'bg-green-500', trend: 15, link: 'SalesPayment' },
    { label: 'Open Orders', value: 45, icon: ShoppingCart, color: 'bg-blue-500', trend: 8, link: 'SalesOrder' },
    { label: 'Pending Quotes', value: 23, icon: FileText, color: 'bg-amber-500', trend: -5, link: 'SalesQuotation' },
    { label: 'Avg Margin', value: '32%', icon: TrendingUp, color: 'bg-purple-500', trend: 3, link: 'SalesInvoice' }
  ];

  const orders = [
    { id: 'SO-2024-156', customer: 'TechStart Pte Ltd', date: '2024-12-20', total: 15450, profit: 4850, margin: 31.4, status: 'confirmed', payment: 'unpaid' },
    { id: 'SO-2024-155', customer: 'Marina Foods', date: '2024-12-19', total: 28900, profit: 9520, margin: 32.9, status: 'processing', payment: 'partial' },
    { id: 'SO-2024-154', customer: 'Global Logistics', date: '2024-12-18', total: 8750, profit: 2625, margin: 30.0, status: 'shipped', payment: 'paid' },
    { id: 'SO-2024-153', customer: 'Urban Retail', date: '2024-12-17', total: 45200, profit: 15870, margin: 35.1, status: 'delivered', payment: 'paid' },
    { id: 'SO-2024-152', customer: 'Skyline Properties', date: '2024-12-16', total: 12300, profit: 3690, margin: 30.0, status: 'draft', payment: 'unpaid' }
  ];

  const statusColors = {
    draft: 'bg-slate-100 text-slate-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-amber-100 text-amber-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  const paymentColors = {
    unpaid: 'bg-red-100 text-red-700',
    partial: 'bg-amber-100 text-amber-700',
    paid: 'bg-green-100 text-green-700'
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
                <h1 className="text-2xl font-bold text-slate-900">Sales Management</h1>
                <p className="text-slate-500">Quotations, orders, and revenue tracking with profit analysis</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Proposal
                </Button>
                <Button variant="outline" onClick={() => { setSelectedQuotation(null); setShowQuotationForm(true); }}>
                  <Receipt className="w-4 h-4 mr-2" />
                  New Quotation
                </Button>
                <Button className="bg-lime-500 hover:bg-lime-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New Order
                </Button>
              </div>
            </div>

            <SOPGuide {...salesSOP} />
            
            {/* Clickable Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <Link key={index} to={createPageUrl(stat.link)}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="cursor-pointer"
                  >
                    <Card className="hover:shadow-lg hover:border-lime-300 transition-all duration-200 group">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                          </div>
                          <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center relative`}>
                            <stat.icon className="w-5 h-5 text-white" />
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <ExternalLink className="w-3 h-3 text-slate-600" />
                            </div>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1 mt-2 text-sm ${stat.trend > 0 ? 'text-green-600' : stat.trend < 0 ? 'text-red-600' : 'text-slate-500'}`}>
                          <TrendingUp className={`w-4 h-4 ${stat.trend < 0 ? 'rotate-180' : ''}`} />
                          <span>{Math.abs(stat.trend)}% vs last period</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              ))}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="orders">Sales Orders</TabsTrigger>
                <TabsTrigger value="quotes">Quotations</TabsTrigger>
                <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
              </TabsList>

              <TabsContent value="quotes">
                <QuotationList 
                  onView={(q) => console.log('View', q)}
                  onEdit={(q) => { setSelectedQuotation(q); setShowQuotationForm(true); }}
                  onConvert={(q) => console.log('Convert to order', q)}
                  onSend={(q) => console.log('Send', q)}
                />
              </TabsContent>

              <TabsContent value="orders">
                <Card>
                  <CardContent className="p-0">
                    <div className="p-4 border-b">
                      <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input placeholder="Search orders..." className="pl-10" />
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order #</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Profit</TableHead>
                          <TableHead>Margin</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-mono font-medium">{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell className="font-medium">${order.total.toLocaleString()}</TableCell>
                            <TableCell className="text-green-600">${order.profit.toLocaleString()}</TableCell>
                            <TableCell>{order.margin}%</TableCell>
                            <TableCell><Badge className={statusColors[order.status]}>{order.status}</Badge></TableCell>
                            <TableCell><Badge className={paymentColors[order.payment]}>{order.payment}</Badge></TableCell>
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
            </Tabs>
          </motion.div>
        </main>
      </div>

      {/* Quotation Form Modal */}
      <QuotationForm
        open={showQuotationForm}
        onClose={() => setShowQuotationForm(false)}
        quotation={selectedQuotation}
        onSave={async (data) => {
          const quoteNumber = `QT-${Date.now().toString().slice(-8)}`;
          const issueDate = new Date().toISOString().split('T')[0];
          const validUntil = new Date(Date.now() + (data.valid_days || 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          
          await base44.entities.Quotation.create({
            ...data,
            quote_number: quoteNumber,
            issue_date: issueDate,
            valid_until: validUntil
          });
          setShowQuotationForm(false);
        }}
        onSaveAndSend={async (data) => {
          const quoteNumber = `QT-${Date.now().toString().slice(-8)}`;
          const issueDate = new Date().toISOString().split('T')[0];
          const validUntil = new Date(Date.now() + (data.valid_days || 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          
          const quote = await base44.entities.Quotation.create({
            ...data,
            quote_number: quoteNumber,
            issue_date: issueDate,
            valid_until: validUntil,
            status: 'sent',
            sent_at: new Date().toISOString()
          });

          // Send email
          if (data.customer_email) {
            await base44.integrations.Core.SendEmail({
              to: data.customer_email,
              subject: `Quotation ${quoteNumber} from ARKFinex`,
              body: `Dear ${data.customer_name},\n\nPlease find your quotation ${quoteNumber} for $${data.total?.toLocaleString()}.\n\nValid until: ${validUntil}\n\nBest regards,\nARKFinex Team`
            });
          }

          setShowQuotationForm(false);
        }}
      />
    </div>
  );
}