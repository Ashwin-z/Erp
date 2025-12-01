import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Search, Eye, Edit, Send, FileText, DollarSign, Printer } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { toast } from 'sonner';

const sampleInvoices = [
  { id: 'INV-2024-234', orderId: 'SO-2024-156', customer: 'TechStart Pte Ltd', date: '2024-12-20', dueDate: '2025-01-19', amount: 15450, paid: 0, status: 'draft' },
  { id: 'INV-2024-233', orderId: 'SO-2024-155', customer: 'Marina Foods', date: '2024-12-19', dueDate: '2025-01-18', amount: 28900, paid: 14450, status: 'partial' },
  { id: 'INV-2024-232', orderId: 'SO-2024-154', customer: 'Global Logistics', date: '2024-12-18', dueDate: '2025-01-17', amount: 8750, paid: 8750, status: 'paid' },
  { id: 'INV-2024-231', orderId: 'SO-2024-153', customer: 'Urban Retail', date: '2024-12-17', dueDate: '2025-01-16', amount: 45200, paid: 45200, status: 'paid' },
  { id: 'INV-2024-230', orderId: 'SO-2024-152', customer: 'Skyline Properties', date: '2024-12-10', dueDate: '2025-01-09', amount: 12300, paid: 0, status: 'overdue' },
];

const customers = ['TechStart Pte Ltd', 'Marina Foods', 'Global Logistics', 'Urban Retail', 'Skyline Properties'];

export default function SalesInvoice() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState(sampleInvoices);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ customer: '', orderId: '', terms: '30', amount: '' });

  const statusColors = {
    draft: 'bg-slate-100 text-slate-700',
    sent: 'bg-blue-100 text-blue-700',
    partial: 'bg-amber-100 text-amber-700',
    paid: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700'
  };

  const filteredInvoices = invoices.filter(i => 
    i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalOutstanding = invoices.reduce((s, i) => s + (i.amount - i.paid), 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + (i.amount - i.paid), 0);

  const openCreate = () => {
    setForm({ customer: '', orderId: '', terms: '30', amount: '' });
    setFormOpen(true);
  };

  const createInvoice = () => {
    if (!form.customer || !form.amount) { toast.error('Please fill required fields'); return; }
    const newInvoice = {
      id: `INV-2024-${String(235 + invoices.length).padStart(3, '0')}`,
      orderId: form.orderId || '-',
      customer: form.customer,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + parseInt(form.terms) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: parseFloat(form.amount),
      paid: 0,
      status: 'draft'
    };
    setInvoices([newInvoice, ...invoices]);
    toast.success('Invoice created');
    setFormOpen(false);
  };

  const sendInvoice = (invoice) => {
    setInvoices(invoices.map(i => i.id === invoice.id ? { ...i, status: 'sent' } : i));
    toast.success(`Invoice ${invoice.id} sent to customer`);
  };

  const recordPayment = (invoice) => {
    setInvoices(invoices.map(i => i.id === invoice.id ? { ...i, paid: i.amount, status: 'paid' } : i));
    toast.success(`Payment recorded for ${invoice.id}`);
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1600px] mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link to={createPageUrl('Sales')}>
                <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
                <p className="text-slate-500">Create and track customer invoices</p>
              </div>
              <Button className="bg-lime-500 hover:bg-lime-600" onClick={openCreate}>
                <Plus className="w-4 h-4 mr-2" />New Invoice
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Total Invoices</p><p className="text-2xl font-bold">{invoices.length}</p></CardContent></Card>
              <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Outstanding</p><p className="text-2xl font-bold text-amber-600">${totalOutstanding.toLocaleString()}</p></CardContent></Card>
              <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Overdue</p><p className="text-2xl font-bold text-red-600">${totalOverdue.toLocaleString()}</p></CardContent></Card>
              <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Collected</p><p className="text-2xl font-bold text-green-600">${invoices.reduce((s, i) => s + i.paid, 0).toLocaleString()}</p></CardContent></Card>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search invoices..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-mono font-medium">{invoice.id}</TableCell>
                        <TableCell className="font-mono text-slate-500">{invoice.orderId}</TableCell>
                        <TableCell>{invoice.customer}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell className="font-medium">${invoice.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-green-600">${invoice.paid.toLocaleString()}</TableCell>
                        <TableCell className="font-medium text-amber-600">${(invoice.amount - invoice.paid).toLocaleString()}</TableCell>
                        <TableCell><Badge className={statusColors[invoice.status]}>{invoice.status}</Badge></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon"><Printer className="w-4 h-4" /></Button>
                            {invoice.status === 'draft' && <Button variant="ghost" size="icon" onClick={() => sendInvoice(invoice)}><Send className="w-4 h-4 text-blue-500" /></Button>}
                            {(invoice.status === 'sent' || invoice.status === 'partial' || invoice.status === 'overdue') && (
                              <Button variant="ghost" size="icon" onClick={() => recordPayment(invoice)}><DollarSign className="w-4 h-4 text-green-500" /></Button>
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

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Invoice</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Customer *</Label>
              <Select value={form.customer} onValueChange={(v) => setForm({ ...form, customer: v })}>
                <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>{customers.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Related Order #</Label>
                <Input value={form.orderId} onChange={(e) => setForm({ ...form, orderId: e.target.value })} placeholder="SO-XXXX-XXX" />
              </div>
              <div className="space-y-2">
                <Label>Payment Terms (Days)</Label>
                <Input type="number" value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Amount *</Label>
              <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button className="bg-lime-500 hover:bg-lime-600" onClick={createInvoice}>Create Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}