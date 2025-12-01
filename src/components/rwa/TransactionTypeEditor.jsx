import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, Pencil, Trash2, Copy, Save, X, FileText, Target, CreditCard,
  Wallet, Shield, TrendingUp, AlertTriangle, CheckCircle2, Info,
  Calculator, Eye, RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

const defaultIcons = {
  invoice_paid: FileText,
  invoice_submission: FileText,
  ad_spend: Target,
  loan_disbursement: CreditCard,
  payroll_processing: Wallet,
  esg_report: Shield,
  funding_contribution: TrendingUp
};

const defaultColors = {
  invoice_paid: 'text-emerald-400',
  invoice_submission: 'text-blue-400',
  ad_spend: 'text-violet-400',
  loan_disbursement: 'text-cyan-400',
  payroll_processing: 'text-amber-400',
  esg_report: 'text-green-400',
  funding_contribution: 'text-pink-400'
};

export default function TransactionTypeEditor({ 
  transactionSettings, 
  setTransactionSettings, 
  setHasChanges 
}) {
  const [editModal, setEditModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [viewDetails, setViewDetails] = useState(null);

  const [formData, setFormData] = useState({
    key: '',
    label: '',
    enabled: true,
    rvuPerDollar: 1.0,
    minAmount: 0,
    maxAmount: null,
    capPerTransaction: null,
    payoutPercent: 100,
    payoutType: 'percentage',
    fixedPayout: 0,
    description: '',
    notes: ''
  });

  const transactionTypes = [
    { key: 'invoice_paid', label: 'Invoice Paid' },
    { key: 'invoice_submission', label: 'Invoice Submission' },
    { key: 'ad_spend', label: 'Ad Spend' },
    { key: 'loan_disbursement', label: 'Loan Disbursement' },
    { key: 'payroll_processing', label: 'Payroll Processing' },
    { key: 'esg_report', label: 'ESG Report' },
    { key: 'funding_contribution', label: 'Funding Contribution' }
  ];

  // Sample transaction data for each type
  const sampleTransactions = {
    invoice_paid: [
      { id: 'INV-001', company: 'TechStart Pte Ltd', amount: 25000, date: '2024-11-25' },
      { id: 'INV-002', company: 'Marina Foods', amount: 12500, date: '2024-11-24' },
      { id: 'INV-003', company: 'Global Logistics', amount: 45000, date: '2024-11-23' }
    ],
    invoice_submission: [
      { id: 'SUB-001', company: 'Urban Retail', amount: 8500, date: '2024-11-26' },
      { id: 'SUB-002', company: 'Skyline Properties', amount: 32000, date: '2024-11-25' }
    ],
    ad_spend: [
      { id: 'AD-001', company: 'TechStart Pte Ltd', amount: 5000, date: '2024-11-26' },
      { id: 'AD-002', company: 'Marina Foods', amount: 2500, date: '2024-11-25' }
    ],
    loan_disbursement: [
      { id: 'LOAN-001', company: 'Urban Retail', amount: 150000, date: '2024-11-20' }
    ],
    payroll_processing: [
      { id: 'PAY-001', company: 'TechStart Pte Ltd', amount: 85000, date: '2024-11-25' },
      { id: 'PAY-002', company: 'Global Logistics', amount: 125000, date: '2024-11-25' }
    ],
    esg_report: [
      { id: 'ESG-001', company: 'Marina Foods', amount: 0, date: '2024-11-15' }
    ],
    funding_contribution: [
      { id: 'FUND-001', company: 'Skyline Properties', amount: 50000, date: '2024-11-22' }
    ]
  };

  const openEdit = (key) => {
    const settings = transactionSettings[key];
    const type = transactionTypes.find(t => t.key === key);
    setFormData({
      key,
      label: type?.label || key,
      ...settings,
      description: settings.description || '',
      notes: settings.notes || ''
    });
    setEditModal(key);
  };

  const openCreate = () => {
    setFormData({
      key: '',
      label: '',
      enabled: true,
      rvuPerDollar: 1.0,
      minAmount: 0,
      maxAmount: null,
      capPerTransaction: null,
      payoutPercent: 100,
      payoutType: 'percentage',
      fixedPayout: 0,
      description: '',
      notes: ''
    });
    setCreateModal(true);
  };

  const handleSave = () => {
    const { key, label, ...settings } = formData;
    setTransactionSettings(prev => ({
      ...prev,
      [key]: settings
    }));
    setHasChanges(true);
    setEditModal(null);
    setCreateModal(false);
    toast.success(`${label || key} settings saved`);
  };

  const handleDelete = (key) => {
    setTransactionSettings(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
    setHasChanges(true);
    setDeleteConfirm(null);
    toast.success('Transaction type deleted');
  };

  const handleDuplicate = (key) => {
    const settings = transactionSettings[key];
    const newKey = `${key}_copy`;
    setTransactionSettings(prev => ({
      ...prev,
      [newKey]: { ...settings }
    }));
    setHasChanges(true);
    toast.success('Transaction type duplicated');
  };

  const handleReset = (key) => {
    const defaults = {
      invoice_paid: { enabled: true, rvuPerDollar: 1.0, minAmount: 0, maxAmount: null, capPerTransaction: 10000, payoutPercent: 100, payoutType: 'percentage', fixedPayout: 0 },
      invoice_submission: { enabled: true, rvuPerDollar: 0.25, minAmount: 100, maxAmount: null, capPerTransaction: 2500, payoutPercent: 100, payoutType: 'percentage', fixedPayout: 0 },
      ad_spend: { enabled: true, rvuPerDollar: 0.5, minAmount: 50, maxAmount: null, capPerTransaction: 5000, payoutPercent: 80, payoutType: 'percentage', fixedPayout: 0 },
      loan_disbursement: { enabled: true, rvuPerDollar: 0.2, minAmount: 1000, maxAmount: 500000, capPerTransaction: 100000, payoutPercent: 100, payoutType: 'percentage', fixedPayout: 0 },
      payroll_processing: { enabled: true, rvuPerDollar: 0.1, minAmount: 500, maxAmount: null, capPerTransaction: 5000, payoutPercent: 100, payoutType: 'percentage', fixedPayout: 0 },
      esg_report: { enabled: true, rvuPerDollar: 0, minAmount: 0, maxAmount: null, capPerTransaction: null, payoutPercent: 100, payoutType: 'fixed', fixedPayout: 50 },
      funding_contribution: { enabled: true, rvuPerDollar: 0.3, minAmount: 1000, maxAmount: null, capPerTransaction: 50000, payoutPercent: 100, payoutType: 'percentage', fixedPayout: 0 }
    };
    if (defaults[key]) {
      setTransactionSettings(prev => ({
        ...prev,
        [key]: defaults[key]
      }));
      setHasChanges(true);
      toast.success('Reset to default settings');
    }
  };

  const calculateSamplePayout = (key, amount) => {
    const settings = transactionSettings[key];
    if (!settings || !settings.enabled) return { rvu: 0, payout: 0 };
    
    let effectiveAmount = amount;
    if (settings.maxAmount && amount > settings.maxAmount) effectiveAmount = settings.maxAmount;
    
    let rvu;
    if (settings.payoutType === 'fixed') {
      rvu = settings.fixedPayout;
    } else {
      rvu = effectiveAmount * settings.rvuPerDollar;
      if (settings.capPerTransaction && rvu > settings.capPerTransaction) {
        rvu = settings.capPerTransaction;
      }
    }
    
    const payout = rvu * 0.08 * (settings.payoutPercent / 100);
    return { rvu, payout };
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">Transaction Type Rules</h3>
          <p className="text-slate-500 text-sm">Configure RVU rates, caps, and payout percentages for each transaction type</p>
        </div>
        <Button onClick={openCreate} className="bg-lime-500 hover:bg-lime-400 text-slate-900">
          <Plus className="w-4 h-4 mr-2" />
          Add Type
        </Button>
      </div>

      {/* Transaction Type Cards */}
      {transactionTypes.map((type) => {
        const settings = transactionSettings[type.key];
        if (!settings) return null;
        
        const Icon = defaultIcons[type.key] || FileText;
        const colorClass = defaultColors[type.key] || 'text-slate-400';
        const samples = sampleTransactions[type.key] || [];

        return (
          <Card key={type.key} className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${colorClass}`} />
                  </div>
                  <div>
                    <span>{type.label}</span>
                    {!settings.enabled && (
                      <Badge className="ml-2 bg-slate-700 text-slate-400">Disabled</Badge>
                    )}
                  </div>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-400 hover:text-white"
                    onClick={() => setViewDetails(viewDetails === type.key ? null : type.key)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-400 hover:text-white"
                    onClick={() => handleReset(type.key)}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-400 hover:text-white"
                    onClick={() => handleDuplicate(type.key)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-400 hover:text-blue-300"
                    onClick={() => openEdit(type.key)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-400 hover:text-red-300"
                    onClick={() => setDeleteConfirm(type.key)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Switch 
                    checked={settings.enabled} 
                    onCheckedChange={(c) => {
                      setTransactionSettings(prev => ({
                        ...prev,
                        [type.key]: { ...prev[type.key], enabled: c }
                      }));
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-5 gap-4 mb-4">
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-slate-500 text-xs">RVU Rate</p>
                  <p className="text-white font-bold">
                    {settings.payoutType === 'fixed' ? `${settings.fixedPayout} fixed` : `${settings.rvuPerDollar} / $1`}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-slate-500 text-xs">Min Amount</p>
                  <p className="text-white font-bold">${settings.minAmount?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-slate-500 text-xs">Max Amount</p>
                  <p className="text-white font-bold">{settings.maxAmount ? `$${settings.maxAmount.toLocaleString()}` : 'No limit'}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-slate-500 text-xs">RVU Cap</p>
                  <p className="text-white font-bold">{settings.capPerTransaction?.toLocaleString() || 'No cap'}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-slate-500 text-xs">Payout</p>
                  <p className="text-lime-400 font-bold">{settings.payoutPercent}%</p>
                </div>
              </div>

              {/* Expanded Details with Sample Transactions */}
              {viewDetails === type.key && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-slate-400 text-sm mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Sample Transactions & Computed Payouts
                  </p>
                  <div className="space-y-2">
                    {samples.map((sample) => {
                      const { rvu, payout } = calculateSamplePayout(type.key, sample.amount);
                      return (
                        <div key={sample.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                          <div className="flex items-center gap-4">
                            <span className="text-cyan-400 font-mono text-sm">{sample.id}</span>
                            <span className="text-white">{sample.company}</span>
                            <span className="text-slate-400">{sample.date}</span>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-slate-500 text-xs">Amount</p>
                              <p className="text-white font-medium">${sample.amount.toLocaleString()}</p>
                            </div>
                            <div className="text-slate-600">→</div>
                            <div className="text-right">
                              <p className="text-slate-500 text-xs">RVU</p>
                              <p className="text-cyan-400 font-medium">{rvu.toLocaleString()}</p>
                            </div>
                            <div className="text-slate-600">→</div>
                            <div className="text-right">
                              <p className="text-slate-500 text-xs">Payout</p>
                              <p className="text-lime-400 font-bold">${payout.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Computation Formula */}
                  <div className="mt-4 p-4 bg-slate-800/30 rounded-lg">
                    <p className="text-slate-400 text-xs mb-2 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Computation Formula
                    </p>
                    <div className="text-slate-300 text-sm font-mono">
                      {settings.payoutType === 'fixed' ? (
                        <span>RVU = {settings.fixedPayout} (fixed) × Tier Multiplier</span>
                      ) : (
                        <span>RVU = min(Amount × {settings.rvuPerDollar}, {settings.capPerTransaction || '∞'}) × Tier Multiplier</span>
                      )}
                      <br />
                      <span>Payout = RVU × $0.08 × {settings.payoutPercent}%</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Edit Modal */}
      <Dialog open={!!editModal} onOpenChange={() => setEditModal(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="w-5 h-5 text-blue-400" />
              Edit {formData.label}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400">RVU Rate (per $1)</Label>
                <Input
                  type="number"
                  step="0.01"
                  className="bg-slate-800 border-slate-700"
                  value={formData.rvuPerDollar}
                  onChange={(e) => setFormData(prev => ({ ...prev, rvuPerDollar: parseFloat(e.target.value) || 0 }))}
                  disabled={formData.payoutType === 'fixed'}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Payout Type</Label>
                <Select 
                  value={formData.payoutType} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, payoutType: v }))}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="percentage">Percentage of RVU</SelectItem>
                    <SelectItem value="fixed">Fixed RVU Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400">Min Transaction Amount ($)</Label>
                <Input
                  type="number"
                  className="bg-slate-800 border-slate-700"
                  value={formData.minAmount || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, minAmount: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Max Transaction Amount ($)</Label>
                <Input
                  type="number"
                  placeholder="No limit"
                  className="bg-slate-800 border-slate-700"
                  value={formData.maxAmount || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxAmount: parseFloat(e.target.value) || null }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400">RVU Cap per Transaction</Label>
                <Input
                  type="number"
                  placeholder="No cap"
                  className="bg-slate-800 border-slate-700"
                  value={formData.capPerTransaction || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, capPerTransaction: parseFloat(e.target.value) || null }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">
                  {formData.payoutType === 'fixed' ? 'Fixed RVU Amount' : 'Payout Percentage'}
                </Label>
                <Input
                  type="number"
                  className="bg-slate-800 border-slate-700"
                  value={formData.payoutType === 'fixed' ? formData.fixedPayout : formData.payoutPercent}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    [formData.payoutType === 'fixed' ? 'fixedPayout' : 'payoutPercent']: parseFloat(e.target.value) || 0 
                  }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400">Notes (internal)</Label>
              <Textarea
                placeholder="Add internal notes about this transaction type..."
                className="bg-slate-800 border-slate-700"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white">Enabled</p>
                <p className="text-slate-500 text-sm">Allow this transaction type to earn RVUs</p>
              </div>
              <Switch 
                checked={formData.enabled} 
                onCheckedChange={(c) => setFormData(prev => ({ ...prev, enabled: c }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-slate-700" onClick={() => setEditModal(null)}>
              Cancel
            </Button>
            <Button className="bg-lime-500 hover:bg-lime-400 text-slate-900" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Confirm Delete
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-300">
            Are you sure you want to delete this transaction type? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" className="border-slate-700" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button className="bg-red-500 hover:bg-red-400" onClick={() => handleDelete(deleteConfirm)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}