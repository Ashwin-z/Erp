import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Save, Plus, Trash2, Building2, User, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

const taxCategories = [
  { code: 'SR', label: 'Standard Rate (9%)', percent: 9 },
  { code: 'ZR', label: 'Zero Rate (0%)', percent: 0 },
  { code: 'ES', label: 'Exempt Supply', percent: 0 },
  { code: 'OS', label: 'Out of Scope', percent: 0 },
  { code: 'NG', label: 'Not GST Registered', percent: 0 }
];

const invoiceTypeCodes = [
  { code: '380', label: 'Commercial Invoice' },
  { code: '381', label: 'Credit Note' },
  { code: '383', label: 'Debit Note' },
  { code: '384', label: 'Corrective Invoice' },
  { code: '386', label: 'Prepayment Invoice' },
  { code: '389', label: 'Self-billed Invoice' }
];

const generateInvoiceNumber = () => {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}${random}`;
};

export default function InvoiceNowFormModal({ open, onClose, invoice }) {
  const [formData, setFormData] = useState({
    invoice_number: '',
    invoice_type_code: '380',
    issue_date: moment().format('YYYY-MM-DD'),
    due_date: moment().add(30, 'days').format('YYYY-MM-DD'),
    document_currency_code: 'SGD',
    buyer_reference: '',
    order_reference: '',
    seller: {
      uen: '',
      gst_reg_no: '',
      name: '',
      street: '',
      city: 'Singapore',
      postal_code: '',
      country_code: 'SG',
      contact_name: '',
      contact_email: ''
    },
    buyer: {
      uen: '',
      gst_reg_no: '',
      name: '',
      street: '',
      city: '',
      postal_code: '',
      country_code: 'SG',
      contact_name: '',
      contact_email: ''
    },
    payment: {
      means_code: '30',
      terms_note: 'Net 30 days',
      bank_account_name: '',
      bank_account_number: ''
    },
    items: [{ line_id: '1', description: '', name: '', quantity: 1, unit_code: 'EA', unit_price: 0, tax_category: 'SR', tax_percent: 9 }],
    note: ''
  });
  const [validationErrors, setValidationErrors] = useState([]);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list(),
    enabled: open
  });

  const { data: peppolSettings } = useQuery({
    queryKey: ['peppol-settings'],
    queryFn: () => base44.entities.PeppolSettings.list(),
    enabled: open
  });

  useEffect(() => {
    if (invoice) {
      setFormData({ ...formData, ...invoice });
    } else {
      // Load seller defaults from settings
      const settings = peppolSettings?.[0];
      setFormData({
        ...formData,
        invoice_number: generateInvoiceNumber(),
        seller: settings?.seller_details ? {
          uen: settings.seller_uen || '',
          gst_reg_no: settings.seller_gst_number || '',
          name: settings.seller_details.legal_name || '',
          street: settings.seller_details.street || '',
          city: settings.seller_details.city || 'Singapore',
          postal_code: settings.seller_details.postal_code || '',
          country_code: 'SG',
          contact_name: settings.seller_details.contact_name || '',
          contact_email: settings.seller_details.contact_email || ''
        } : formData.seller
      });
    }
  }, [invoice, open, peppolSettings]);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.InvoiceNow.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoicenow'] });
      toast.success('Invoice created');
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.InvoiceNow.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoicenow'] });
      toast.success('Invoice updated');
      onClose();
    }
  });

  const validateInvoice = () => {
    const errors = [];
    if (!formData.invoice_number) errors.push('Invoice number is required');
    if (!formData.issue_date) errors.push('Issue date is required');
    if (!formData.seller?.name) errors.push('Seller name is required');
    if (!formData.seller?.uen) errors.push('Seller UEN is required for Peppol');
    if (!formData.buyer?.name) errors.push('Buyer name is required');
    if (!formData.buyer?.uen) errors.push('Buyer UEN is required for Peppol');
    if (!formData.items || formData.items.length === 0) errors.push('At least one line item is required');
    formData.items?.forEach((item, i) => {
      if (!item.description && !item.name) errors.push(`Line ${i + 1}: Description or name required`);
      if (!item.quantity || item.quantity <= 0) errors.push(`Line ${i + 1}: Valid quantity required`);
    });
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const calculateTotals = () => {
    let lineExtension = 0;
    let totalTax = 0;
    
    formData.items?.forEach(item => {
      const lineAmount = (item.quantity || 0) * (item.unit_price || 0) - (item.discount_amount || 0);
      lineExtension += lineAmount;
      totalTax += lineAmount * ((item.tax_percent || 0) / 100);
    });

    return {
      line_extension_amount: lineExtension,
      tax_exclusive_amount: lineExtension,
      tax_amount: totalTax,
      tax_inclusive_amount: lineExtension + totalTax,
      payable_amount: lineExtension + totalTax
    };
  };

  const handleSubmit = async (validate = false) => {
    if (validate && !validateInvoice()) {
      toast.error('Please fix validation errors');
      return;
    }

    setSaving(true);
    const totals = calculateTotals();
    const data = {
      ...formData,
      ...totals,
      status: validate ? 'validated' : 'draft',
      peppol_status: 'not_sent',
      iras_status: 'not_submitted',
      seller: {
        ...formData.seller,
        peppol_id: `0195:${formData.seller.uen}`
      },
      buyer: {
        ...formData.buyer,
        peppol_id: formData.buyer.uen ? `0195:${formData.buyer.uen}` : ''
      }
    };

    try {
      if (invoice) {
        await updateMutation.mutateAsync({ id: invoice.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      toast.error('Failed to save invoice');
    }
    setSaving(false);
  };

  const updateField = (path, value) => {
    const keys = path.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let obj = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { 
        line_id: String(prev.items.length + 1), 
        description: '', 
        name: '', 
        quantity: 1, 
        unit_code: 'EA', 
        unit_price: 0, 
        tax_category: 'SR', 
        tax_percent: 9 
      }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, field, value) => {
    setFormData(prev => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      if (field === 'tax_category') {
        const cat = taxCategories.find(t => t.code === value);
        items[index].tax_percent = cat?.percent || 0;
      }
      return { ...prev, items };
    });
  };

  const handleCustomerSelect = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      updateField('buyer', {
        ...formData.buyer,
        name: customer.name,
        uen: customer.company_uen || '',
        street: customer.address || '',
        city: customer.city || '',
        postal_code: customer.postal_code || '',
        contact_name: customer.contact_person || '',
        contact_email: customer.email || ''
      });
    }
  };

  const totals = calculateTotals();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {invoice ? 'Edit Invoice' : 'New Peppol Invoice'}
          </DialogTitle>
        </DialogHeader>

        {validationErrors.length > 0 && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-700">Validation Errors</p>
                  <ul className="text-sm text-red-600 list-disc list-inside mt-1">
                    {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="header" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="header">Header</TabsTrigger>
            <TabsTrigger value="seller">Seller</TabsTrigger>
            <TabsTrigger value="buyer">Buyer</TabsTrigger>
            <TabsTrigger value="items">Line Items</TabsTrigger>
          </TabsList>

          {/* Header Tab */}
          <TabsContent value="header" className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Invoice Number *</Label>
                <Input value={formData.invoice_number} onChange={(e) => updateField('invoice_number', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Invoice Type</Label>
                <Select value={formData.invoice_type_code} onValueChange={(v) => updateField('invoice_type_code', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {invoiceTypeCodes.map(t => (
                      <SelectItem key={t.code} value={t.code}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={formData.document_currency_code} onValueChange={(v) => updateField('document_currency_code', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SGD">SGD - Singapore Dollar</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Issue Date *</Label>
                <Input type="date" value={formData.issue_date} onChange={(e) => updateField('issue_date', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" value={formData.due_date} onChange={(e) => updateField('due_date', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Buyer Reference (PO#)</Label>
                <Input value={formData.buyer_reference} onChange={(e) => updateField('buyer_reference', e.target.value)} placeholder="Customer PO number" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Invoice Note</Label>
              <Textarea value={formData.note} onChange={(e) => updateField('note', e.target.value)} placeholder="Additional notes..." rows={2} />
            </div>
          </TabsContent>

          {/* Seller Tab */}
          <TabsContent value="seller" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input value={formData.seller.name} onChange={(e) => updateField('seller.name', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>UEN * (for Peppol ID)</Label>
                <Input value={formData.seller.uen} onChange={(e) => updateField('seller.uen', e.target.value)} placeholder="e.g., 201912345A" />
              </div>
              <div className="space-y-2">
                <Label>GST Registration No.</Label>
                <Input value={formData.seller.gst_reg_no} onChange={(e) => updateField('seller.gst_reg_no', e.target.value)} placeholder="e.g., M90000000A" />
              </div>
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input type="email" value={formData.seller.contact_email} onChange={(e) => updateField('seller.contact_email', e.target.value)} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Street Address</Label>
                <Input value={formData.seller.street} onChange={(e) => updateField('seller.street', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={formData.seller.city} onChange={(e) => updateField('seller.city', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input value={formData.seller.postal_code} onChange={(e) => updateField('seller.postal_code', e.target.value)} />
              </div>
            </div>
          </TabsContent>

          {/* Buyer Tab */}
          <TabsContent value="buyer" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Select from Customers</Label>
              <Select onValueChange={handleCustomerSelect}>
                <SelectTrigger><SelectValue placeholder="Choose customer..." /></SelectTrigger>
                <SelectContent>
                  {customers.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input value={formData.buyer.name} onChange={(e) => updateField('buyer.name', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>UEN * (for Peppol ID)</Label>
                <Input value={formData.buyer.uen} onChange={(e) => updateField('buyer.uen', e.target.value)} placeholder="e.g., 201912345A" />
              </div>
              <div className="space-y-2">
                <Label>GST Registration No.</Label>
                <Input value={formData.buyer.gst_reg_no} onChange={(e) => updateField('buyer.gst_reg_no', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input type="email" value={formData.buyer.contact_email} onChange={(e) => updateField('buyer.contact_email', e.target.value)} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Street Address</Label>
                <Input value={formData.buyer.street} onChange={(e) => updateField('buyer.street', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={formData.buyer.city} onChange={(e) => updateField('buyer.city', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input value={formData.buyer.postal_code} onChange={(e) => updateField('buyer.postal_code', e.target.value)} />
              </div>
            </div>
          </TabsContent>

          {/* Items Tab */}
          <TabsContent value="items" className="mt-4">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-20">Qty</TableHead>
                    <TableHead className="w-24">Unit</TableHead>
                    <TableHead className="w-28">Price</TableHead>
                    <TableHead className="w-36">Tax Category</TableHead>
                    <TableHead className="w-24 text-right">Amount</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.items?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-slate-500">{index + 1}</TableCell>
                      <TableCell>
                        <Input 
                          value={item.description} 
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder="Item description"
                          className="border-0 bg-transparent"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={item.quantity} 
                          onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="border-0 bg-transparent text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <Select value={item.unit_code} onValueChange={(v) => updateItem(index, 'unit_code', v)}>
                          <SelectTrigger className="border-0 bg-transparent"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EA">Each</SelectItem>
                            <SelectItem value="HUR">Hour</SelectItem>
                            <SelectItem value="DAY">Day</SelectItem>
                            <SelectItem value="MON">Month</SelectItem>
                            <SelectItem value="KGM">KG</SelectItem>
                            <SelectItem value="MTR">Meter</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={item.unit_price} 
                          onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="border-0 bg-transparent text-right"
                        />
                      </TableCell>
                      <TableCell>
                        <Select value={item.tax_category} onValueChange={(v) => updateItem(index, 'tax_category', v)}>
                          <SelectTrigger className="border-0 bg-transparent text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {taxCategories.map(t => (
                              <SelectItem key={t.code} value={t.code}>{t.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${((item.quantity || 0) * (item.unit_price || 0)).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => removeItem(index)} disabled={formData.items.length <= 1}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Button variant="outline" onClick={addItem} className="mt-3">
              <Plus className="w-4 h-4 mr-2" />Add Line Item
            </Button>

            {/* Totals */}
            <div className="flex justify-end mt-4">
              <div className="w-72 space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal:</span><span>${totals.line_extension_amount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>GST:</span><span>${totals.tax_amount.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span><span>${totals.payable_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="outline" onClick={() => handleSubmit(false)} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />Save Draft
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleSubmit(true)} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
            Validate & Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}