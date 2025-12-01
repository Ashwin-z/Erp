import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Receipt, Loader2, CheckCircle2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

export default function CreateInvoiceModal({ open, onClose, quotation, onCreated }) {
  const queryClient = useQueryClient();
  const [dueInDays, setDueInDays] = useState(30);

  const createInvoiceMutation = useMutation({
    mutationFn: async () => {
      const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
      const issueDate = new Date().toISOString().split('T')[0];
      const dueDate = new Date(Date.now() + dueInDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const invoice = await base44.entities.Invoice.create({
        invoice_number: invoiceNumber,
        quotation_id: quotation.id,
        customer_id: quotation.customer_id,
        customer_name: quotation.customer_name,
        customer_email: quotation.customer_email,
        issue_date: issueDate,
        due_date: dueDate,
        status: 'draft',
        items: quotation.items,
        subtotal: quotation.subtotal,
        discount_total: quotation.discount_total,
        tax_rate: 9,
        tax_amount: quotation.tax_amount,
        total: quotation.total,
        notes: quotation.notes,
        terms: quotation.terms
      });

      // Update quotation status
      await base44.entities.Quotation.update(quotation.id, { status: 'accepted' });

      // Create notification
      await base44.entities.SalesNotification.create({
        type: 'quote_accepted',
        title: 'Quotation Converted to Invoice',
        message: `Invoice ${invoiceNumber} created from ${quotation.quote_number}`,
        reference_type: 'invoice',
        reference_id: invoice.id,
        customer_name: quotation.customer_name,
        amount: quotation.total
      });

      // Send email to customer
      await base44.integrations.Core.SendEmail({
        to: quotation.customer_email,
        subject: `Your Quotation ${quotation.quote_number} Has Been Accepted - Invoice ${invoiceNumber}`,
        body: `Dear ${quotation.customer_name},\n\nThank you! Your quotation ${quotation.quote_number} has been accepted.\n\nWe have generated invoice ${invoiceNumber} for $${quotation.total?.toLocaleString()}.\n\nPayment Due: ${moment(dueDate).format('DD MMM YYYY')}\n\nPlease let us know if you have any questions.\n\nBest regards,\nARKFinex Team`
      });

      return invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['salesNotifications'] });
      toast.success('Invoice created successfully');
      onCreated?.();
      onClose();
    },
    onError: (error) => {
      toast.error('Failed to create invoice: ' + error.message);
    }
  });

  if (!quotation) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-green-600" />
            Create Invoice from Quotation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Quote Summary */}
          <div className="p-4 bg-slate-50 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium">{quotation.quote_number}</p>
                <p className="text-sm text-slate-500">{quotation.customer_name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${quotation.total?.toLocaleString()}</p>
                <Badge className="bg-green-100 text-green-700">Ready to Invoice</Badge>
              </div>
            </div>
          </div>

          {/* Items Preview */}
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
                {quotation.items?.map((item, idx) => (
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

          {/* Due Date */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <Label>Payment Due In:</Label>
            </div>
            <Input
              type="number"
              value={dueInDays}
              onChange={(e) => setDueInDays(parseInt(e.target.value) || 30)}
              className="w-20"
            />
            <span className="text-slate-500">days ({moment().add(dueInDays, 'days').format('DD MMM YYYY')})</span>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal:</span><span>${quotation.subtotal?.toLocaleString()}</span></div>
              <div className="flex justify-between text-red-600"><span>Discount:</span><span>-${quotation.discount_total?.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>GST (9%):</span><span>${quotation.tax_amount?.toLocaleString()}</span></div>
              <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Invoice Total:</span><span>${quotation.total?.toLocaleString()}</span></div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => createInvoiceMutation.mutate()}
            disabled={createInvoiceMutation.isPending}
          >
            {createInvoiceMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Create Invoice
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}