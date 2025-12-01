import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Globe,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Building2,
  Loader2,
  ExternalLink,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const SMP_STATUS = {
  verified: { label: 'Verified', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: AlertCircle },
  not_found: { label: 'Not Found', color: 'bg-red-100 text-red-700', icon: XCircle },
  error: { label: 'Error', color: 'bg-red-100 text-red-700', icon: XCircle }
};

export default function InvoiceNowCounterparties() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [editingParty, setEditingParty] = useState(null);
  const [lookupId, setLookupId] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  // Fetch counterparties
  const { data: counterparties = [], isLoading } = useQuery({
    queryKey: ['peppol-counterparties'],
    queryFn: () => base44.entities.PeppolCounterparty.list('-created_date', 100),
  });

  // Add counterparty mutation
  const addMutation = useMutation({
    mutationFn: (data) => base44.entities.PeppolCounterparty.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['peppol-counterparties']);
      toast.success('Counterparty added');
      setShowAddModal(false);
      setEditingParty(null);
    },
    onError: () => {
      toast.error('Failed to add counterparty');
    }
  });

  // Update counterparty mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PeppolCounterparty.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['peppol-counterparties']);
      toast.success('Counterparty updated');
      setShowAddModal(false);
      setEditingParty(null);
    }
  });

  // Delete counterparty mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PeppolCounterparty.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['peppol-counterparties']);
      toast.success('Counterparty deleted');
    }
  });

  // Filter counterparties
  const filtered = counterparties.filter(p => {
    const matchesSearch = !searchQuery ||
      p.legal_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.peppol_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.uen?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || p.party_type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Directory lookup simulation
  const handleDirectoryLookup = async () => {
    if (!lookupId.trim()) return;
    
    setIsLookingUp(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock result
    setLookupResult({
      peppolId: lookupId,
      found: true,
      legalName: 'Sample Company Pte Ltd',
      uen: lookupId.replace('0195:', ''),
      capabilities: [
        { documentType: 'Invoice', supported: true },
        { documentType: 'Credit Note', supported: true },
        { documentType: 'Invoice Response', supported: false }
      ],
      endpoint: 'https://ap.example.com/peppol'
    });
    
    setIsLookingUp(false);
  };

  const handleSaveCounterparty = (formData) => {
    const data = {
      ...formData,
      peppol_id: formData.peppol_id || `0195:${formData.uen}`,
      scheme_id: '0195'
    };

    if (editingParty?.id) {
      updateMutation.mutate({ id: editingParty.id, data });
    } else {
      addMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('InvoiceNow')}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Peppol Counterparties</h1>
                <p className="text-sm text-slate-500">Manage your trading partners</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setShowLookupModal(true)}>
                <Globe className="w-4 h-4 mr-2" />
                Directory Lookup
              </Button>
              <Button onClick={() => { setEditingParty(null); setShowAddModal(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Counterparty
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by name, UEN, or Peppol ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="customer">Customers</SelectItem>
                  <SelectItem value="supplier">Suppliers</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Counterparties Table */}
        <Card>
          <CardHeader>
            <CardTitle>Trading Partners ({filtered.length})</CardTitle>
            <CardDescription>
              Organizations you can exchange invoices with via InvoiceNow
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No counterparties found</p>
                <p className="text-sm text-slate-400">Add your first trading partner to get started</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Peppol ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>GST Status</TableHead>
                    <TableHead>Directory Status</TableHead>
                    <TableHead>Capabilities</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((party) => {
                    const smpStatus = SMP_STATUS[party.smp_check_status] || SMP_STATUS.pending;
                    const StatusIcon = smpStatus.icon;
                    
                    return (
                      <TableRow key={party.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                              <p className="font-medium">{party.legal_name}</p>
                              {party.trading_name && party.trading_name !== party.legal_name && (
                                <p className="text-xs text-slate-500">{party.trading_name}</p>
                              )}
                              <p className="text-xs text-slate-400">{party.uen}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                            {party.peppol_id}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {party.party_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {party.gst_registered ? (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Registered
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-slate-500">
                              Not Registered
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={smpStatus.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {smpStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {party.can_receive_invoice && (
                              <Badge variant="outline" className="text-xs">Invoice</Badge>
                            )}
                            {party.can_receive_credit_note && (
                              <Badge variant="outline" className="text-xs">CN</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingParty(party); setShowAddModal(true); }}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setLookupId(party.peppol_id);
                                setShowLookupModal(true);
                              }}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Verify Directory
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="w-4 h-4 mr-2" />
                                View Invoices
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => {
                                  if (confirm('Delete this counterparty?')) {
                                    deleteMutation.mutate(party.id);
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Counterparty Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingParty ? 'Edit Counterparty' : 'Add Counterparty'}</DialogTitle>
            <DialogDescription>
              Enter the organization's Peppol registration details
            </DialogDescription>
          </DialogHeader>
          <CounterpartyForm 
            initialData={editingParty}
            onSubmit={handleSaveCounterparty}
            onCancel={() => setShowAddModal(false)}
            isLoading={addMutation.isLoading || updateMutation.isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Directory Lookup Modal */}
      <Dialog open={showLookupModal} onOpenChange={setShowLookupModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Peppol Directory Lookup</DialogTitle>
            <DialogDescription>
              Check if a Peppol ID is registered and its capabilities
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter Peppol ID (e.g., 0195:T08GB0001A)"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                className="font-mono"
              />
              <Button onClick={handleDirectoryLookup} disabled={isLookingUp}>
                {isLookingUp ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>

            {lookupResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border rounded-lg"
              >
                {lookupResult.found ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-700">Participant Found</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Organization</p>
                      <p className="font-medium">{lookupResult.legalName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">UEN</p>
                      <p className="font-mono">{lookupResult.uen}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-2">Document Capabilities</p>
                      <div className="flex flex-wrap gap-2">
                        {lookupResult.capabilities.map((cap, i) => (
                          <Badge 
                            key={i} 
                            className={cap.supported ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}
                          >
                            {cap.supported ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                            {cap.documentType}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4"
                      onClick={() => {
                        setEditingParty({
                          peppol_id: lookupResult.peppolId,
                          uen: lookupResult.uen,
                          legal_name: lookupResult.legalName,
                          can_receive_invoice: lookupResult.capabilities.find(c => c.documentType === 'Invoice')?.supported,
                          can_receive_credit_note: lookupResult.capabilities.find(c => c.documentType === 'Credit Note')?.supported,
                          smp_check_status: 'verified'
                        });
                        setShowLookupModal(false);
                        setShowAddModal(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add as Counterparty
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="w-5 h-5" />
                    <span>Participant not found in Peppol Directory</span>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CounterpartyForm({ initialData, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState(initialData || {
    legal_name: '',
    trading_name: '',
    uen: '',
    peppol_id: '',
    party_type: 'customer',
    gst_registered: false,
    gst_number: '',
    can_receive_invoice: true,
    can_receive_credit_note: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Legal Name *</Label>
        <Input
          required
          value={formData.legal_name}
          onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label>Trading Name</Label>
        <Input
          value={formData.trading_name || ''}
          onChange={(e) => setFormData({ ...formData, trading_name: e.target.value })}
          className="mt-1"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>UEN *</Label>
          <Input
            required
            value={formData.uen}
            onChange={(e) => setFormData({ ...formData, uen: e.target.value })}
            placeholder="T08GB0001A"
            className="mt-1"
          />
        </div>
        <div>
          <Label>Peppol ID</Label>
          <Input
            value={formData.peppol_id || ''}
            onChange={(e) => setFormData({ ...formData, peppol_id: e.target.value })}
            placeholder="0195:T08GB0001A"
            className="mt-1 font-mono text-sm"
          />
          <p className="text-xs text-slate-500 mt-1">Auto-generated from UEN if empty</p>
        </div>
      </div>
      <div>
        <Label>Party Type</Label>
        <Select 
          value={formData.party_type}
          onValueChange={(value) => setFormData({ ...formData, party_type: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="supplier">Supplier</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="p-4 bg-slate-50 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <Label>GST Registered</Label>
          <Switch
            checked={formData.gst_registered}
            onCheckedChange={(checked) => setFormData({ ...formData, gst_registered: checked })}
          />
        </div>
        {formData.gst_registered && (
          <div>
            <Label>GST Number</Label>
            <Input
              value={formData.gst_number || ''}
              onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
              placeholder="M2-1234567-8"
              className="mt-1"
            />
          </div>
        )}
      </div>
      <div className="p-4 bg-slate-50 rounded-lg space-y-3">
        <p className="text-sm font-medium">Document Capabilities</p>
        <div className="flex items-center justify-between">
          <Label className="text-sm font-normal">Can receive Invoice</Label>
          <Switch
            checked={formData.can_receive_invoice}
            onCheckedChange={(checked) => setFormData({ ...formData, can_receive_invoice: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-sm font-normal">Can receive Credit Note</Label>
          <Switch
            checked={formData.can_receive_credit_note}
            onCheckedChange={(checked) => setFormData({ ...formData, can_receive_credit_note: checked })}
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {initialData?.id ? 'Update' : 'Add'} Counterparty
        </Button>
      </DialogFooter>
    </form>
  );
}