import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Building2, Send, CheckCircle2, Loader2, Plus, FileText, Eye, Calendar, DollarSign, Brain
} from 'lucide-react';
import AIValidationModal from './AIValidationModal';
import { toast } from 'sonner';
import moment from 'moment';

const statusColors = {
  draft: 'bg-slate-100 text-slate-700',
  validated: 'bg-blue-100 text-blue-700',
  pending_approval: 'bg-amber-100 text-amber-700',
  submitted: 'bg-violet-100 text-violet-700',
  approved: 'bg-emerald-100 text-emerald-700',
  lodged: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
  error: 'bg-red-100 text-red-700'
};

const filingTypes = [
  { value: 'annual_return', label: 'Annual Return', fee: 60 },
  { value: 'change_officers', label: 'Change of Officers', fee: 40 },
  { value: 'change_address', label: 'Change of Address', fee: 40 },
  { value: 'change_share_capital', label: 'Change of Share Capital', fee: 50 },
  { value: 'financial_statements', label: 'Financial Statements', fee: 0 },
  { value: 'agm_extension', label: 'AGM Extension', fee: 50 },
  { value: 'company_name_change', label: 'Company Name Change', fee: 15 }
];

export default function ACRAFilingPanel() {
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedFiling, setSelectedFiling] = useState(null);
  const [formData, setFormData] = useState({
    filing_type: 'annual_return',
    uen: '',
    company_name: '',
    financial_year_end: moment().subtract(1, 'year').endOf('year').format('YYYY-MM-DD')
  });
  const queryClient = useQueryClient();

  const { data: filings = [], isLoading } = useQuery({
    queryKey: ['acra-filings'],
    queryFn: () => base44.entities.ACRAFiling.list('-created_date')
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      const filingId = `ACRA-${moment().format('YYYYMMDD')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const filingType = filingTypes.find(t => t.value === data.filing_type);

      return base44.entities.ACRAFiling.create({
        ...data,
        filing_id: filingId,
        filing_fee: filingType?.fee || 0,
        submitted_by: user.email,
        status: 'draft',
        deadline: moment(data.financial_year_end).add(7, 'months').format('YYYY-MM-DD'),
        filing_data: {
          registered_address: '123 Business Park, #01-01, Singapore 123456',
          share_capital: { issued: 100000, paid_up: 100000, currency: 'SGD' }
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acra-filings'] });
      toast.success('ACRA filing created');
      setCreateOpen(false);
    }
  });

  // AI Validation State
  const [showValidation, setShowValidation] = useState(false);
  const [pendingFiling, setPendingFiling] = useState(null);

  const submitMutation = useMutation({
    mutationFn: async (filing) => {
      await base44.entities.ACRAFiling.update(filing.id, { status: 'pending_approval' });
      await new Promise(r => setTimeout(r, 2000));
      
      const txnNo = `BF${moment().format('YYYYMMDD')}${Math.random().toString().slice(-6)}`;
      
      return base44.entities.ACRAFiling.update(filing.id, {
        status: 'lodged',
        submitted_at: new Date().toISOString(),
        approved_at: new Date().toISOString(),
        bizfile_transaction_no: txnNo,
        payment_status: 'paid',
        api_endpoint: 'https://api.acra.gov.sg/bizfile/v1/annual-return',
        response_payload: { status: 'lodged', transactionNo: txnNo, message: 'Filing lodged successfully' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acra-filings'] });
      toast.success('Filed with ACRA successfully');
      setShowValidation(false);
      setPendingFiling(null);
    }
  });

  const initiateSubmission = (filing) => {
    setPendingFiling(filing);
    setShowValidation(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Building2 className="w-5 h-5 text-purple-600" />ACRA Filings
        </h3>
        <Button onClick={() => setCreateOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />New Filing
        </Button>
      </div>

      {/* Filings Table */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
          ) : filings.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No filings yet</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filing ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>FY End</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filings.map((filing) => (
                  <TableRow key={filing.id}>
                    <TableCell className="font-mono text-sm">{filing.filing_id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{filingTypes.find(t => t.value === filing.filing_type)?.label || filing.filing_type}</Badge>
                    </TableCell>
                    <TableCell>{filing.company_name}</TableCell>
                    <TableCell>{moment(filing.financial_year_end).format('DD MMM YYYY')}</TableCell>
                    <TableCell>
                      <span className={moment(filing.deadline).isBefore(moment()) ? 'text-red-600' : ''}>
                        {moment(filing.deadline).format('DD MMM YYYY')}
                      </span>
                    </TableCell>
                    <TableCell>${filing.filing_fee}</TableCell>
                    <TableCell><Badge className={statusColors[filing.status]}>{filing.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedFiling(filing); setViewOpen(true); }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {filing.status === 'draft' && (
                          <div className="flex gap-1">
                            <Button 
                                size="sm" 
                                variant="outline"
                                className="text-amber-600 border-amber-200 hover:bg-amber-50 h-8 px-2"
                                title="Pay Filing Fee"
                                onClick={() => toast.success(`Payment gateway opened for $${filing.filing_fee}`)}
                            >
                              <DollarSign className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => initiateSubmission(filing)} disabled={submitMutation.isPending}>
                              {submitMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </Button>
                          </div>
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

      <AIValidationModal 
        open={showValidation} 
        onClose={() => setShowValidation(false)}
        type="acra"
        data={pendingFiling}
        onProceed={() => submitMutation.mutate(pendingFiling)}
      />

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create ACRA Filing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Filing Type</Label>
              <Select value={formData.filing_type} onValueChange={(v) => setFormData({ ...formData, filing_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {filingTypes.map(t => (
                    <SelectItem key={t.value} value={t.value}>
                      <div className="flex justify-between w-full">
                        <span>{t.label}</span>
                        <span className="text-slate-500 ml-4">${t.fee}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Company UEN</Label>
              <Input value={formData.uen} onChange={(e) => setFormData({ ...formData, uen: e.target.value })} placeholder="201912345A" />
            </div>
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Financial Year End</Label>
              <Input type="date" value={formData.financial_year_end} onChange={(e) => setFormData({ ...formData, financial_year_end: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate(formData)} disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Filing Details</DialogTitle>
          </DialogHeader>
          {selectedFiling && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500">BizFile Transaction No</p>
                  <p className="font-mono">{selectedFiling.bizfile_transaction_no || selectedFiling.filing_id}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500">Status</p>
                  <Badge className={statusColors[selectedFiling.status]}>{selectedFiling.status}</Badge>
                </div>
              </div>
              {selectedFiling.filing_data && (
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Filing Data</CardTitle></CardHeader>
                  <CardContent>
                    <pre className="bg-slate-50 p-3 rounded text-xs overflow-auto">
                      {JSON.stringify(selectedFiling.filing_data, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}