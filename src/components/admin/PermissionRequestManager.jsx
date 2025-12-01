import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Inbox, Check, X, MessageSquare, Clock, ChevronDown, Eye, 
  AlertCircle, CheckCircle2, XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PRESETS = [
  { id: 'full', label: 'Full Access', permissions: { create: true, read: true, update: true, delete: true } },
  { id: 'read', label: 'Read Only', permissions: { create: false, read: true, update: false, delete: false } },
  { id: 'limited', label: 'Limited', permissions: { create: true, read: true, update: false, delete: false } },
  { id: 'custom', label: 'As Requested', permissions: null }
];

const sampleRequests = [
  {
    id: 'r1',
    requester_email: 'john@arkfinex.com',
    requester_name: 'John Smith',
    feature_name: 'Invoices',
    feature_key: 'sales.invoice',
    department: 'Sales',
    requested_actions: { create: true, read: true, update: true, delete: false },
    justification: 'Need to create invoices for new clients',
    status: 'pending',
    created_date: '2025-01-25T10:30:00'
  },
  {
    id: 'r2',
    requester_email: 'sarah@arkfinex.com',
    requester_name: 'Sarah Chen',
    feature_name: 'Budgets',
    feature_key: 'finance.budget',
    department: 'Finance',
    requested_actions: { create: false, read: true, update: false, delete: false, export: true },
    justification: 'Need to view and export budget reports for quarterly review',
    status: 'pending',
    created_date: '2025-01-24T14:15:00'
  },
  {
    id: 'r3',
    requester_email: 'mike@arkfinex.com',
    requester_name: 'Mike Johnson',
    feature_name: 'Leave Management',
    feature_key: 'hr.leave',
    department: 'HR',
    requested_actions: { create: true, read: true, update: true, delete: true, approve: true },
    justification: 'Promoted to team lead, need to approve team leaves',
    status: 'pending',
    created_date: '2025-01-23T09:00:00'
  }
];

export default function PermissionRequestManager({ tenantId }) {
  const [requests, setRequests] = useState(sampleRequests);
  const [filter, setFilter] = useState('pending');
  const [reviewModal, setReviewModal] = useState({ open: false, request: null, action: null });
  const [comment, setComment] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('custom');
  const [notifyUser, setNotifyUser] = useState(true);

  const filteredRequests = requests.filter(r => filter === 'all' || r.status === filter);

  const handleReview = (request, action) => {
    setReviewModal({ open: true, request, action });
    setComment('');
    setSelectedPreset('custom');
  };

  const confirmReview = async () => {
    const { request, action } = reviewModal;
    const preset = PRESETS.find(p => p.id === selectedPreset);
    const finalPermissions = preset?.permissions || request.requested_actions;

    // Update request
    setRequests(prev => prev.map(r =>
      r.id === request.id
        ? { ...r, status: action === 'approve' ? 'approved' : 'denied', review_comment: comment }
        : r
    ));

    // If approved, create permission
    if (action === 'approve') {
      await base44.entities.Permission.create({
        tenant_id: tenantId,
        subject_type: 'user',
        subject_id: request.requester_email,
        feature_key: request.feature_key,
        ...finalPermissions,
        granted_by: 'current_user@example.com',
        granted_at: new Date().toISOString()
      });
    }

    // Create audit log
    await base44.entities.PermissionAudit.create({
      tenant_id: tenantId,
      actor_email: 'current_user@example.com',
      action_type: action === 'approve' ? 'approve' : 'deny',
      target_type: 'user',
      target_id: request.requester_email,
      target_name: request.requester_name,
      feature_key: request.feature_key,
      new_state: action === 'approve' ? finalPermissions : null,
      reason: comment || `${action === 'approve' ? 'Approved' : 'Denied'} permission request`
    });

    setReviewModal({ open: false, request: null, action: null });
    toast.success(`Request ${action === 'approve' ? 'approved' : 'denied'}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'denied':
        return <Badge className="bg-red-100 text-red-700"><XCircle className="w-3 h-3 mr-1" />Denied</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Inbox className="w-5 h-5 text-blue-600" />
            Permission Requests
            {requests.filter(r => r.status === 'pending').length > 0 && (
              <Badge className="bg-blue-500">{requests.filter(r => r.status === 'pending').length}</Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {['pending', 'approved', 'denied', 'all'].map(f => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
                className={filter === f ? 'bg-slate-900' : ''}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requester</TableHead>
                <TableHead>Feature</TableHead>
                <TableHead>Requested Access</TableHead>
                <TableHead>Justification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map(request => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{request.requester_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{request.requester_name}</p>
                        <p className="text-xs text-slate-500">{request.department}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-sm">{request.feature_name}</p>
                    <p className="text-xs text-slate-500">{request.feature_key}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {request.requested_actions.create && <Badge variant="outline" className="text-[10px]">C</Badge>}
                      {request.requested_actions.read && <Badge variant="outline" className="text-[10px]">R</Badge>}
                      {request.requested_actions.update && <Badge variant="outline" className="text-[10px]">U</Badge>}
                      {request.requested_actions.delete && <Badge variant="outline" className="text-[10px]">D</Badge>}
                      {request.requested_actions.export && <Badge variant="outline" className="text-[10px]">Export</Badge>}
                      {request.requested_actions.approve && <Badge variant="outline" className="text-[10px]">Approve</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-slate-600 max-w-xs truncate">{request.justification}</p>
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    {request.status === 'pending' ? (
                      <div className="flex gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Check className="w-3 h-3 mr-1" />
                              Approve
                              <ChevronDown className="w-3 h-3 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {PRESETS.map(preset => (
                              <DropdownMenuItem 
                                key={preset.id}
                                onClick={() => {
                                  setSelectedPreset(preset.id);
                                  handleReview(request, 'approve');
                                }}
                              >
                                {preset.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200"
                          onClick={() => handleReview(request, 'deny')}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Modal */}
      <Dialog open={reviewModal.open} onOpenChange={() => setReviewModal({ open: false, request: null, action: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${reviewModal.action === 'approve' ? 'text-green-600' : 'text-red-600'}`}>
              {reviewModal.action === 'approve' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              {reviewModal.action === 'approve' ? 'Approve' : 'Deny'} Request
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="font-medium">{reviewModal.request?.requester_name}</p>
              <p className="text-sm text-slate-500">Requesting access to: {reviewModal.request?.feature_name}</p>
            </div>

            {reviewModal.action === 'approve' && (
              <div>
                <p className="text-sm font-medium mb-2">Grant Access Level</p>
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map(preset => (
                    <div
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset.id)}
                      className={`p-2 border rounded-lg cursor-pointer text-center text-sm ${
                        selectedPreset === preset.id ? 'border-green-500 bg-green-50' : 'hover:border-slate-300'
                      }`}
                    >
                      {preset.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-medium mb-2">Comment (Optional)</p>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a note..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewModal({ open: false, request: null, action: null })}>
              Cancel
            </Button>
            <Button
              className={reviewModal.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              onClick={confirmReview}
            >
              {reviewModal.action === 'approve' ? 'Approve & Grant' : 'Deny Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}