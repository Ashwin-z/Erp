import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, Plus, Search, Eye, Edit, Send, Trash2, 
  DollarSign, Receipt, TrendingUp, Clock, CheckCircle2, 
  FileText, Loader2, AlertTriangle
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { toast } from 'sonner';
import moment from 'moment';

const statusColors = {
  draft: 'bg-slate-100 text-slate-700',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-slate-100 text-slate-500'
};

export default function Invoices() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [searchTerm, setSearchTerm] = useState('');
  const [viewInvoice, setViewInvoice] = useState(null);
  const queryClient = useQueryClient();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => base44.entities.Invoice.list('-created_date')
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: (id) => base44.entities.Invoice.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice deleted');
    }
  });

  const markAsPaidMutation = useMutation({
    mutationFn: async (invoice) => {
      await base44.entities.Invoice.update(invoice.id, {
        status: 'paid',
        paid_at: new Date().toISOString(),
        paid_amount: invoice.total
      });
      // Create notification
      await base44.entities.SalesNotification.create({
        type: 'invoice_paid',
        title: 'Invoice Paid',
        message: `${invoice.customer_name} paid invoice ${invoice.invoice_number}`,
        reference_type: 'invoice',
        reference_id: invoice.id,
        customer_name: invoice.customer_name,
        amount: invoice.total
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['salesNotifications'] });
      toast.success('Invoice marked as paid');
    }
  });

  const sendInvoiceMutation = useMutation({
    mutationFn: async (invoice) => {
      await base44.integrations.Core.SendEmail({
        to: invoice.customer_email,
        subject: `Invoice ${invoice.invoice_number} from ARKFinex`,
        body: `Dear ${invoice.customer_name},\n\nPlease find attached your invoice ${invoice.invoice_number} for $${invoice.total?.toLocaleString()}.\n\nDue Date: ${moment(invoice.due_date).format('DD MMM YYYY')}\n\nThank you for your business.\n\nBest regards,\nARKFinex Team`
      });
      await base44.entities.Invoice.update(invoice.id, { status: 'sent' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice sent to customer');
    }
  });

  const filteredInvoices = invoices.filter(inv =>
    inv.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: invoices.length,
    totalValue: invoices.reduce((sum, i) => sum + (i.total || 0), 0),
    paid: invoices.filter(i => i.status === 'paid').length,
    paidValue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.total || 0), 0),
    pending: invoices.filter(i => i.status === 'sent').length,
    overdue: invoices.filter(i => i.status === 'overdue').length
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1600px] mx-auto">
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Link to={createPageUrl('Sales')}>
                <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
                <p className="text-slate-500">Manage customer invoices and payments</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Total Invoices</p>
                      <p className="text-xl font-bold">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Paid</p>
                      <p className="text-xl font-bold text-green-600">${stats.paidValue.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Pending</p>
                      <p className="text-xl font-bold text-amber-600">{stats.pending}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Overdue</p>
                      <p className="text-xl font-bold text-red-600">{stats.overdue}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Invoice List */}
            <Card>
              <CardContent className="p-0">
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder="Search invoices..." 
                      className="pl-10" 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                  </div>
                ) : filteredInvoices.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No invoices yet</p>
                    <p className="text-sm">Create invoices from accepted quotations</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-mono font-medium">{invoice.invoice_number}</TableCell>
                          <TableCell>{invoice.customer_name}</TableCell>
                          <TableCell>{moment(invoice.issue_date).format('DD MMM YYYY')}</TableCell>
                          <TableCell>{moment(invoice.due_date).format('DD MMM YYYY')}</TableCell>
                          <TableCell className="text-right font-medium">${invoice.total?.toLocaleString()}</TableCell>
                          <TableCell><Badge className={statusColors[invoice.status]}>{invoice.status}</Badge></TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => setViewInvoice(invoice)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              {invoice.status === 'draft' && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => sendInvoiceMutation.mutate(invoice)}
                                  disabled={sendInvoiceMutation.isPending}
                                >
                                  <Send className="w-4 h-4 text-blue-500" />
                                </Button>
                              )}
                              {invoice.status === 'sent' && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => markAsPaidMutation.mutate(invoice)}
                                  disabled={markAsPaidMutation.isPending}
                                >
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => deleteInvoiceMutation.mutate(invoice.id)}
                                disabled={deleteInvoiceMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>

      {/* View Invoice Modal */}
      <Dialog open={!!viewInvoice} onOpenChange={() => setViewInvoice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice {viewInvoice?.invoice_number}</DialogTitle>
          </DialogHeader>
          {viewInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-500">Customer</Label>
                  <p className="font-medium">{viewInvoice.customer_name}</p>
                  <p className="text-sm text-slate-500">{viewInvoice.customer_email}</p>
                </div>
                <div className="text-right">
                  <Label className="text-slate-500">Total Amount</Label>
                  <p className="text-2xl font-bold">${viewInvoice.total?.toLocaleString()}</p>
                  <Badge className={statusColors[viewInvoice.status]}>{viewInvoice.status}</Badge>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewInvoice.items?.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.unit_price?.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${(item.quantity * item.unit_price)?.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <div className="w-64 space-y-1 text-sm">
                  <div className="flex justify-between"><span>Subtotal:</span><span>${viewInvoice.subtotal?.toLocaleString()}</span></div>
                  <div className="flex justify-between text-red-600"><span>Discount:</span><span>-${viewInvoice.discount_total?.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>GST ({viewInvoice.tax_rate}%):</span><span>${viewInvoice.tax_amount?.toLocaleString()}</span></div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total:</span><span>${viewInvoice.total?.toLocaleString()}</span></div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}