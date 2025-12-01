import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Search, Eye, Edit, Send, CheckCircle, XCircle, 
  Copy, FileText, Clock, Trash2, MoreHorizontal, Receipt, Loader2
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import moment from 'moment';
import { toast } from 'sonner';
import SendQuoteModal from './SendQuoteModal';
import CreateInvoiceModal from './CreateInvoiceModal';

const statusColors = {
  draft: 'bg-slate-100 text-slate-700',
  sent: 'bg-blue-100 text-blue-700',
  viewed: 'bg-purple-100 text-purple-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  expired: 'bg-amber-100 text-amber-700'
};

export default function QuotationList({ onView, onEdit, onConvert, onSend }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sendModalQuote, setSendModalQuote] = useState(null);
  const [invoiceModalQuote, setInvoiceModalQuote] = useState(null);
  const queryClient = useQueryClient();

  const { data: dbQuotations = [], isLoading } = useQuery({
    queryKey: ['quotations'],
    queryFn: () => base44.entities.Quotation.list('-created_date')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Quotation.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      toast.success('Quotation deleted');
    }
  });

  // Sample data for fallback
  const sampleQuotations = [
    { id: 'sample-1', quote_number: 'QT-2024-089', customer_name: 'TechStart Pte Ltd', customer_email: 'john@techstart.com', issue_date: '2024-12-20', valid_until: '2025-01-20', subtotal: 18500, discount_total: 1850, tax_amount: 1499.85, total: 18149.85, status: 'sent', items: [{description: 'Item 1', quantity: 1, unit_price: 5000}, {description: 'Item 2', quantity: 2, unit_price: 3000}] },
    { id: 'sample-2', quote_number: 'QT-2024-088', customer_name: 'Marina Foods', customer_email: 'sarah@marinafoods.com', issue_date: '2024-12-19', valid_until: '2025-01-19', subtotal: 32000, discount_total: 0, tax_amount: 2880, total: 34880, status: 'accepted', items: [{description: 'Service Package', quantity: 1, unit_price: 32000}] },
    { id: 'sample-3', quote_number: 'QT-2024-087', customer_name: 'Global Logistics SG', customer_email: 'mike@globallog.sg', issue_date: '2024-12-18', valid_until: '2025-01-18', subtotal: 9500, discount_total: 475, tax_amount: 812.25, total: 9837.25, status: 'viewed', items: [{description: 'Consulting', quantity: 10, unit_price: 950}] },
  ];

  const quotations = dbQuotations.length > 0 ? dbQuotations : sampleQuotations;

  const filteredQuotations = quotations.filter(q => {
    const customerName = q.customer_name || q.customer || '';
    const quoteNum = q.quote_number || q.id || '';
    const matchSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        quoteNum.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || q.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const isExpiringSoon = (validUntil) => {
    const daysUntil = moment(validUntil).diff(moment(), 'days');
    return daysUntil <= 7 && daysUntil >= 0;
  };

  return (
    <Card>
      <CardContent className="p-0">
        {/* Filters */}
        <div className="p-4 border-b flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search quotations..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="viewed">Viewed</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : (
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
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotations.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-mono font-medium">{quote.quote_number || quote.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{quote.customer_name || quote.customer}</p>
                      <p className="text-xs text-slate-500">{quote.customer_email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{moment(quote.issue_date || quote.date || quote.created_date).format('DD MMM YYYY')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {moment(quote.valid_until).format('DD MMM YYYY')}
                      {isExpiringSoon(quote.valid_until) && quote.status !== 'expired' && quote.status !== 'accepted' && quote.status !== 'rejected' && (
                        <Badge className="bg-amber-100 text-amber-700 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          Expiring
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{quote.items?.length || 0} items</TableCell>
                  <TableCell className="font-medium">${(quote.total || 0).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[quote.status] || statusColors.draft}>{quote.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onView && onView(quote)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {quote.status === 'draft' && (
                        <Button variant="ghost" size="icon" onClick={() => onEdit && onEdit(quote)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {(quote.status === 'draft' || quote.status === 'sent') && (
                            <DropdownMenuItem onClick={() => setSendModalQuote(quote)}>
                              <Send className="w-4 h-4 mr-2" /> Send to Customer
                            </DropdownMenuItem>
                          )}
                          {(quote.status === 'sent' || quote.status === 'viewed') && (
                            <DropdownMenuItem onClick={() => setInvoiceModalQuote(quote)}>
                              <Receipt className="w-4 h-4 mr-2 text-green-600" /> Create Invoice
                            </DropdownMenuItem>
                          )}
                          {quote.status === 'accepted' && (
                            <DropdownMenuItem onClick={() => onConvert && onConvert(quote)}>
                              <CheckCircle className="w-4 h-4 mr-2" /> Convert to Order
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="w-4 h-4 mr-2" /> Download PDF
                          </DropdownMenuItem>
                          {quote.status === 'draft' && !quote.id.startsWith('sample') && (
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => deleteMutation.mutate(quote.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Send Quote Modal */}
      <SendQuoteModal
        open={!!sendModalQuote}
        onClose={() => setSendModalQuote(null)}
        quotation={sendModalQuote}
        onSent={() => {
          queryClient.invalidateQueries({ queryKey: ['quotations'] });
          setSendModalQuote(null);
        }}
      />

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        open={!!invoiceModalQuote}
        onClose={() => setInvoiceModalQuote(null)}
        quotation={invoiceModalQuote}
        onCreated={() => setInvoiceModalQuote(null)}
      />
    </Card>
  );
}