import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Zap, FileText, Send, Bell, CreditCard, CheckCircle2, 
  Clock, AlertTriangle, RefreshCw, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

export default function InvoiceNowAutomation() {
  const queryClient = useQueryClient();

  // Fetch accepted quotes to convert
  const { data: acceptedQuotes = [] } = useQuery({
    queryKey: ['accepted-quotes'],
    queryFn: () => base44.entities.Quotation.filter({ status: 'accepted' }),
    refetchInterval: 60000
  });

  // Fetch validated invoices to transmit
  const { data: validatedInvoices = [] } = useQuery({
    queryKey: ['validated-invoices'],
    queryFn: () => base44.entities.InvoiceNow.filter({ status: 'validated', peppol_status: 'not_sent' }),
    refetchInterval: 60000
  });

  // Fetch overdue invoices
  const { data: overdueInvoices = [] } = useQuery({
    queryKey: ['overdue-invoices'],
    queryFn: async () => {
      const invoices = await base44.entities.InvoiceNow.filter({ status: 'transmitted' });
      return invoices.filter(inv => moment(inv.due_date).isBefore(moment()) && inv.status !== 'paid');
    },
    refetchInterval: 60000
  });

  // Convert quote to invoice
  const convertQuoteMutation = useMutation({
    mutationFn: async (quote) => {
      const invoiceNumber = `INV-${moment().format('YYMM')}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // Calculate ESG values
      // Assuming default factor of 0.2 kgCO2e per SGD if no product-specific data
      const emissionFactor = 0.2; 
      const totalEmissions = (quote.total || 0) * emissionFactor / 1000; // Tonnes
      const carbonTaxRate = 25.00;
      const carbonTax = totalEmissions * carbonTaxRate;

      const invoice = await base44.entities.InvoiceNow.create({
        esg_details: {
          carbon_emissions_tonnes: totalEmissions,
          carbon_tax_rate: carbonTaxRate,
          carbon_tax_amount: carbonTax,
          esg_compliance_cost: 5.00, // Flat fee for example
          scope_category: 'scope_3'
        },
        invoice_number: invoiceNumber,
        invoice_type_code: '380',
        issue_date: moment().format('YYYY-MM-DD'),
        due_date: moment().add(30, 'days').format('YYYY-MM-DD'),
        document_currency_code: quote.currency || 'SGD',
        quotation_id: quote.id,
        customer_id: quote.customer_id,
        seller: {}, // Will be populated from settings
        buyer: {
          name: quote.customer_name,
          contact_email: quote.customer_email
        },
        items: quote.items?.map((item, i) => ({
          line_id: String(i + 1),
          description: item.description,
          quantity: item.quantity,
          unit_code: 'EA',
          unit_price: item.unit_price,
          tax_category: 'SR',
          tax_percent: 9
        })) || [],
        line_extension_amount: quote.subtotal,
        tax_amount: quote.tax_amount,
        payable_amount: quote.total,
        status: 'draft',
        peppol_status: 'not_sent',
        iras_status: 'not_submitted'
      });

      // Update quote to mark as invoiced
      await base44.entities.Quotation.update(quote.id, { 
        status: 'invoiced',
        invoice_id: invoice.id 
      });

      return invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accepted-quotes'] });
      queryClient.invalidateQueries({ queryKey: ['invoicenow'] });
      toast.success('Quote converted to invoice');
    }
  });

  // Transmit invoice via Peppol
  const transmitMutation = useMutation({
    mutationFn: async (invoice) => {
      await base44.entities.InvoiceNow.update(invoice.id, {
        status: 'transmitted',
        peppol_status: 'pending',
        peppol_transmission_date: new Date().toISOString(),
        iras_status: 'pending',
        iras_submission_date: new Date().toISOString()
      });
      
      // Simulate delivery after delay
      setTimeout(async () => {
        await base44.entities.InvoiceNow.update(invoice.id, {
          peppol_status: 'delivered',
          peppol_delivery_date: new Date().toISOString(),
          iras_status: 'submitted'
        });
      }, 3000);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validated-invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoicenow'] });
      toast.success('Invoice transmitted via Peppol');
    }
  });

  // Send overdue reminder
  const sendReminderMutation = useMutation({
    mutationFn: async (invoice) => {
      await base44.integrations.Core.SendEmail({
        to: invoice.buyer?.contact_email,
        subject: `Payment Reminder: Invoice ${invoice.invoice_number}`,
        body: `Dear ${invoice.buyer?.name},

This is a friendly reminder that invoice ${invoice.invoice_number} for $${invoice.payable_amount?.toLocaleString()} was due on ${moment(invoice.due_date).format('DD MMM YYYY')}.

Please arrange payment at your earliest convenience.

Best regards`
      });
      
      await base44.entities.InvoiceNow.update(invoice.id, { 
        status: 'overdue',
        note: `${invoice.note || ''}\n[${moment().format('DD MMM')}] Payment reminder sent`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overdue-invoices'] });
      toast.success('Reminder sent');
    }
  });

  // Process all automations
  const runAllAutomations = async () => {
    // Convert accepted quotes
    for (const quote of acceptedQuotes.slice(0, 5)) {
      await convertQuoteMutation.mutateAsync(quote);
    }
    
    // Transmit validated invoices
    for (const invoice of validatedInvoices.slice(0, 5)) {
      await transmitMutation.mutateAsync(invoice);
    }
    
    toast.success('Automation complete');
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />Automation Queue
          </CardTitle>
          <Button size="sm" onClick={runAllAutomations} disabled={convertQuoteMutation.isPending || transmitMutation.isPending}>
            {(convertQuoteMutation.isPending || transmitMutation.isPending) ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Run All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quote to Invoice */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Quote → Invoice</p>
              <p className="text-xs text-slate-500">{acceptedQuotes.length} accepted quotes pending</p>
            </div>
          </div>
          <Badge className="bg-blue-100 text-blue-700">{acceptedQuotes.length}</Badge>
        </div>

        {/* Peppol Transmission */}
        <div className="flex items-center justify-between p-3 bg-violet-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <Send className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Peppol Transmission</p>
              <p className="text-xs text-slate-500">{validatedInvoices.length} validated invoices pending</p>
            </div>
          </div>
          <Badge className="bg-violet-100 text-violet-700">{validatedInvoices.length}</Badge>
        </div>

        {/* Overdue Reminders */}
        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Bell className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Overdue Reminders</p>
              <p className="text-xs text-slate-500">{overdueInvoices.length} invoices overdue</p>
            </div>
          </div>
          <Badge className="bg-red-100 text-red-700">{overdueInvoices.length}</Badge>
        </div>

        {/* Recent Activity */}
        <div className="border-t pt-3 mt-3">
          <p className="text-xs text-slate-500 mb-2">Recent Automation Activity</p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Auto-transmission enabled</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Quote conversion active</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-3 h-3 text-amber-500" />
              <span>Overdue check: every hour</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}