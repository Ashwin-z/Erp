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
import { ArrowLeft, Plus, Search, DollarSign, CreditCard, Building2, CheckCircle2, Receipt } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { toast } from 'sonner';

const samplePayments = [
  { id: 'PAY-2024-156', invoiceId: 'INV-2024-232', customer: 'Global Logistics', date: '2024-12-18', amount: 8750, method: 'Bank Transfer', reference: 'TRF-789012', status: 'completed' },
  { id: 'PAY-2024-155', invoiceId: 'INV-2024-231', customer: 'Urban Retail', date: '2024-12-17', amount: 45200, method: 'Credit Card', reference: 'CC-456789', status: 'completed' },
  { id: 'PAY-2024-154', invoiceId: 'INV-2024-233', customer: 'Marina Foods', date: '2024-12-16', amount: 14450, method: 'Bank Transfer', reference: 'TRF-123456', status: 'completed' },
  { id: 'PAY-2024-153', invoiceId: 'INV-2024-228', customer: 'TechStart Pte Ltd', date: '2024-12-15', amount: 22000, method: 'PayNow', reference: 'PN-987654', status: 'pending' },
];

const invoices = [
  { id: 'INV-2024-234', customer: 'TechStart Pte Ltd', balance: 15450 },
  { id: 'INV-2024-233', customer: 'Marina Foods', balance: 14450 },
  { id: 'INV-2024-230', customer: 'Skyline Properties', balance: 12300 },
];

const paymentMethods = ['Bank Transfer', 'Credit Card', 'PayNow', 'Cheque', 'Cash'];

export default function SalesPayment() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [searchTerm, setSearchTerm] = useState('');
  const [payments, setPayments] = useState(samplePayments);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ invoiceId: '', amount: '', method: '', reference: '' });

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700'
  };

  const methodIcons = {
    'Bank Transfer': Building2,
    'Credit Card': CreditCard,
    'PayNow': DollarSign,
    'Cheque': Receipt,
    'Cash': DollarSign
  };

  const filteredPayments = payments.filter(p => 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreate = () => {
    setForm({ invoiceId: '', amount: '', method: '', reference: '' });
    setFormOpen(true);
  };

  const selectInvoice = (invoiceId) => {
    const inv = invoices.find(i => i.id === invoiceId);
    setForm({ ...form, invoiceId, amount: inv?.balance.toString() || '' });
  };

  const recordPayment = () => {
    if (!form.invoiceId || !form.amount || !form.method) {
      toast.error('Please fill all required fields');
      return;
    }
    const inv = invoices.find(i => i.id === form.invoiceId);
    const newPayment = {
      id: `PAY-2024-${String(157 + payments.length).padStart(3, '0')}`,
      invoiceId: form.invoiceId,
      customer: inv?.customer || 'Unknown',
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(form.amount),
      method: form.method,
      reference: form.reference || '-',
      status: 'completed'
    };
    setPayments([newPayment, ...payments]);
    toast.success('Payment recorded successfully');
    setFormOpen(false);
  };

  const confirmPayment = (payment) => {
    setPayments(payments.map(p => p.id === payment.id ? { ...p, status: 'completed' } : p));
    toast.success(`Payment ${payment.id} confirmed`);
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
                <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
                <p className="text-slate-500">Record and reconcile customer payments</p>
              </div>
              <Button className="bg-lime-500 hover:bg-lime-600" onClick={openCreate}>
                <Plus className="w-4 h-4 mr-2" />Record Payment
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Total Payments</p><p className="text-2xl font-bold">{payments.length}</p></CardContent></Card>
              <Card><CardContent className="p-4"><p className="text-sm text-slate-500">This Month</p><p className="text-2xl font-bold text-green-600">${payments.reduce((s, p) => s + p.amount, 0).toLocaleString()}</p></CardContent></Card>
              <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Pending</p><p className="text-2xl font-bold text-amber-600">${payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0).toLocaleString()}</p></CardContent></Card>
              <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Outstanding Invoices</p><p className="text-2xl font-bold text-slate-600">{invoices.length}</p></CardContent></Card>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search payments..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment #</TableHead>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => {
                      const MethodIcon = methodIcons[payment.method] || DollarSign;
                      return (
                        <TableRow key={payment.id}>
                          <TableCell className="font-mono font-medium">{payment.id}</TableCell>
                          <TableCell className="font-mono text-slate-500">{payment.invoiceId}</TableCell>
                          <TableCell>{payment.customer}</TableCell>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell className="font-medium text-green-600">${payment.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MethodIcon className="w-4 h-4 text-slate-400" />
                              {payment.method}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{payment.reference}</TableCell>
                          <TableCell><Badge className={statusColors[payment.status]}>{payment.status}</Badge></TableCell>
                          <TableCell>
                            {payment.status === 'pending' && (
                              <Button variant="ghost" size="sm" onClick={() => confirmPayment(payment)}>
                                <CheckCircle2 className="w-4 h-4 mr-1" />Confirm
                              </Button>
                            )}
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

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Invoice *</Label>
              <Select value={form.invoiceId} onValueChange={selectInvoice}>
                <SelectTrigger><SelectValue placeholder="Select invoice" /></SelectTrigger>
                <SelectContent>
                  {invoices.map(inv => (
                    <SelectItem key={inv.id} value={inv.id}>
                      {inv.id} - {inv.customer} (${inv.balance.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount *</Label>
                <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Payment Method *</Label>
                <Select value={form.method} onValueChange={(v) => setForm({ ...form, method: v })}>
                  <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                  <SelectContent>{paymentMethods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reference / Transaction ID</Label>
              <Input value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder="TRF-XXXXXX" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button className="bg-lime-500 hover:bg-lime-600" onClick={recordPayment}>Record Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}