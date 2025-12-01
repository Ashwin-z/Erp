import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Edit, Send, Download, Building2, User, FileText, 
  CheckCircle2, Clock, Globe, Shield, Calendar, DollarSign, CreditCard
} from 'lucide-react';
import PaymentIntegration from './PaymentIntegration';
import ESGInvoicePanel from '@/components/esg/ESGInvoicePanel';
import moment from 'moment';

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700' },
  validated: { label: 'Validated', color: 'bg-blue-100 text-blue-700' },
  pending_transmission: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  transmitted: { label: 'Transmitted', color: 'bg-violet-100 text-violet-700' },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700' },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-700' },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelled', color: 'bg-slate-100 text-slate-500' }
};

const taxCategoryLabels = {
  SR: 'Standard Rate (9%)',
  ZR: 'Zero Rate',
  ES: 'Exempt',
  OS: 'Out of Scope',
  NG: 'Not GST Registered'
};

export default function InvoiceNowDetailModal({ open, onClose, invoice, onEdit }) {
  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Invoice {invoice.invoice_number}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={statusConfig[invoice.status]?.color}>
                  {statusConfig[invoice.status]?.label}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  UBL 2.1 / SG Peppol BIS 3.0
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />Export UBL XML
              </Button>
              {invoice.status === 'draft' && (
                <Button variant="outline" size="sm" onClick={() => { onClose(); onEdit(invoice); }}>
                  <Edit className="w-4 h-4 mr-2" />Edit
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="parties">Parties</TabsTrigger>
            <TabsTrigger value="items">Line Items</TabsTrigger>
            <TabsTrigger value="peppol">Peppol Status</TabsTrigger>
            {invoice.status !== 'paid' && <TabsTrigger value="payment">Payment</TabsTrigger>}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            <ESGInvoicePanel invoice={invoice} />
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Issue Date</p>
                      <p className="font-medium">{moment(invoice.issue_date).format('DD MMM YYYY')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Due Date</p>
                      <p className="font-medium">{moment(invoice.due_date).format('DD MMM YYYY')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-slate-500">Total Amount</p>
                      <p className="font-bold text-lg text-blue-600">${invoice.payable_amount?.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <Card className="border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Invoice Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Invoice Type:</span>
                      <span>{invoice.invoice_type_code === '380' ? 'Commercial Invoice' : invoice.invoice_type_code}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Currency:</span>
                      <span>{invoice.document_currency_code}</span>
                    </div>
                    {invoice.buyer_reference && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Buyer Reference:</span>
                        <span>{invoice.buyer_reference}</span>
                      </div>
                    )}
                    {invoice.order_reference && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Order Reference:</span>
                        <span>{invoice.order_reference}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 border-l pl-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Subtotal:</span>
                      <span>${invoice.line_extension_amount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">GST:</span>
                      <span>${invoice.tax_amount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total Payable:</span>
                      <span>${invoice.payable_amount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {invoice.note && (
              <Card className="border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">{invoice.note}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Parties Tab */}
          <TabsContent value="parties" className="mt-4">
            <div className="grid grid-cols-2 gap-6">
              {/* Seller */}
              <Card className="border-slate-200">
                <CardHeader className="pb-2 bg-slate-50">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="w-4 h-4" />Seller (Supplier)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-2 text-sm">
                  <p className="font-semibold text-lg">{invoice.seller?.name}</p>
                  <div className="space-y-1 text-slate-600">
                    <p><span className="text-slate-500">UEN:</span> {invoice.seller?.uen}</p>
                    <p><span className="text-slate-500">Peppol ID:</span> {invoice.seller?.peppol_id}</p>
                    {invoice.seller?.gst_reg_no && (
                      <p><span className="text-slate-500">GST No:</span> {invoice.seller.gst_reg_no}</p>
                    )}
                    <div className="pt-2">
                      <p>{invoice.seller?.street}</p>
                      <p>{invoice.seller?.city} {invoice.seller?.postal_code}</p>
                      <p>{invoice.seller?.country_code}</p>
                    </div>
                    {invoice.seller?.contact_email && (
                      <p className="pt-2">{invoice.seller.contact_email}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Buyer */}
              <Card className="border-slate-200">
                <CardHeader className="pb-2 bg-slate-50">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="w-4 h-4" />Buyer (Customer)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-2 text-sm">
                  <p className="font-semibold text-lg">{invoice.buyer?.name}</p>
                  <div className="space-y-1 text-slate-600">
                    <p><span className="text-slate-500">UEN:</span> {invoice.buyer?.uen}</p>
                    <p><span className="text-slate-500">Peppol ID:</span> {invoice.buyer?.peppol_id}</p>
                    {invoice.buyer?.gst_reg_no && (
                      <p><span className="text-slate-500">GST No:</span> {invoice.buyer.gst_reg_no}</p>
                    )}
                    <div className="pt-2">
                      <p>{invoice.buyer?.street}</p>
                      <p>{invoice.buyer?.city} {invoice.buyer?.postal_code}</p>
                      <p>{invoice.buyer?.country_code}</p>
                    </div>
                    {invoice.buyer?.contact_email && (
                      <p className="pt-2">{invoice.buyer.contact_email}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Items Tab */}
          <TabsContent value="items" className="mt-4">
            <Card className="border-slate-200">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-center">Unit</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead>Tax Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-slate-500">{item.line_id || index + 1}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.name || item.description}</p>
                            {item.name && item.description && (
                              <p className="text-sm text-slate-500">{item.description}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-center">{item.unit_code}</TableCell>
                        <TableCell className="text-right">${item.unit_price?.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {taxCategoryLabels[item.tax_category] || item.tax_category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${((item.quantity || 0) * (item.unit_price || 0)).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Peppol Status Tab */}
          <TabsContent value="peppol" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />Peppol Network Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Status:</span>
                    <Badge className={
                      invoice.peppol_status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                      invoice.peppol_status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      invoice.peppol_status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-600'
                    }>
                      {invoice.peppol_status?.replace('_', ' ')}
                    </Badge>
                  </div>
                  {invoice.peppol_transmission_date && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Transmitted:</span>
                      <span>{moment(invoice.peppol_transmission_date).format('DD MMM YYYY HH:mm')}</span>
                    </div>
                  )}
                  {invoice.peppol_delivery_date && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Delivered:</span>
                      <span>{moment(invoice.peppol_delivery_date).format('DD MMM YYYY HH:mm')}</span>
                    </div>
                  )}
                  {invoice.peppol_document_id && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Document ID:</span>
                      <span className="font-mono text-xs">{invoice.peppol_document_id}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-4 h-4 text-violet-600" />IRAS GST Submission
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Status:</span>
                    <Badge className={
                      invoice.iras_status === 'accepted' ? 'bg-green-100 text-green-700' :
                      invoice.iras_status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                      invoice.iras_status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      invoice.iras_status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-600'
                    }>
                      {invoice.iras_status?.replace('_', ' ')}
                    </Badge>
                  </div>
                  {invoice.iras_submission_date && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Submitted:</span>
                      <span>{moment(invoice.iras_submission_date).format('DD MMM YYYY HH:mm')}</span>
                    </div>
                  )}
                  <p className="text-xs text-slate-500 pt-2">
                    GST InvoiceNow Requirement: Invoice data is automatically transmitted to IRAS for GST-registered businesses.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Technical Info */}
            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Peppol Technical Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">UBL Version:</span>
                    <span className="ml-2 font-mono">{invoice.ubl_version || '2.1'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Customization ID:</span>
                    <span className="ml-2 font-mono text-xs break-all">{invoice.customization_id || 'SG Peppol BIS 3.0'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Seller Peppol ID:</span>
                    <span className="ml-2 font-mono">{invoice.seller?.peppol_id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Buyer Peppol ID:</span>
                    <span className="ml-2 font-mono">{invoice.buyer?.peppol_id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {invoice.status !== 'paid' && (
            <TabsContent value="payment" className="mt-4">
              <PaymentIntegration invoice={invoice} onClose={onClose} />
            </TabsContent>
          )}
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}