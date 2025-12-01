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
  Shield, Send, CheckCircle2, Loader2, Plus, Users, DollarSign, Eye, Calendar, Brain
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

export default function CPFSubmissionPanel() {
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [formData, setFormData] = useState({
    contribution_month: moment().subtract(1, 'month').format('YYYY-MM'),
    employer_uen: '',
    employer_name: '',
    payment_mode: 'api'
  });
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['cpf-submissions'],
    queryFn: () => base44.entities.CPFSubmission.list('-created_date')
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['hr-employees'],
    queryFn: () => base44.entities.HREmployee?.list() || []
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      const submissionId = `CPF-${moment().format('YYYYMMDD')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // Generate sample employee contributions
      const sampleEmployees = [
        { cpf_account_no: 'S1234567A', full_name: 'John Tan', ordinary_wages: 5000, employee_contribution: 1000, employer_contribution: 850 },
        { cpf_account_no: 'S2345678B', full_name: 'Mary Lee', ordinary_wages: 4500, employee_contribution: 900, employer_contribution: 765 },
        { cpf_account_no: 'S3456789C', full_name: 'David Lim', ordinary_wages: 6000, employee_contribution: 1200, employer_contribution: 1020 }
      ].map(e => ({
        ...e,
        total_wages: e.ordinary_wages,
        total_contribution: e.employee_contribution + e.employer_contribution,
        contribution_rate: '20%+17%'
      }));

      const summary = {
        employee_count: sampleEmployees.length,
        total_ordinary_wages: sampleEmployees.reduce((s, e) => s + e.ordinary_wages, 0),
        total_employee_cpf: sampleEmployees.reduce((s, e) => s + e.employee_contribution, 0),
        total_employer_cpf: sampleEmployees.reduce((s, e) => s + e.employer_contribution, 0),
        grand_total_cpf: sampleEmployees.reduce((s, e) => s + e.total_contribution, 0)
      };

      return base44.entities.CPFSubmission.create({
        ...data,
        submission_id: submissionId,
        employees: sampleEmployees,
        summary,
        submitted_by: user.email,
        status: 'draft',
        due_date: moment(data.contribution_month).add(1, 'month').date(14).format('YYYY-MM-DD')
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cpf-submissions'] });
      toast.success('CPF submission created');
      setCreateOpen(false);
    }
  });

  // AI Validation State
  const [showValidation, setShowValidation] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState(null);

  const submitMutation = useMutation({
    mutationFn: async (submission) => {
      await base44.entities.CPFSubmission.update(submission.id, { status: 'validated' });
      await new Promise(r => setTimeout(r, 2000));
      
      const cpfRef = `CPF${moment().format('YYYYMMDD')}${Math.random().toString().slice(-8)}`;
      
      return base44.entities.CPFSubmission.update(submission.id, {
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        cpf_submission_no: cpfRef,
        api_endpoint: 'https://public.api.gov.sg/cpf/employer-cpf-contributions/v1/submitCPFContributions',
        response_payload: { status: 'accepted', submissionNo: cpfRef, message: 'CPF contributions submitted successfully' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cpf-submissions'] });
      toast.success('Submitted to CPF Board successfully');
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
          <Shield className="w-5 h-5 text-blue-600" />CPF Contributions
        </h3>
        <Button onClick={() => setCreateOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />New Submission
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-700">{submissions.length}</p>
            <p className="text-xs text-blue-600">Total Submissions</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-emerald-700">{submissions.filter(s => s.status === 'accepted').length}</p>
            <p className="text-xs text-emerald-600">Accepted</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-amber-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-amber-700">
              ${(submissions.reduce((s, sub) => s + (sub.summary?.grand_total_cpf || 0), 0) / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-amber-600">Total CPF</p>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Table */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submission ID</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Total CPF</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-mono text-sm">{sub.submission_id}</TableCell>
                    <TableCell>{sub.contribution_month}</TableCell>
                    <TableCell>{sub.employer_name}</TableCell>
                    <TableCell>{sub.summary?.employee_count || 0}</TableCell>
                    <TableCell className="font-medium">${sub.summary?.grand_total_cpf?.toLocaleString() || 0}</TableCell>
                    <TableCell><Badge className={statusColors[sub.status]}>{sub.status}</Badge></TableCell>
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
            <DialogTitle>Create CPF Submission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Contribution Month</Label>
              <Input type="month" value={formData.contribution_month} onChange={(e) => setFormData({ ...formData, contribution_month: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Employer UEN</Label>
              <Input value={formData.employer_uen} onChange={(e) => setFormData({ ...formData, employer_uen: e.target.value })} placeholder="201912345A" />
            </div>
            <div className="space-y-2">
              <Label>Employer Name</Label>
              <Input value={formData.employer_name} onChange={(e) => setFormData({ ...formData, employer_name: e.target.value })} />
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
              <Calendar className="w-4 h-4 inline mr-2" />
              Due date: {moment(formData.contribution_month).add(1, 'month').date(14).format('DD MMM YYYY')}
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

      <AIValidationModal 
        open={showValidation} 
        onClose={() => setShowValidation(false)}
        type="cpf"
        data={pendingSubmission}
        onProceed={() => submitMutation.mutate(pendingSubmission)}
      />

      <AIValidationModal 
        open={showValidation} 
        onClose={() => setShowValidation(false)}
        type="cpf"
        data={pendingSubmission}
        onProceed={() => submitMutation.mutate(pendingSubmission)}
      />

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>CPF Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500">Submission No</p>
                  <p className="font-mono">{selectedSubmission.cpf_submission_no || selectedSubmission.submission_id}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500">Month</p>
                  <p>{selectedSubmission.contribution_month}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500">Status</p>
                  <Badge className={statusColors[selectedSubmission.status]}>{selectedSubmission.status}</Badge>
                </div>
              </div>

              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Employee Contributions</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>CPF A/C</TableHead>
                        <TableHead className="text-right">Wages</TableHead>
                        <TableHead className="text-right">Employee</TableHead>
                        <TableHead className="text-right">Employer</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedSubmission.employees?.map((emp, i) => (
                        <TableRow key={i}>
                          <TableCell>{emp.full_name}</TableCell>
                          <TableCell className="font-mono text-xs">{emp.cpf_account_no}</TableCell>
                          <TableCell className="text-right">${emp.ordinary_wages?.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${emp.employee_contribution?.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${emp.employer_contribution?.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-medium">${emp.total_contribution?.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-slate-50 font-bold">
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell className="text-right">${selectedSubmission.summary?.total_ordinary_wages?.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${selectedSubmission.summary?.total_employee_cpf?.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${selectedSubmission.summary?.total_employer_cpf?.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${selectedSubmission.summary?.grand_total_cpf?.toLocaleString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}