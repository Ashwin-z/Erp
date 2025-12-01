import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus, Search, Eye, Send, Trash2, FileText, Loader2, AlertTriangle,
  CheckCircle2, Clock, XCircle, Building2, Globe, Shield, RefreshCw,
  Download, Upload, Settings, HelpCircle, ExternalLink, Zap
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PageHeader from '@/components/shared/PageHeader';
import InvoiceNowFormModal from '@/components/invoicenow/InvoiceNowFormModal';
import InvoiceNowDetailModal from '@/components/invoicenow/InvoiceNowDetailModal';
import InvoiceNowAutomation from '@/components/invoicenow/InvoiceNowAutomation';
import { toast } from 'sonner';
import moment from 'moment';

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700', icon: FileText },
  validated: { label: 'Validated', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
  pending_transmission: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
  transmitted: { label: 'Transmitted', color: 'bg-violet-100 text-violet-700', icon: Send },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
  cancelled: { label: 'Cancelled', color: 'bg-slate-100 text-slate-500', icon: XCircle }
};

const peppolStatusConfig = {
  not_sent: { label: 'Not Sent', color: 'bg-slate-100 text-slate-600' },
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-700' },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' }
};

const irasStatusConfig = {
  not_submitted: { label: 'Not Submitted', color: 'bg-slate-100 text-slate-600' },
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700' },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' }
};

export default function InvoiceNow() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const queryClient = useQueryClient();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoicenow'],
    queryFn: () => base44.entities.InvoiceNow.list('-created_date')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.InvoiceNow.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoicenow'] });
      toast.success('Invoice deleted');
    }
  });

  const transmitMutation = useMutation({
    mutationFn: async (invoice) => {
      // Simulate Peppol transmission
      await base44.entities.InvoiceNow.update(invoice.id, {
        status: 'transmitted',
        peppol_status: 'pending',
        peppol_transmission_date: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoicenow'] });
      toast.success('Invoice transmitted via Peppol network');
    }
  });

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: invoices.length,
    totalValue: invoices.reduce((sum, i) => sum + (i.payable_amount || 0), 0),
    transmitted: invoices.filter(i => ['transmitted', 'delivered', 'accepted'].includes(i.peppol_status)).length,
    pending: invoices.filter(i => i.status === 'draft' || i.status === 'validated').length,
    irasSubmitted: invoices.filter(i => i.iras_status === 'submitted' || i.iras_status === 'accepted').length
  };

  const openView = (invoice) => {
    setSelectedInvoice(invoice);
    setDetailOpen(true);
  };

  const openEdit = (invoice) => {
    setEditingInvoice(invoice);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditingInvoice(null);
    setFormOpen(true);
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1600px] mx-auto space-y-6">
            
            <PageHeader
              title="InvoiceNow"
              subtitle="IMDA Peppol-compliant e-invoicing for Singapore"
              icon={FileText}
              iconColor="text-blue-600"
              actions={
                <div className="flex gap-2">
                  <Link to={createPageUrl('InvoiceNowSettings')}>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />Settings
                    </Button>
                  </Link>
                  <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />New Invoice
                  </Button>
                </div>
              }
            />

            {/* Info Banner */}
            <Card className="bg-gradient-to-r from-blue-50 to-violet-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">IMDA InvoiceNow & GST Compliance</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      InvoiceNow uses the Peppol network to transmit e-invoices in SG Peppol BIS 3.0 format. 
                      GST-registered businesses must comply with IRAS GST InvoiceNow Requirement from Nov 2025.
                    </p>
                    <div className="flex gap-4 mt-3">
                      <a href="https://www.imda.gov.sg/how-we-can-help/nationwide-e-invoicing-framework/invoicenow" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                        IMDA InvoiceNow <ExternalLink className="w-3 h-3" />
                      </a>
                      <a href="https://www.iras.gov.sg/taxes/goods-services-tax-(gst)/gst-invoicenow-requirement" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                        IRAS GST Requirement <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="bg-white border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.total}</p>
                      <p className="text-sm text-slate-500">Total Invoices</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-600">{stats.transmitted}</p>
                      <p className="text-sm text-slate-500">Peppol Transmitted</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                      <p className="text-sm text-slate-500">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-violet-600">{stats.irasSubmitted}</p>
                      <p className="text-sm text-slate-500">IRAS Submitted</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">${(stats.totalValue / 1000).toFixed(0)}K</p>
                      <p className="text-sm text-slate-500">Total Value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Automation Panel */}
            <InvoiceNowAutomation />

            {/* Filters & Table */}
            <Card className="border-slate-200">
              <CardContent className="p-0">
                <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-72">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        placeholder="Search invoices..." 
                        className="pl-10" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="validated">Validated</SelectItem>
                        <SelectItem value="transmitted">Transmitted</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />Export UBL
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />Import
                    </Button>
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                  </div>
                ) : filteredInvoices.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No invoices yet</p>
                    <p className="text-sm mb-4">Create your first Peppol-compliant invoice</p>
                    <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />Create Invoice
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Peppol</TableHead>
                        <TableHead>IRAS</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id} className="hover:bg-slate-50">
                          <TableCell className="font-mono font-medium text-blue-600">
                            {invoice.invoice_number}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{invoice.buyer?.name}</p>
                              {invoice.buyer?.uen && (
                                <p className="text-xs text-slate-500">UEN: {invoice.buyer.uen}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{moment(invoice.issue_date).format('DD MMM YYYY')}</TableCell>
                          <TableCell>{moment(invoice.due_date).format('DD MMM YYYY')}</TableCell>
                          <TableCell className="text-right font-medium">
                            ${invoice.payable_amount?.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={statusConfig[invoice.status]?.color}>
                              {statusConfig[invoice.status]?.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={peppolStatusConfig[invoice.peppol_status]?.color}>
                              {peppolStatusConfig[invoice.peppol_status]?.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={irasStatusConfig[invoice.iras_status]?.color}>
                              {irasStatusConfig[invoice.iras_status]?.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openView(invoice)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              {invoice.status === 'validated' && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => transmitMutation.mutate(invoice)}
                                  disabled={transmitMutation.isPending}
                                  title="Transmit via Peppol"
                                >
                                  <Send className="w-4 h-4 text-blue-500" />
                                </Button>
                              )}
                              {invoice.status === 'draft' && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => deleteMutation.mutate(invoice.id)}
                                  disabled={deleteMutation.isPending}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              )}
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

      <InvoiceNowFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingInvoice(null); }}
        invoice={editingInvoice}
      />

      <InvoiceNowDetailModal
        open={detailOpen}
        onClose={() => { setDetailOpen(false); setSelectedInvoice(null); }}
        invoice={selectedInvoice}
        onEdit={openEdit}
      />
    </div>
  );
}