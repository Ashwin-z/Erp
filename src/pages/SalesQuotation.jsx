import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Plus, Search, Eye, Edit, Send, FileText, Trash2, CheckCircle2, Upload, QrCode, Printer, Download, X, Palette, LayoutTemplate } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { ModernTemplate, ClassicTemplate, MinimalTemplate, QUOTATION_TEMPLATES } from '@/components/sales/QuotationTemplates';
import { toast } from 'sonner';

const sampleQuotations = [
  { id: 'QT-2024-089', customer: 'TechStart Pte Ltd', date: '2024-12-20', validUntil: '2025-01-20', total: 18500, status: 'draft', items: 5 },
  { id: 'QT-2024-088', customer: 'Marina Foods', date: '2024-12-19', validUntil: '2025-01-19', total: 32400, status: 'sent', items: 8 },
  { id: 'QT-2024-087', customer: 'Global Logistics', date: '2024-12-18', validUntil: '2025-01-18', total: 9800, status: 'approved', items: 3 },
  { id: 'QT-2024-086', customer: 'Urban Retail', date: '2024-12-17', validUntil: '2025-01-17', total: 56200, status: 'converted', items: 12 },
  { id: 'QT-2024-085', customer: 'Skyline Properties', date: '2024-12-16', validUntil: '2025-01-16', total: 14300, status: 'expired', items: 4 },
];

const vendors = ['ABC Supplies Pte Ltd', 'XYZ Distributors', 'Global Parts Co', 'Quality Materials Inc'];

const defaultCompanyInfo = {
  name: 'ARKFinex Pte Ltd',
  address: '123 Business Park, #05-01, Singapore 123456',
  uen: '202012345K',
  gst: 'M90312345K',
  email: 'sales@arkfinex.com',
  phone: '+65 6123 4567',
  logo: null
};

const defaultBankDetails = {
  bankName: 'DBS Bank Ltd',
  accountName: 'ARKFinex Pte Ltd',
  accountNumber: '123-456789-0',
  swiftCode: 'DBSSSGSG',
  payNowUEN: '202012345K',
  qrCode: null
};

const formatBankDetailsText = (bank) => {
  return `Bank Name: ${bank.bankName}
Account Name: ${bank.accountName}
Account Number: ${bank.accountNumber}
Swift Code: ${bank.swiftCode}
PayNow UEN: ${bank.payNowUEN}`;
};

export default function SalesQuotation() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [searchTerm, setSearchTerm] = useState('');
  const [quotations, setQuotations] = useState(sampleQuotations);
  const [formOpen, setFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [gstRate, setGstRate] = useState(9);
  const logoInputRef = useRef(null);

  // Company letterhead
  const [companyInfo, setCompanyInfo] = useState(defaultCompanyInfo);

  // Customer details
  const [customer, setCustomer] = useState({
    name: '',
    address: '',
    contactPerson1: '',
    contactPerson2: '',
    email: '',
    mobile: ''
  });

  // Line items
  const [items, setItems] = useState([
    { serial: 1, description: '', unitPrice: 0, uom: 'pcs', qty: 1, markupAmount: 0, vendorName: '', markupPercent: 0 }
  ]);

  // Terms & Bank details
  const [termsConditions, setTermsConditions] = useState('1. Quotation valid for 30 days from date of issue.\n2. Payment terms: 50% deposit upon confirmation, balance before delivery.\n3. Delivery within 2-3 weeks upon confirmation.\n4. Prices are subject to GST at prevailing rate.');
  const [bankDetails, setBankDetails] = useState(defaultBankDetails);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [quotationMeta, setQuotationMeta] = useState({
    issuedBy: 'Sales Team',
    paymentTerm: 'Net 30 Days',
    validDays: 30
  });
  const qrInputRef = useRef(null);

  const statusColors = {
    draft: 'bg-slate-100 text-slate-700',
    sent: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    converted: 'bg-purple-100 text-purple-700',
    expired: 'bg-red-100 text-red-700'
  };

  const filteredQuotations = quotations.filter(q => 
    q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = () => {
    setItems([...items, { 
      serial: items.length + 1, 
      description: '', 
      unitPrice: 0, 
      uom: 'pcs', 
      qty: 1, 
      markupAmount: 0, 
      vendorName: '', 
      markupPercent: 0 
    }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index).map((item, i) => ({ ...item, serial: i + 1 }));
    setItems(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // Auto-calculate markup amount when markup percent changes
    if (field === 'markupPercent') {
      const baseAmount = newItems[index].unitPrice * newItems[index].qty;
      newItems[index].markupAmount = baseAmount * (parseFloat(value) / 100);
    }
    
    setItems(newItems);
  };

  const calculateItemAmount = (item) => item.unitPrice * item.qty;
  const calculateItemProfit = (item) => item.markupAmount;
  const calculateVendorAmount = (item) => calculateItemAmount(item) - item.markupAmount;

  const customerSubtotal = items.reduce((sum, item) => sum + calculateItemAmount(item), 0);
  const customerGST = customerSubtotal * (gstRate / 100);
  const customerTotal = customerSubtotal + customerGST;

  const vendorSubtotal = items.reduce((sum, item) => sum + calculateVendorAmount(item), 0);
  const vendorGST = vendorSubtotal * (gstRate / 100);
  const vendorTotal = vendorSubtotal + vendorGST;

  const totalProfit = items.reduce((sum, item) => sum + calculateItemProfit(item), 0);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCompanyInfo({ ...companyInfo, logo: e.target.result });
      reader.readAsDataURL(file);
    }
  };

  const handleQRUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setBankDetails({ ...bankDetails, qrCode: e.target.result });
      reader.readAsDataURL(file);
    }
  };

  // Prepare template data
  const getTemplateData = () => {
    const quotationNumber = `QT-2024-${String(90 + quotations.length).padStart(3, '0')}`;
    const issueDate = new Date().toLocaleDateString('en-SG', { day: '2-digit', month: 'short', year: 'numeric' });
    const validUntil = new Date(Date.now() + quotationMeta.validDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-SG', { day: '2-digit', month: 'short', year: 'numeric' });

    return {
      company: {
        name: companyInfo.name,
        address: companyInfo.address,
        uen: companyInfo.uen,
        gst: companyInfo.gst,
        email: companyInfo.email,
        phone: companyInfo.phone,
        logo: companyInfo.logo
      },
      customer: {
        name: customer.name || 'Customer Name',
        address: customer.address,
        contactPerson: customer.contactPerson1 || 'Contact Person',
        email: customer.email,
        phone: customer.mobile
      },
      quotation: {
        number: quotationNumber,
        date: issueDate,
        validUntil: validUntil,
        issuedBy: quotationMeta.issuedBy,
        paymentTerm: quotationMeta.paymentTerm
      },
      items: items.map((item, idx) => ({
        serial: idx + 1,
        description: item.description,
        unitPrice: item.unitPrice,
        uom: item.uom,
        qty: item.qty,
        amount: item.unitPrice * item.qty
      })),
      totals: {
        subtotal: customerSubtotal,
        discount: 0,
        gstRate: gstRate,
        gst: customerGST,
        total: customerTotal
      },
      terms: termsConditions,
      bankDetails: {
        details: formatBankDetailsText(bankDetails),
        qrCode: bankDetails.qrCode
      }
    };
  };

  const SelectedTemplateComponent = QUOTATION_TEMPLATES.find(t => t.id === selectedTemplate)?.component || ModernTemplate;

  const openNewQuotation = () => {
    setCustomer({ name: '', address: '', contactPerson1: '', contactPerson2: '', email: '', mobile: '' });
    setItems([{ serial: 1, description: '', unitPrice: 0, uom: 'pcs', qty: 1, markupAmount: 0, vendorName: '', markupPercent: 0 }]);
    setActiveTab('form');
  };

  const saveQuotation = () => {
    if (!customer.name) {
      toast.error('Please enter customer name');
      return;
    }
    const newQuote = {
      id: `QT-2024-${String(90 + quotations.length).padStart(3, '0')}`,
      customer: customer.name,
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      total: customerTotal,
      status: 'draft',
      items: items.length
    };
    setQuotations([newQuote, ...quotations]);
    toast.success('Quotation created successfully');
    setActiveTab('list');
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
                <h1 className="text-2xl font-bold text-slate-900">Quotations</h1>
                <p className="text-slate-500">Create and manage customer quotations</p>
              </div>
              {activeTab === 'list' && (
                <Button className="bg-lime-500 hover:bg-lime-600" onClick={openNewQuotation}>
                  <Plus className="w-4 h-4 mr-2" />New Quotation
                </Button>
              )}
              {activeTab === 'form' && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setActiveTab('list')}>
                    <X className="w-4 h-4 mr-2" />Cancel
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('preview')}>
                    <Eye className="w-4 h-4 mr-2" />Preview
                  </Button>
                  <Button className="bg-lime-500 hover:bg-lime-600" onClick={saveQuotation}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />Save Quotation
                  </Button>
                </div>
              )}
              {activeTab === 'preview' && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setActiveTab('form')}>
                    <Edit className="w-4 h-4 mr-2" />Edit
                  </Button>
                  <Button variant="outline">
                    <Printer className="w-4 h-4 mr-2" />Print
                  </Button>
                  <Button className="bg-lime-500 hover:bg-lime-600" onClick={saveQuotation}>
                    <Send className="w-4 h-4 mr-2" />Send to Customer
                  </Button>
                </div>
              )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="list">Quotation List</TabsTrigger>
                <TabsTrigger value="form">Create Quotation</TabsTrigger>
                <TabsTrigger value="preview">A4 Preview</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* QUOTATION LIST */}
              <TabsContent value="list">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Total Quotations</p><p className="text-2xl font-bold">{quotations.length}</p></CardContent></Card>
                  <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Pending</p><p className="text-2xl font-bold text-blue-600">{quotations.filter(q => q.status === 'sent').length}</p></CardContent></Card>
                  <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Approved</p><p className="text-2xl font-bold text-green-600">{quotations.filter(q => q.status === 'approved').length}</p></CardContent></Card>
                  <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Total Value</p><p className="text-2xl font-bold">${quotations.reduce((s, q) => s + q.total, 0).toLocaleString()}</p></CardContent></Card>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="p-4 border-b">
                      <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input placeholder="Search quotations..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Quote #</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Valid Until</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredQuotations.map((quote) => (
                          <TableRow key={quote.id}>
                            <TableCell className="font-mono font-medium">{quote.id}</TableCell>
                            <TableCell>{quote.customer}</TableCell>
                            <TableCell>{quote.date}</TableCell>
                            <TableCell>{quote.validUntil}</TableCell>
                            <TableCell>{quote.items}</TableCell>
                            <TableCell className="font-medium">${quote.total.toLocaleString()}</TableCell>
                            <TableCell><Badge className={statusColors[quote.status]}>{quote.status}</Badge></TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon"><Send className="w-4 h-4 text-blue-500" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* QUOTATION FORM */}
              <TabsContent value="form">
                <div className="space-y-6">
                  {/* Customer Details */}
                  <Card>
                    <CardHeader><CardTitle>Customer Details</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Customer Name *</Label>
                          <Input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} placeholder="Company name" />
                        </div>
                        <div className="space-y-2">
                          <Label>Address</Label>
                          <Input value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} placeholder="Full address" />
                        </div>
                        <div className="space-y-2">
                          <Label>Primary Contact Person *</Label>
                          <Input value={customer.contactPerson1} onChange={(e) => setCustomer({ ...customer, contactPerson1: e.target.value })} placeholder="Contact name" />
                        </div>
                        <div className="space-y-2">
                          <Label>Secondary Contact (Optional)</Label>
                          <Input value={customer.contactPerson2} onChange={(e) => setCustomer({ ...customer, contactPerson2: e.target.value })} placeholder="Contact name" />
                        </div>
                        <div className="space-y-2">
                          <Label>Email (Optional)</Label>
                          <Input type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} placeholder="email@company.com" />
                        </div>
                        <div className="space-y-2">
                          <Label>Mobile (Optional)</Label>
                          <Input value={customer.mobile} onChange={(e) => setCustomer({ ...customer, mobile: e.target.value })} placeholder="+65 9XXX XXXX" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Line Items */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Quotation Items</CardTitle>
                      <Button size="sm" onClick={addItem}><Plus className="w-4 h-4 mr-1" />Add Item</Button>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 border-y">
                            <tr>
                              <th colSpan={6} className="px-3 py-2 text-left font-semibold bg-blue-50 text-blue-800 border-r">Customer Quote</th>
                              <th colSpan={4} className="px-3 py-2 text-left font-semibold bg-amber-50 text-amber-800">Vendor / Margin (Internal)</th>
                            </tr>
                            <tr className="text-xs text-slate-600">
                              <th className="px-3 py-2 text-left w-12">#</th>
                              <th className="px-3 py-2 text-left min-w-[200px]">Description</th>
                              <th className="px-3 py-2 text-right w-24">Unit Price</th>
                              <th className="px-3 py-2 text-center w-20">UOM</th>
                              <th className="px-3 py-2 text-center w-16">QTY</th>
                              <th className="px-3 py-2 text-right w-28 border-r">Amount</th>
                              <th className="px-3 py-2 text-left min-w-[150px] bg-amber-50/50">Vendor</th>
                              <th className="px-3 py-2 text-center w-20 bg-amber-50/50">Markup %</th>
                              <th className="px-3 py-2 text-right w-24 bg-amber-50/50">Markup $</th>
                              <th className="px-3 py-2 text-center w-16 bg-amber-50/50"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item, i) => (
                              <tr key={i} className="border-b hover:bg-slate-50">
                                <td className="px-3 py-2 text-center font-mono text-slate-500">{item.serial}</td>
                                <td className="px-3 py-2"><Input value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} placeholder="Item description" className="h-8" /></td>
                                <td className="px-3 py-2"><Input type="number" value={item.unitPrice} onChange={(e) => updateItem(i, 'unitPrice', parseFloat(e.target.value) || 0)} className="h-8 text-right" /></td>
                                <td className="px-3 py-2">
                                  <Select value={item.uom} onValueChange={(v) => updateItem(i, 'uom', v)}>
                                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pcs">pcs</SelectItem>
                                      <SelectItem value="set">set</SelectItem>
                                      <SelectItem value="lot">lot</SelectItem>
                                      <SelectItem value="kg">kg</SelectItem>
                                      <SelectItem value="m">m</SelectItem>
                                      <SelectItem value="sqm">sqm</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="px-3 py-2"><Input type="number" value={item.qty} onChange={(e) => updateItem(i, 'qty', parseInt(e.target.value) || 0)} className="h-8 text-center" /></td>
                                <td className="px-3 py-2 text-right font-medium border-r">${calculateItemAmount(item).toLocaleString()}</td>
                                <td className="px-3 py-2 bg-amber-50/30">
                                  <Select value={item.vendorName} onValueChange={(v) => updateItem(i, 'vendorName', v)}>
                                    <SelectTrigger className="h-8"><SelectValue placeholder="Select vendor" /></SelectTrigger>
                                    <SelectContent>{vendors.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                                  </Select>
                                </td>
                                <td className="px-3 py-2 bg-amber-50/30"><Input type="number" value={item.markupPercent} onChange={(e) => updateItem(i, 'markupPercent', parseFloat(e.target.value) || 0)} className="h-8 text-center" placeholder="%" /></td>
                                <td className="px-3 py-2 text-right font-medium text-green-600 bg-amber-50/30">${item.markupAmount.toLocaleString()}</td>
                                <td className="px-3 py-2 text-center bg-amber-50/30">
                                  {items.length > 1 && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeItem(i)}><Trash2 className="w-3 h-3 text-red-500" /></Button>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Totals */}
                      <div className="grid grid-cols-2 gap-4 p-4 border-t bg-slate-50">
                        <div className="space-y-2 pr-4 border-r">
                          <p className="font-semibold text-blue-800">Customer Totals</p>
                          <div className="flex justify-between"><span>Sub-Total:</span><span className="font-medium">${customerSubtotal.toLocaleString()}</span></div>
                          <div className="flex justify-between"><span>GST ({gstRate}%):</span><span className="font-medium">${customerGST.toLocaleString()}</span></div>
                          <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Grand Total (incl. GST):</span><span className="text-blue-700">${customerTotal.toLocaleString()}</span></div>
                        </div>
                        <div className="space-y-2 pl-4">
                          <p className="font-semibold text-amber-800">Vendor Totals (Internal)</p>
                          <div className="flex justify-between"><span>Sub-Total:</span><span className="font-medium">${vendorSubtotal.toLocaleString()}</span></div>
                          <div className="flex justify-between"><span>GST ({gstRate}%):</span><span className="font-medium">${vendorGST.toLocaleString()}</span></div>
                          <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Grand Total (incl. GST):</span><span className="text-amber-700">${vendorTotal.toLocaleString()}</span></div>
                          <div className="flex justify-between text-green-600 font-semibold mt-2"><span>Total Profit/Loss:</span><span>${totalProfit.toLocaleString()}</span></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Terms & Conditions */}
                  <Card>
                    <CardHeader><CardTitle>Terms & Conditions</CardTitle></CardHeader>
                    <CardContent>
                      <Textarea 
                        value={termsConditions} 
                        onChange={(e) => setTermsConditions(e.target.value)} 
                        placeholder="Enter terms and conditions..."
                        className="min-h-[150px]"
                      />
                    </CardContent>
                  </Card>

                  {/* Quotation Meta */}
                  <Card>
                    <CardHeader><CardTitle>Quotation Details</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Issued By</Label>
                          <Input 
                            value={quotationMeta.issuedBy} 
                            onChange={(e) => setQuotationMeta({ ...quotationMeta, issuedBy: e.target.value })} 
                            placeholder="Sales Person Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Payment Term</Label>
                          <Select value={quotationMeta.paymentTerm} onValueChange={(v) => setQuotationMeta({ ...quotationMeta, paymentTerm: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="COD">Cash on Delivery (COD)</SelectItem>
                              <SelectItem value="Net 7 Days">Net 7 Days</SelectItem>
                              <SelectItem value="Net 14 Days">Net 14 Days</SelectItem>
                              <SelectItem value="Net 30 Days">Net 30 Days</SelectItem>
                              <SelectItem value="Net 60 Days">Net 60 Days</SelectItem>
                              <SelectItem value="50% Deposit">50% Deposit, Balance on Delivery</SelectItem>
                              <SelectItem value="Full Prepayment">Full Prepayment Required</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Valid For (days)</Label>
                          <Input 
                            type="number"
                            value={quotationMeta.validDays} 
                            onChange={(e) => setQuotationMeta({ ...quotationMeta, validDays: parseInt(e.target.value) || 30 })} 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Details */}
                  <Card>
                    <CardHeader><CardTitle>Payment Bank Details</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Bank Name</Label>
                              <Input value={bankDetails.bankName} onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <Label>Bank Account Name</Label>
                              <Input value={bankDetails.accountName} onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Bank Account Number</Label>
                              <Input value={bankDetails.accountNumber} onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <Label>Bank Swift Code</Label>
                              <Input value={bankDetails.swiftCode} onChange={(e) => setBankDetails({ ...bankDetails, swiftCode: e.target.value })} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>PayNow UEN</Label>
                            <Input value={bankDetails.payNowUEN} onChange={(e) => setBankDetails({ ...bankDetails, payNowUEN: e.target.value })} />
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                          <div 
                            className="w-32 h-32 bg-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors border"
                            onClick={() => qrInputRef.current?.click()}
                          >
                            {bankDetails.qrCode ? (
                              <img src={bankDetails.qrCode} alt="Payment QR" className="w-full h-full object-contain p-1" />
                            ) : (
                              <div className="text-center">
                                <QrCode className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                                <span className="text-xs text-slate-500">Upload QR</span>
                              </div>
                            )}
                          </div>
                          <input ref={qrInputRef} type="file" accept="image/*" className="hidden" onChange={handleQRUpload} />
                          <p className="text-xs text-slate-500 mt-2">PayNow / Payment QR Code</p>
                          {bankDetails.qrCode && (
                            <Button variant="ghost" size="sm" className="mt-2 text-red-500" onClick={() => setBankDetails({ ...bankDetails, qrCode: null })}>
                              Remove QR
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* A4 PREVIEW */}
              <TabsContent value="preview">
                {/* Template Selector */}
                <div className="mb-6">
                  <Card>
                    <CardContent className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <LayoutTemplate className="w-5 h-5 text-slate-500" />
                          <Label className="text-sm font-medium">Select Template:</Label>
                        </div>
                        <div className="flex gap-2">
                          {QUOTATION_TEMPLATES.map((template) => (
                            <Button
                              key={template.id}
                              variant={selectedTemplate === template.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedTemplate(template.id)}
                              className={selectedTemplate === template.id ? "bg-lime-500 hover:bg-lime-600" : ""}
                            >
                              <Palette className="w-4 h-4 mr-2" />
                              {template.name}
                            </Button>
                          ))}
                        </div>
                        <div className="ml-auto flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => window.print()}>
                            <Printer className="w-4 h-4 mr-2" />Print
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />Download PDF
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* A4 Preview with Selected Template */}
                <div className="flex justify-center bg-slate-200 py-8 rounded-lg">
                  <div className="shadow-2xl">
                    <SelectedTemplateComponent data={getTemplateData()} />
                  </div>
                </div>
              </TabsContent>

              {/* SETTINGS */}
              <TabsContent value="settings">
                <div className="space-y-6">
                  <Card>
                    <CardHeader><CardTitle>Company Letterhead Settings</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-lime-500 transition-colors" onClick={() => logoInputRef.current?.click()}>
                          {companyInfo.logo ? (
                            <img src={companyInfo.logo} alt="Logo" className="w-full h-full object-contain" />
                          ) : (
                            <div className="text-center text-slate-400">
                              <Upload className="w-6 h-6 mx-auto mb-1" />
                              <span className="text-xs">Upload Logo</span>
                            </div>
                          )}
                        </div>
                        <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Company Name</Label>
                            <Input value={companyInfo.name} onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Address</Label>
                            <Input value={companyInfo.address} onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label>UEN #</Label>
                            <Input value={companyInfo.uen} onChange={(e) => setCompanyInfo({ ...companyInfo, uen: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label>GST # (Optional)</Label>
                            <Input value={companyInfo.gst} onChange={(e) => setCompanyInfo({ ...companyInfo, gst: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={companyInfo.email} onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input value={companyInfo.phone} onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Document Settings</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>GST Rate (%)</Label>
                          <Input type="number" value={gstRate} onChange={(e) => setGstRate(parseFloat(e.target.value) || 0)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Default Valid Days</Label>
                          <Input type="number" value={quotationMeta.validDays} onChange={(e) => setQuotationMeta({ ...quotationMeta, validDays: parseInt(e.target.value) || 30 })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Default Issued By</Label>
                          <Input value={quotationMeta.issuedBy} onChange={(e) => setQuotationMeta({ ...quotationMeta, issuedBy: e.target.value })} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Template Preferences</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        {QUOTATION_TEMPLATES.map((template) => (
                          <div
                            key={template.id}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedTemplate === template.id 
                                ? 'border-lime-500 bg-lime-50' 
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Palette className={`w-5 h-5 ${selectedTemplate === template.id ? 'text-lime-600' : 'text-slate-400'}`} />
                              <span className="font-medium">{template.name}</span>
                            </div>
                            <p className="text-xs text-slate-500">{template.preview}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Default Terms & Conditions</CardTitle></CardHeader>
                    <CardContent>
                      <Textarea 
                        value={termsConditions} 
                        onChange={(e) => setTermsConditions(e.target.value)} 
                        placeholder="Enter default terms and conditions..."
                        className="min-h-[150px]"
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  );
}