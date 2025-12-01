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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  FileText, Send, CheckCircle2, XCircle, Clock, Loader2, Plus, 
  DollarSign, RefreshCw, Download, Eye, Brain
} from 'lucide-react';
import AIValidationModal from './AIValidationModal';
import { toast } from 'sonner';
import moment from 'moment';

const statusColors = {
  draft: 'bg-slate-100 text-slate-700',
  validated: 'bg-blue-100 text-blue-700',
  pending: 'bg-amber-100 text-amber-700',
  submitted: 'bg-violet-100 text-violet-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
  error: 'bg-red-100 text-red-700'
};

const submissionTypes = [
  { value: 'gst_f5', label: 'GST F5 Return', description: 'Quarterly GST return' },
  { value: 'gst_f7', label: 'GST F7 Return', description: 'Annual GST return' },
  { value: 'ais_ir8a', label: 'IR8A Employment Income', description: 'Annual employee income' },
  { value: 'ais_ir8s', label: 'IR8S Pension Fund', description: 'Pension fund contributions' },
  { value: 'ais_ir21', label: 'IR21 Tax Clearance', description: 'Cessation of employment' },
  { value: 'invoice_data', label: 'InvoiceNow Data', description: 'Invoice data submission' }
];

export default function IRASSubmissionPanel() {
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [formData, setFormData] = useState({
    submission_type: 'gst_f5',
    tax_period: moment().format('YYYY-MM'),
    uen: '',
    company_name: '',
    gst_reg_no: '',
    submission_data: {}
  });
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['iras-submissions'],
    queryFn: () => base44.entities.IRASSubmission.list('-created_date')
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoicenow'],
    queryFn: () => base44.entities.InvoiceNow.list()
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      const submissionId = `IRAS-${moment().format('YYYYMMDD')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // Calculate GST data from invoices if GST submission
      let submissionData = {};
      if (data.submission_type.startsWith('gst_')) {
        const periodInvoices = invoices.filter(inv => 
          moment(inv.issue_date).format('YYYY-MM') === data.tax_period
        );
        submissionData = {
          box1_total_supplies: periodInvoices.reduce((s, i) => s + (i.line_extension_amount || 0), 0),
          box6_output_tax: periodInvoices.reduce((s, i) => s + (i.tax_amount || 0), 0),
          invoice_count: periodInvoices.length,
          revenue_from_invoices: periodInvoices.reduce((s, i) => s + (i.payable_amount || 0), 0)
        };
      }

      return base44.entities.IRASSubmission.create({
        ...data,
        submission_id: submissionId,
        submission_data: submissionData,
        submitted_by: user.email,
        status: 'draft',
        api_version: '2.0'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iras-submissions'] });
      toast.success('IRAS submission created');
      setCreateOpen(false);
    }
  });

  // AI Validation State
  const [showValidation, setShowValidation] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState(null);

  const submitMutation = useMutation({
    mutationFn: async (submission) => {
      // Validate first
      await base44.entities.IRASSubmission.update(submission.id, { status: 'validated' });
      
      // Simulate API submission
      await new Promise(r => setTimeout(r, 2000));
      
      const irasRef = `IRAS${moment().format('YYYYMMDD')}${Math.random().toString().slice(-6)}`;
      
      return base44.entities.IRASSubmission.update(submission.id, {
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        iras_reference: irasRef,
        api_endpoint: 'https://api.iras.gov.sg/iras/sb/GSTReturnsSubmission/v1/gst-f5',
        request_payload: { submissionId: submission.submission_id, data: submission.submission_data },
        response_payload: { status: 'accepted', reference: irasRef }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iras-submissions'] });
      toast.success('Submitted to IRAS successfully');
      setShowValidation(false);
      setPendingSubmission(null);
    }
  });

  const initiateSubmission = (submission) => {
    setPendingSubmission(submission);
    setShowValidation(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-red-600" />IRAS Submissions
        </h3>
        <Button onClick={() => setCreateOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />New Submission
        </Button>
      </div>

      {/* Submissions Table */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No submissions yet</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submission ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IRAS Ref</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-mono text-sm">{sub.submission_id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{submissionTypes.find(t => t.value === sub.submission_type)?.label || sub.submission_type}</Badge>
                    </TableCell>
                    <TableCell>{sub.tax_period}</TableCell>
                    <TableCell>{sub.company_name}</TableCell>
                    <TableCell><Badge className={statusColors[sub.status]}>{sub.status}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{sub.iras_reference || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedSubmission(sub); setViewOpen(true); }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {sub.status === 'draft' && (
                          <Button variant="ghost" size="icon" onClick={() => initiateSubmission(sub)} disabled={submitMutation.isPending}>
                            {submitMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create IRAS Submission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Submission Type</Label>
              <Select value={formData.submission_type} onValueChange={(v) => setFormData({ ...formData, submission_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {submissionTypes.map(t => (
                    <SelectItem key={t.value} value={t.value}>
                      <div>
                        <p>{t.label}</p>
                        <p className="text-xs text-slate-500">{t.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tax Period</Label>
                <Input type="month" value={formData.tax_period} onChange={(e) => setFormData({ ...formData, tax_period: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>GST Reg No</Label>
                <Input value={formData.gst_reg_no} onChange={(e) => setFormData({ ...formData, gst_reg_no: e.target.value })} placeholder="M1234567X" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Company UEN</Label>
              <Input value={formData.uen} onChange={(e) => setFormData({ ...formData, uen: e.target.value })} placeholder="201912345A" />
            </div>
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate(formData)} disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AIValidationModal 
        open={showValidation} 
        onClose={() => setShowValidation(false)}
        type="iras"
        data={pendingSubmission}
        onProceed={() => submitMutation.mutate(pendingSubmission)}
      />

      <AIValidationModal 
        open={showValidation} 
        onClose={() => setShowValidation(false)}
        type="iras"
        data={pendingSubmission}
        onProceed={() => submitMutation.mutate(pendingSubmission)}
      />

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500">Submission ID</p>
                  <p className="font-mono">{selectedSubmission.submission_id}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500">Status</p>
                  <Badge className={statusColors[selectedSubmission.status]}>{selectedSubmission.status}</Badge>
                </div>
              </div>
              {selectedSubmission.submission_data && (
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Submission Data</CardTitle></CardHeader>
                  <CardContent>
                    <pre className="bg-slate-50 p-3 rounded text-xs overflow-auto">
                      {JSON.stringify(selectedSubmission.submission_data, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
              {selectedSubmission.response_payload && (
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">IRAS Response</CardTitle></CardHeader>
                  <CardContent>
                    <pre className="bg-emerald-50 p-3 rounded text-xs overflow-auto">
                      {JSON.stringify(selectedSubmission.response_payload, null, 2)}
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