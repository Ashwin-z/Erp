import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Mail, Phone, Globe, Building2, MapPin, CreditCard, 
  FileText, Calendar, DollarSign, ExternalLink, User
} from 'lucide-react';
import moment from 'moment';

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-slate-100 text-slate-600',
  prospect: 'bg-blue-100 text-blue-700',
  draft: 'bg-slate-100 text-slate-600',
  sent: 'bg-blue-100 text-blue-700',
  viewed: 'bg-violet-100 text-violet-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
  expired: 'bg-amber-100 text-amber-700'
};

export default function ClientDetailModal({ open, onClose, client }) {
  const { data: quotations = [] } = useQuery({
    queryKey: ['quotations'],
    queryFn: () => base44.entities.Quotation.list('-created_date'),
    enabled: open && !!client,
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => base44.entities.Invoice.list('-created_date'),
    enabled: open && !!client,
  });

  if (!client) return null;

  const clientQuotes = quotations.filter(q => q.client_id === client.id || q.customer_email === client.email);
  const clientInvoices = invoices.filter(i => i.customer_email === client.email);

  const totalQuoteValue = clientQuotes.reduce((sum, q) => sum + (q.total || 0), 0);
  const totalInvoiceValue = clientInvoices.reduce((sum, i) => sum + (i.total || 0), 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-600">
                {client.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <DialogTitle className="text-xl">{client.name}</DialogTitle>
                <p className="text-slate-500">{client.company_name || 'Individual'}</p>
              </div>
            </div>
            <Badge className={statusColors[client.status]}>{client.status}</Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full mt-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quotes">Quotes ({clientQuotes.length})</TabsTrigger>
            <TabsTrigger value="invoices">Invoices ({clientInvoices.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-slate-900">{clientQuotes.length}</p>
                  <p className="text-sm text-slate-500">Total Quotes</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-slate-900">${totalQuoteValue.toLocaleString()}</p>
                  <p className="text-sm text-slate-500">Quote Value</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-600">${totalInvoiceValue.toLocaleString()}</p>
                  <p className="text-sm text-slate-500">Total Invoiced</p>
                </CardContent>
              </Card>
            </div>

            {/* Contact & Company Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="w-4 h-4" />Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">{client.phone}</span>
                    </div>
                  )}
                  {client.contact_person && (
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">{client.contact_person} {client.contact_role && `(${client.contact_role})`}</span>
                    </div>
                  )}
                  {client.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                        {client.website} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="w-4 h-4" />Company Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {client.company_name && (
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">{client.company_name}</span>
                    </div>
                  )}
                  {client.company_uen && (
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">UEN: {client.company_uen}</span>
                    </div>
                  )}
                  {client.industry && (
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">{client.industry}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                      <span className="text-sm">{client.address}{client.city && `, ${client.city}`} {client.postal_code} {client.country}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Billing Info */}
            <Card className="border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />Billing Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Payment Terms</p>
                    <p className="font-medium">{client.payment_terms || 'Net 30'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Currency</p>
                    <p className="font-medium">{client.currency || 'SGD'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Credit Limit</p>
                    <p className="font-medium">{client.credit_limit ? `$${client.credit_limit.toLocaleString()}` : 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Tax ID</p>
                    <p className="font-medium">{client.tax_id || '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {client.notes && (
              <Card className="border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{client.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="quotes" className="mt-4">
            {clientQuotes.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No quotes for this client yet</p>
                <Link to={createPageUrl('Sales')}>
                  <Button className="mt-3 bg-lime-600 hover:bg-lime-700">Create Quote</Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientQuotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-mono">{quote.quote_number || quote.id.slice(0, 8)}</TableCell>
                      <TableCell>{moment(quote.issue_date || quote.created_date).format('DD MMM YYYY')}</TableCell>
                      <TableCell><Badge className={statusColors[quote.status]}>{quote.status}</Badge></TableCell>
                      <TableCell>{quote.valid_until ? moment(quote.valid_until).format('DD MMM YYYY') : '-'}</TableCell>
                      <TableCell className="text-right font-medium">${(quote.total || 0).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="invoices" className="mt-4">
            {clientInvoices.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <DollarSign className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No invoices for this client yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono">{invoice.invoice_number || invoice.id.slice(0, 8)}</TableCell>
                      <TableCell>{moment(invoice.issue_date || invoice.created_date).format('DD MMM YYYY')}</TableCell>
                      <TableCell><Badge className={statusColors[invoice.status]}>{invoice.status}</Badge></TableCell>
                      <TableCell>{invoice.due_date ? moment(invoice.due_date).format('DD MMM YYYY') : '-'}</TableCell>
                      <TableCell className="text-right font-medium">${(invoice.total || 0).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}