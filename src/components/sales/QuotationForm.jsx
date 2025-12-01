import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Plus, Trash2, Calculator, Sparkles, Send, Save, Users } from 'lucide-react';

export default function QuotationForm({ open, onClose, quotation, onSave, onSaveAndSend, products }) {
  const [formData, setFormData] = useState({
    customer_id: '',
    customer_name: '',
    customer_email: '',
    valid_days: 30,
    notes: '',
    terms: 'Payment due within 30 days of invoice date.',
    items: [{ product_id: '', description: '', quantity: 1, unit_price: 0, discount: 0 }]
  });

  // Fetch customers from database
  const { data: dbCustomers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list('-created_date'),
    enabled: open
  });

  const sampleProducts = products || [
    { id: '1', name: 'Software License - Enterprise', sku: 'SL-ENT-001', price: 5000 },
    { id: '2', name: 'Implementation Services', sku: 'SVC-IMP-001', price: 2500 },
    { id: '3', name: 'Annual Support Package', sku: 'SUP-ANN-001', price: 1200 },
    { id: '4', name: 'Training (per day)', sku: 'TRN-DAY-001', price: 800 },
    { id: '5', name: 'Custom Development (per hour)', sku: 'DEV-HR-001', price: 150 }
  ];

  // Reset form when quotation changes
  useEffect(() => {
    if (quotation) {
      setFormData(quotation);
    } else {
      setFormData({
        customer_id: '',
        customer_name: '',
        customer_email: '',
        valid_days: 30,
        notes: '',
        terms: 'Payment due within 30 days of invoice date.',
        items: [{ product_id: '', description: '', quantity: 1, unit_price: 0, discount: 0 }]
      });
    }
  }, [quotation, open]);

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_id: '', description: '', quantity: 1, unit_price: 0, discount: 0 }]
    });
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    if (field === 'product_id') {
      const product = sampleProducts.find(p => p.id === value);
      if (product) {
        newItems[index].description = product.name;
        newItems[index].unit_price = product.price;
      }
    }

    setFormData({ ...formData, items: newItems });
  };

  const calculateItemTotal = (item) => {
    const subtotal = item.quantity * item.unit_price;
    return subtotal - (subtotal * (item.discount / 100));
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  };

  const calculateDiscount = () => {
    return formData.items.reduce((sum, item) => {
      const subtotal = item.quantity * item.unit_price;
      return sum + (subtotal * (item.discount / 100));
    }, 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() - calculateDiscount()) * 0.09;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateTax();
  };

  const handleCustomerChange = (customerId) => {
    const customer = dbCustomers.find(c => c.id === customerId);
    setFormData({
      ...formData,
      customer_id: customerId,
      customer_name: customer?.name || '',
      customer_email: customer?.email || ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{quotation ? 'Edit Quotation' : 'Create New Quotation'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Details */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Customer
              </Label>
              <Select value={formData.customer_id} onValueChange={handleCustomerChange}>
                <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>
                  {dbCustomers.length > 0 ? (
                    dbCustomers.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-3 text-sm text-slate-500 text-center">
                      No customers yet. Add customers first.
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                value={formData.customer_email} 
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                placeholder="customer@email.com"
              />
            </div>
            <div>
              <Label>Valid For (days)</Label>
              <Input 
                type="number" 
                value={formData.valid_days}
                onChange={(e) => setFormData({ ...formData, valid_days: parseInt(e.target.value) })}
              />
            </div>
          </div>

          {/* Line Items */}
          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Line Items</CardTitle>
                <Button variant="outline" size="sm" onClick={addItem}>
                  <Plus className="w-4 h-4 mr-2" /> Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Product</th>
                    <th className="text-left p-3 text-sm font-medium">Description</th>
                    <th className="text-center p-3 text-sm font-medium w-20">Qty</th>
                    <th className="text-right p-3 text-sm font-medium w-28">Unit Price</th>
                    <th className="text-center p-3 text-sm font-medium w-20">Disc %</th>
                    <th className="text-right p-3 text-sm font-medium w-28">Total</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">
                        <Select value={item.product_id} onValueChange={(v) => updateItem(index, 'product_id', v)}>
                          <SelectTrigger className="w-40"><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            {sampleProducts.map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2">
                        <Input 
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder="Description"
                        />
                      </td>
                      <td className="p-2">
                        <Input 
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="text-center"
                        />
                      </td>
                      <td className="p-2">
                        <Input 
                          type="number"
                          min="0"
                          value={item.unit_price}
                          onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="text-right"
                        />
                      </td>
                      <td className="p-2">
                        <Input 
                          type="number"
                          min="0"
                          max="100"
                          value={item.discount}
                          onChange={(e) => updateItem(index, 'discount', parseFloat(e.target.value) || 0)}
                          className="text-center"
                        />
                      </td>
                      <td className="p-2 text-right font-medium">
                        ${calculateItemTotal(item).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-2">
                        {formData.items.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="border-t p-4 bg-slate-50">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${calculateSubtotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm text-red-600">
                      <span>Discount:</span>
                      <span>-${calculateDiscount().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>GST (9%):</span>
                      <span>${calculateTax().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>${calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes & Terms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Notes</Label>
              <Textarea 
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Internal notes..."
                rows={3}
              />
            </div>
            <div>
              <Label>Terms & Conditions</Label>
              <Textarea 
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="outline" onClick={() => onSave && onSave({ 
            ...formData, 
            status: 'draft',
            subtotal: calculateSubtotal(),
            discount_total: calculateDiscount(),
            tax_amount: calculateTax(),
            total: calculateTotal()
          })}>
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </Button>
          <Button className="bg-lime-500 hover:bg-lime-600" onClick={() => onSaveAndSend && onSaveAndSend({ 
            ...formData, 
            status: 'draft',
            subtotal: calculateSubtotal(),
            discount_total: calculateDiscount(),
            tax_amount: calculateTax(),
            total: calculateTotal()
          })}>
            <Send className="w-4 h-4 mr-2" /> Save & Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}