import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Settings, ArrowLeft, Coins, Users, Gift,
  Save, RefreshCw, FileText, CreditCard, Target, Zap,
  TrendingUp, Wallet, Shield, Calculator
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TransactionTypeEditor from '@/components/rwa/TransactionTypeEditor';
import PayoutSimulator from '@/components/rwa/PayoutSimulator';
import { toast } from 'sonner';

export default function RWASettings() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [hasChanges, setHasChanges] = useState(false);

  // Transaction Type Settings
  const [transactionSettings, setTransactionSettings] = useState({
    invoice_paid: {
      enabled: true,
      rvuPerDollar: 1.0,
      minAmount: 0,
      maxAmount: null,
      capPerTransaction: 10000,
      payoutPercent: 100,
      payoutType: 'percentage',
      fixedPayout: 0
    },
    invoice_submission: {
      enabled: true,
      rvuPerDollar: 0.25,
      minAmount: 100,
      maxAmount: null,
      capPerTransaction: 2500,
      payoutPercent: 100,
      payoutType: 'percentage',
      fixedPayout: 0
    },
    ad_spend: {
      enabled: true,
      rvuPerDollar: 0.5,
      minAmount: 50,
      maxAmount: null,
      capPerTransaction: 5000,
      payoutPercent: 80,
      payoutType: 'percentage',
      fixedPayout: 0
    },
    loan_disbursement: {
      enabled: true,
      rvuPerDollar: 0.2,
      minAmount: 1000,
      maxAmount: 500000,
      capPerTransaction: 100000,
      payoutPercent: 100,
      payoutType: 'percentage',
      fixedPayout: 0
    },
    payroll_processing: {
      enabled: true,
      rvuPerDollar: 0.1,
      minAmount: 500,
      maxAmount: null,
      capPerTransaction: 5000,
      payoutPercent: 100,
      payoutType: 'percentage',
      fixedPayout: 0
    },
    esg_report: {
      enabled: true,
      rvuPerDollar: 0,
      minAmount: 0,
      maxAmount: null,
      capPerTransaction: null,
      payoutPercent: 100,
      payoutType: 'fixed',
      fixedPayout: 50
    },
    funding_contribution: {
      enabled: true,
      rvuPerDollar: 0.3,
      minAmount: 1000,
      maxAmount: null,
      capPerTransaction: 50000,
      payoutPercent: 100,
      payoutType: 'percentage',
      fixedPayout: 0
    }
  });

  // Referral Settings
  const [referralSettings, setReferralSettings] = useState({
    enabled: true,
    level1: { rvuBonus: 200, payoutPercent: 100, payoutType: 'fixed', fixedPayout: 200 },
    level2: { rvuBonus: 50, payoutPercent: 50, payoutType: 'fixed', fixedPayout: 50 },
    level3: { rvuBonus: 10, payoutPercent: 25, payoutType: 'fixed', fixedPayout: 10 },
    ongoingCommission: 2.0,
    qualificationRequired: true,
    qualificationCriteria: { kycComplete: true, firstTransaction: true, minDays: 30 }
  });

  // Tier Multiplier Settings
  const [tierSettings, setTierSettings] = useState({
    starter: { multiplier: 1.0, payoutPercent: 100 },
    growth: { multiplier: 1.2, payoutPercent: 100 },
    scale: { multiplier: 1.5, payoutPercent: 100 },
    enterprise: { multiplier: 2.0, payoutPercent: 100 },
    mnc: { multiplier: 2.5, payoutPercent: 100 }
  });

  // Pool Distribution Settings
  const [poolSettings, setPoolSettings] = useState({
    platformRevenuePercent: 10,
    minRvuForPayout: 10,
    maxPayoutPercent: 25,
    distributionFrequency: 'monthly',
    autoDistribute: true,
    requireApproval: true,
    approvalThreshold: 10000
  });

  // Promotion Settings
  const [promotionSettings, setPromotionSettings] = useState({
    enabled: false,
    bonusMultiplier: 1.5,
    startDate: '',
    endDate: '',
    applicableTypes: ['invoice_paid', 'ad_spend'],
    maxBonusCap: 5000
  });

  const updateTransaction = (type, field, value) => {
    setTransactionSettings(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    toast.success('RWA settings saved successfully');
    setHasChanges(false);
  };

  const transactionTypes = [
    { key: 'invoice_paid', label: 'Invoice Paid', icon: FileText, color: 'text-emerald-400' },
    { key: 'invoice_submission', label: 'Invoice Submission', icon: FileText, color: 'text-blue-400' },
    { key: 'ad_spend', label: 'Ad Spend', icon: Target, color: 'text-violet-400' },
    { key: 'loan_disbursement', label: 'Loan Disbursement', icon: CreditCard, color: 'text-cyan-400' },
    { key: 'payroll_processing', label: 'Payroll Processing', icon: Wallet, color: 'text-amber-400' },
    { key: 'esg_report', label: 'ESG Report', icon: Shield, color: 'text-green-400' },
    { key: 'funding_contribution', label: 'Funding Contribution', icon: TrendingUp, color: 'text-pink-400' }
  ];

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Link to={createPageUrl('RWADashboard')}>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    RWA Settings
                  </h1>
                  <p className="text-slate-400 mt-1">Configure payouts, percentages, and transaction rules</p>
                </div>
              </div>
              <div className="flex gap-3">
                {hasChanges && (
                  <Badge className="bg-amber-500/20 text-amber-400">Unsaved Changes</Badge>
                )}
                <Button variant="outline" className="border-slate-700 text-slate-300">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset to Default
                </Button>
                <Button className="bg-gradient-to-r from-lime-500 to-emerald-500 text-slate-900" onClick={saveSettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </div>

            <Tabs defaultValue="transactions">
              <TabsList className="bg-slate-800/50 border-slate-700 mb-6">
                <TabsTrigger value="transactions">
                  <Coins className="w-4 h-4 mr-2" />
                  Transaction Types
                </TabsTrigger>
                <TabsTrigger value="referrals">
                  <Users className="w-4 h-4 mr-2" />
                  Referrals
                </TabsTrigger>
                <TabsTrigger value="tiers">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Tier Multipliers
                </TabsTrigger>
                <TabsTrigger value="pool">
                  <Gift className="w-4 h-4 mr-2" />
                  Pool Distribution
                </TabsTrigger>
                <TabsTrigger value="promotions">
                  <Zap className="w-4 h-4 mr-2" />
                  Promotions
                </TabsTrigger>
                <TabsTrigger value="simulator">
                  <Calculator className="w-4 h-4 mr-2" />
                  Simulator
                </TabsTrigger>
              </TabsList>

              {/* Transaction Types Tab */}
              <TabsContent value="transactions">
                <TransactionTypeEditor 
                  transactionSettings={transactionSettings}
                  setTransactionSettings={setTransactionSettings}
                  setHasChanges={setHasChanges}
                />
              </TabsContent>

              {/* Referrals Tab */}
              <TabsContent value="referrals">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">Referral Program</CardTitle>
                        <Switch 
                          checked={referralSettings.enabled} 
                          onCheckedChange={(c) => { setReferralSettings(prev => ({ ...prev, enabled: c })); setHasChanges(true); }}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Level 1 */}
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-pink-500/20 text-pink-400">Level 1</Badge>
                          <span className="text-slate-400 text-sm">Direct Referral</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-slate-400">RVU Bonus</Label>
                            <Input
                              type="number"
                              className="bg-slate-700 border-slate-600"
                              value={referralSettings.level1.rvuBonus}
                              onChange={(e) => {
                                setReferralSettings(prev => ({ ...prev, level1: { ...prev.level1, rvuBonus: parseFloat(e.target.value) } }));
                                setHasChanges(true);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-400">Payout ($)</Label>
                            <Input
                              type="number"
                              className="bg-slate-700 border-slate-600"
                              value={referralSettings.level1.fixedPayout}
                              onChange={(e) => {
                                setReferralSettings(prev => ({ ...prev, level1: { ...prev.level1, fixedPayout: parseFloat(e.target.value) } }));
                                setHasChanges(true);
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Level 2 */}
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-violet-500/20 text-violet-400">Level 2</Badge>
                          <span className="text-slate-400 text-sm">Second Tier</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-slate-400">RVU Bonus</Label>
                            <Input
                              type="number"
                              className="bg-slate-700 border-slate-600"
                              value={referralSettings.level2.rvuBonus}
                              onChange={(e) => {
                                setReferralSettings(prev => ({ ...prev, level2: { ...prev.level2, rvuBonus: parseFloat(e.target.value) } }));
                                setHasChanges(true);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-400">Payout ($)</Label>
                            <Input
                              type="number"
                              className="bg-slate-700 border-slate-600"
                              value={referralSettings.level2.fixedPayout}
                              onChange={(e) => {
                                setReferralSettings(prev => ({ ...prev, level2: { ...prev.level2, fixedPayout: parseFloat(e.target.value) } }));
                                setHasChanges(true);
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Level 3 */}
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-cyan-500/20 text-cyan-400">Level 3</Badge>
                          <span className="text-slate-400 text-sm">Third Tier</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-slate-400">RVU Bonus</Label>
                            <Input
                              type="number"
                              className="bg-slate-700 border-slate-600"
                              value={referralSettings.level3.rvuBonus}
                              onChange={(e) => {
                                setReferralSettings(prev => ({ ...prev, level3: { ...prev.level3, rvuBonus: parseFloat(e.target.value) } }));
                                setHasChanges(true);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-400">Payout ($)</Label>
                            <Input
                              type="number"
                              className="bg-slate-700 border-slate-600"
                              value={referralSettings.level3.fixedPayout}
                              onChange={(e) => {
                                setReferralSettings(prev => ({ ...prev, level3: { ...prev.level3, fixedPayout: parseFloat(e.target.value) } }));
                                setHasChanges(true);
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Ongoing Commission */}
                      <div className="space-y-2">
                        <Label className="text-slate-400">Ongoing Commission (%)</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            value={[referralSettings.ongoingCommission]}
                            onValueChange={([v]) => { setReferralSettings(prev => ({ ...prev, ongoingCommission: v })); setHasChanges(true); }}
                            max={10}
                            step={0.1}
                            className="flex-1"
                          />
                          <span className="text-white font-medium w-16">{referralSettings.ongoingCommission}%</span>
                        </div>
                        <p className="text-slate-500 text-xs">Percentage of referred member's RVU earnings</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-white">Qualification Criteria</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div>
                          <p className="text-white">Require Qualification</p>
                          <p className="text-slate-500 text-sm">Referral must meet criteria before bonus</p>
                        </div>
                        <Switch 
                          checked={referralSettings.qualificationRequired}
                          onCheckedChange={(c) => { setReferralSettings(prev => ({ ...prev, qualificationRequired: c })); setHasChanges(true); }}
                        />
                      </div>

                      {referralSettings.qualificationRequired && (
                        <>
                          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                            <span className="text-slate-300">KYC Complete</span>
                            <Switch 
                              checked={referralSettings.qualificationCriteria.kycComplete}
                              onCheckedChange={(c) => { 
                                setReferralSettings(prev => ({ 
                                  ...prev, 
                                  qualificationCriteria: { ...prev.qualificationCriteria, kycComplete: c } 
                                })); 
                                setHasChanges(true); 
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                            <span className="text-slate-300">First Transaction Complete</span>
                            <Switch 
                              checked={referralSettings.qualificationCriteria.firstTransaction}
                              onCheckedChange={(c) => { 
                                setReferralSettings(prev => ({ 
                                  ...prev, 
                                  qualificationCriteria: { ...prev.qualificationCriteria, firstTransaction: c } 
                                })); 
                                setHasChanges(true); 
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-400">Minimum Days Active</Label>
                            <Input
                              type="number"
                              className="bg-slate-800 border-slate-700"
                              value={referralSettings.qualificationCriteria.minDays}
                              onChange={(e) => { 
                                setReferralSettings(prev => ({ 
                                  ...prev, 
                                  qualificationCriteria: { ...prev.qualificationCriteria, minDays: parseInt(e.target.value) } 
                                })); 
                                setHasChanges(true); 
                              }}
                            />
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Tiers Tab */}
              <TabsContent value="tiers">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Membership Tier Multipliers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(tierSettings).map(([tier, settings]) => (
                        <div key={tier} className="flex items-center gap-6 p-4 bg-slate-800/50 rounded-lg">
                          <div className="w-32">
                            <Badge className={`capitalize ${
                              tier === 'starter' ? 'bg-slate-600' :
                              tier === 'growth' ? 'bg-blue-500/20 text-blue-400' :
                              tier === 'scale' ? 'bg-violet-500/20 text-violet-400' :
                              tier === 'enterprise' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {tier}
                            </Badge>
                          </div>
                          <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label className="text-slate-400 text-xs">RVU Multiplier</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  step="0.1"
                                  className="bg-slate-700 border-slate-600"
                                  value={settings.multiplier}
                                  onChange={(e) => {
                                    setTierSettings(prev => ({
                                      ...prev,
                                      [tier]: { ...prev[tier], multiplier: parseFloat(e.target.value) }
                                    }));
                                    setHasChanges(true);
                                  }}
                                />
                                <span className="text-slate-500">x</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-slate-400 text-xs">Payout %</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  className="bg-slate-700 border-slate-600"
                                  value={settings.payoutPercent}
                                  onChange={(e) => {
                                    setTierSettings(prev => ({
                                      ...prev,
                                      [tier]: { ...prev[tier], payoutPercent: parseFloat(e.target.value) }
                                    }));
                                    setHasChanges(true);
                                  }}
                                />
                                <span className="text-slate-500">%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pool Distribution Tab */}
              <TabsContent value="pool">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-white">Pool Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-slate-400">Platform Revenue Contribution (%)</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            value={[poolSettings.platformRevenuePercent]}
                            onValueChange={([v]) => { setPoolSettings(prev => ({ ...prev, platformRevenuePercent: v })); setHasChanges(true); }}
                            max={30}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-white font-medium w-16">{poolSettings.platformRevenuePercent}%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-400">Minimum RVU for Payout</Label>
                        <Input
                          type="number"
                          className="bg-slate-800 border-slate-700"
                          value={poolSettings.minRvuForPayout}
                          onChange={(e) => { setPoolSettings(prev => ({ ...prev, minRvuForPayout: parseInt(e.target.value) })); setHasChanges(true); }}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-400">Max Payout % (of pool)</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            value={[poolSettings.maxPayoutPercent]}
                            onValueChange={([v]) => { setPoolSettings(prev => ({ ...prev, maxPayoutPercent: v })); setHasChanges(true); }}
                            max={100}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-white font-medium w-16">{poolSettings.maxPayoutPercent}%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-400">Distribution Frequency</Label>
                        <Select 
                          value={poolSettings.distributionFrequency} 
                          onValueChange={(v) => { setPoolSettings(prev => ({ ...prev, distributionFrequency: v })); setHasChanges(true); }}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-white">Approval Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div>
                          <p className="text-white">Auto-Distribute</p>
                          <p className="text-slate-500 text-sm">Automatically distribute at period end</p>
                        </div>
                        <Switch 
                          checked={poolSettings.autoDistribute}
                          onCheckedChange={(c) => { setPoolSettings(prev => ({ ...prev, autoDistribute: c })); setHasChanges(true); }}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div>
                          <p className="text-white">Require Approval</p>
                          <p className="text-slate-500 text-sm">Manual approval for large distributions</p>
                        </div>
                        <Switch 
                          checked={poolSettings.requireApproval}
                          onCheckedChange={(c) => { setPoolSettings(prev => ({ ...prev, requireApproval: c })); setHasChanges(true); }}
                        />
                      </div>

                      {poolSettings.requireApproval && (
                        <div className="space-y-2">
                          <Label className="text-slate-400">Approval Threshold ($)</Label>
                          <Input
                            type="number"
                            className="bg-slate-800 border-slate-700"
                            value={poolSettings.approvalThreshold}
                            onChange={(e) => { setPoolSettings(prev => ({ ...prev, approvalThreshold: parseInt(e.target.value) })); setHasChanges(true); }}
                          />
                          <p className="text-slate-500 text-xs">Distributions above this amount require approval</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Promotions Tab */}
              <TabsContent value="promotions">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-400" />
                        Promotional Bonus
                      </CardTitle>
                      <Switch 
                        checked={promotionSettings.enabled}
                        onCheckedChange={(c) => { setPromotionSettings(prev => ({ ...prev, enabled: c })); setHasChanges(true); }}
                      />
                    </div>
                  </CardHeader>
                  {promotionSettings.enabled && (
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-400">Bonus Multiplier</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              step="0.1"
                              className="bg-slate-800 border-slate-700"
                              value={promotionSettings.bonusMultiplier}
                              onChange={(e) => { setPromotionSettings(prev => ({ ...prev, bonusMultiplier: parseFloat(e.target.value) })); setHasChanges(true); }}
                            />
                            <span className="text-slate-500">x</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-400">Start Date</Label>
                          <Input
                            type="date"
                            className="bg-slate-800 border-slate-700"
                            value={promotionSettings.startDate}
                            onChange={(e) => { setPromotionSettings(prev => ({ ...prev, startDate: e.target.value })); setHasChanges(true); }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-400">End Date</Label>
                          <Input
                            type="date"
                            className="bg-slate-800 border-slate-700"
                            value={promotionSettings.endDate}
                            onChange={(e) => { setPromotionSettings(prev => ({ ...prev, endDate: e.target.value })); setHasChanges(true); }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-400">Max Bonus Cap per Member ($)</Label>
                        <Input
                          type="number"
                          className="bg-slate-800 border-slate-700 w-48"
                          value={promotionSettings.maxBonusCap}
                          onChange={(e) => { setPromotionSettings(prev => ({ ...prev, maxBonusCap: parseInt(e.target.value) })); setHasChanges(true); }}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-400">Applicable Transaction Types</Label>
                        <div className="flex flex-wrap gap-2">
                          {transactionTypes.map((type) => (
                            <Badge
                              key={type.key}
                              className={`cursor-pointer ${
                                promotionSettings.applicableTypes.includes(type.key)
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-slate-700 text-slate-300'
                              }`}
                              onClick={() => {
                                const current = promotionSettings.applicableTypes;
                                const updated = current.includes(type.key)
                                  ? current.filter(t => t !== type.key)
                                  : [...current, type.key];
                                setPromotionSettings(prev => ({ ...prev, applicableTypes: updated }));
                                setHasChanges(true);
                              }}
                            >
                              {type.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </TabsContent>

              {/* Simulator Tab */}
              <TabsContent value="simulator">
                <PayoutSimulator 
                  transactionSettings={transactionSettings}
                  tierSettings={tierSettings}
                  promotionSettings={promotionSettings}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}