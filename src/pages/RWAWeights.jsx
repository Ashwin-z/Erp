import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  BarChart3, ArrowLeft, Save, RefreshCw, Calculator, Zap, FileText,
  Target, Users, CreditCard, Leaf, Coins, TrendingUp, Star, Rocket,
  Building2, Crown, Info, AlertTriangle, CheckCircle2
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { toast } from 'sonner';

const defaultWeights = {
  invoice_paid: { weight: 1.0, unit: 'per SGD1 invoiced', enabled: true, cap: null },
  invoice_submission: { weight: 0.25, unit: 'per SGD1', enabled: true, cap: 500 },
  ad_spend: { weight: 0.5, unit: 'per SGD1 spent', enabled: true, cap: null },
  referral_signup: { weight: 200, unit: 'one-off RVU', enabled: true, cap: null },
  loan_disbursement: { weight: 0.2, unit: 'per SGD1 disbursed', enabled: true, cap: null },
  payroll_processing: { weight: 0.1, unit: 'per SGD1 processed', enabled: true, cap: null },
  esg_report_submission: { weight: 50, unit: 'per validated report', enabled: true, cap: null },
  funding_contribution: { weight: 0.3, unit: 'per SGD1 contributed', enabled: true, cap: null },
};

const tierMultipliers = {
  starter: { name: 'Starter', multiplier: 1.0, icon: Star, color: 'from-slate-400 to-slate-500' },
  growth: { name: 'Growth', multiplier: 1.2, icon: Zap, color: 'from-blue-400 to-blue-500' },
  scale: { name: 'Scale', multiplier: 1.5, icon: Rocket, color: 'from-violet-400 to-violet-500' },
  enterprise: { name: 'Enterprise', multiplier: 2.0, icon: Building2, color: 'from-amber-400 to-amber-500' },
  mnc: { name: 'MNC', multiplier: 2.5, icon: Crown, color: 'from-lime-400 to-emerald-500' },
};

const referralBonuses = {
  level_1: 200,
  level_2: 50,
  level_3: 10,
  ongoing_rate: 0.02,
};

const activityIcons = {
  invoice_paid: { icon: FileText, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  invoice_submission: { icon: FileText, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  ad_spend: { icon: Target, color: 'text-violet-400', bgColor: 'bg-violet-500/20' },
  referral_signup: { icon: Users, color: 'text-pink-400', bgColor: 'bg-pink-500/20' },
  loan_disbursement: { icon: CreditCard, color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
  payroll_processing: { icon: Coins, color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  esg_report_submission: { icon: Leaf, color: 'text-green-400', bgColor: 'bg-green-500/20' },
  funding_contribution: { icon: TrendingUp, color: 'text-rose-400', bgColor: 'bg-rose-500/20' },
};

const activityLabels = {
  invoice_paid: 'Invoice Paid',
  invoice_submission: 'Invoice Submission (OCR)',
  ad_spend: 'Ad Spend',
  referral_signup: 'Referral Signup',
  loan_disbursement: 'Loan Disbursement',
  payroll_processing: 'Payroll Processing',
  esg_report_submission: 'ESG Report Submission',
  funding_contribution: 'Cloud Funding Contribution',
};

export default function RWAWeights() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [weights, setWeights] = useState(defaultWeights);
  const [tiers, setTiers] = useState(tierMultipliers);
  const [referrals, setReferrals] = useState(referralBonuses);
  const [hasChanges, setHasChanges] = useState(false);

  // Simulation
  const [simAmount, setSimAmount] = useState(1000);
  const [simActivity, setSimActivity] = useState('invoice_paid');
  const [simTier, setSimTier] = useState('growth');

  const updateWeight = (activity, field, value) => {
    setWeights(prev => ({
      ...prev,
      [activity]: { ...prev[activity], [field]: value }
    }));
    setHasChanges(true);
  };

  const updateTier = (tier, multiplier) => {
    setTiers(prev => ({
      ...prev,
      [tier]: { ...prev[tier], multiplier }
    }));
    setHasChanges(true);
  };

  const calculateRVU = () => {
    const activityWeight = weights[simActivity]?.weight || 0;
    const tierMultiplier = tiers[simTier]?.multiplier || 1;
    
    if (simActivity === 'referral_signup' || simActivity === 'esg_report_submission') {
      return activityWeight * tierMultiplier;
    }
    return simAmount * activityWeight * tierMultiplier;
  };

  const handleSave = () => {
    toast.success('RVU weights configuration saved');
    setHasChanges(false);
  };

  const handleReset = () => {
    setWeights(defaultWeights);
    setTiers(tierMultipliers);
    setReferrals(referralBonuses);
    setHasChanges(false);
    toast.info('Configuration reset to defaults');
  };

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
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    RVU Weight Configuration
                  </h1>
                  <p className="text-slate-400 mt-1">Configure activity weights, tier multipliers, and referral bonuses</p>
                </div>
              </div>
              <div className="flex gap-3">
                {hasChanges && (
                  <Badge className="bg-amber-500/20 text-amber-400 px-3 py-1">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Unsaved Changes
                  </Badge>
                )}
                <Button variant="outline" className="border-slate-700 text-slate-300" onClick={handleReset}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400"
                  onClick={handleSave}
                  disabled={!hasChanges}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Activity Weights */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-lime-400" />
                      Activity Weights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(weights).map(([activity, config]) => {
                      const activityInfo = activityIcons[activity];
                      const ActivityIcon = activityInfo.icon;
                      return (
                        <motion.div
                          key={activity}
                          className="bg-slate-800/50 rounded-xl p-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg ${activityInfo.bgColor} flex items-center justify-center`}>
                                <ActivityIcon className={`w-5 h-5 ${activityInfo.color}`} />
                              </div>
                              <div>
                                <p className="text-white font-medium">{activityLabels[activity]}</p>
                                <p className="text-slate-500 text-xs">{config.unit}</p>
                              </div>
                            </div>
                            <Switch
                              checked={config.enabled}
                              onCheckedChange={(checked) => updateWeight(activity, 'enabled', checked)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-slate-400 text-xs">Weight</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={config.weight}
                                onChange={(e) => updateWeight(activity, 'weight', parseFloat(e.target.value) || 0)}
                                className="bg-slate-700 border-slate-600 text-white mt-1"
                                disabled={!config.enabled}
                              />
                            </div>
                            <div>
                              <Label className="text-slate-400 text-xs">Cap per Transaction</Label>
                              <Input
                                type="number"
                                placeholder="No cap"
                                value={config.cap || ''}
                                onChange={(e) => updateWeight(activity, 'cap', e.target.value ? parseInt(e.target.value) : null)}
                                className="bg-slate-700 border-slate-600 text-white mt-1"
                                disabled={!config.enabled}
                              />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Tier Multipliers */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-400" />
                      Tier Multipliers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-4">
                      {Object.entries(tiers).map(([key, tier]) => {
                        const TierIcon = tier.icon;
                        return (
                          <div key={key} className="bg-slate-800/50 rounded-xl p-4 text-center">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mx-auto mb-3`}>
                              <TierIcon className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-white font-medium mb-2">{tier.name}</p>
                            <Input
                              type="number"
                              step="0.1"
                              value={tier.multiplier}
                              onChange={(e) => updateTier(key, parseFloat(e.target.value) || 1)}
                              className="bg-slate-700 border-slate-600 text-white text-center"
                            />
                            <p className="text-slate-500 text-xs mt-1">x multiplier</p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Referral Bonuses */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-pink-400" />
                      Referral Bonuses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-slate-800/50 rounded-xl p-4">
                        <Label className="text-slate-400 text-xs">Level 1 (Direct)</Label>
                        <Input
                          type="number"
                          value={referrals.level_1}
                          onChange={(e) => { setReferrals(r => ({ ...r, level_1: parseInt(e.target.value) || 0 })); setHasChanges(true); }}
                          className="bg-slate-700 border-slate-600 text-white mt-1"
                        />
                        <p className="text-slate-500 text-xs mt-1">RVU one-off</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-xl p-4">
                        <Label className="text-slate-400 text-xs">Level 2</Label>
                        <Input
                          type="number"
                          value={referrals.level_2}
                          onChange={(e) => { setReferrals(r => ({ ...r, level_2: parseInt(e.target.value) || 0 })); setHasChanges(true); }}
                          className="bg-slate-700 border-slate-600 text-white mt-1"
                        />
                        <p className="text-slate-500 text-xs mt-1">RVU one-off</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-xl p-4">
                        <Label className="text-slate-400 text-xs">Level 3</Label>
                        <Input
                          type="number"
                          value={referrals.level_3}
                          onChange={(e) => { setReferrals(r => ({ ...r, level_3: parseInt(e.target.value) || 0 })); setHasChanges(true); }}
                          className="bg-slate-700 border-slate-600 text-white mt-1"
                        />
                        <p className="text-slate-500 text-xs mt-1">RVU one-off</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-xl p-4">
                        <Label className="text-slate-400 text-xs">Ongoing Rate</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={referrals.ongoing_rate * 100}
                          onChange={(e) => { setReferrals(r => ({ ...r, ongoing_rate: (parseFloat(e.target.value) || 0) / 100 })); setHasChanges(true); }}
                          className="bg-slate-700 border-slate-600 text-white mt-1"
                        />
                        <p className="text-slate-500 text-xs mt-1">% of referral RVU</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Simulator */}
              <div>
                <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/30 sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-violet-400" />
                      RVU Simulator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-slate-400">Activity Type</Label>
                      <select
                        value={simActivity}
                        onChange={(e) => setSimActivity(e.target.value)}
                        className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                      >
                        {Object.entries(activityLabels).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-slate-400">Transaction Amount (SGD)</Label>
                      <Input
                        type="number"
                        value={simAmount}
                        onChange={(e) => setSimAmount(parseFloat(e.target.value) || 0)}
                        className="bg-slate-800 border-slate-700 text-white mt-1"
                        disabled={simActivity === 'referral_signup' || simActivity === 'esg_report_submission'}
                      />
                    </div>
                    <div>
                      <Label className="text-slate-400">Membership Tier</Label>
                      <select
                        value={simTier}
                        onChange={(e) => setSimTier(e.target.value)}
                        className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                      >
                        {Object.entries(tiers).map(([key, tier]) => (
                          <option key={key} value={key}>{tier.name} ({tier.multiplier}x)</option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-slate-800/50 rounded-xl p-4 mt-4">
                      <p className="text-slate-400 text-sm mb-1">Calculation</p>
                      <div className="text-xs text-slate-500 space-y-1">
                        {simActivity === 'referral_signup' || simActivity === 'esg_report_submission' ? (
                          <p>{weights[simActivity]?.weight} × {tiers[simTier]?.multiplier}x</p>
                        ) : (
                          <p>${simAmount} × {weights[simActivity]?.weight} × {tiers[simTier]?.multiplier}x</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-xl p-6 text-center">
                      <p className="text-slate-400 text-sm mb-2">RVU Generated</p>
                      <p className="text-4xl font-bold text-violet-400">{calculateRVU().toFixed(2)}</p>
                      <p className="text-slate-500 text-xs mt-2">
                        ≈ ${(calculateRVU() * 0.08).toFixed(2)} at current RVU value
                      </p>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-3 flex items-start gap-2">
                      <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                      <p className="text-slate-400 text-xs">
                        RVU value fluctuates based on pool size and total RVUs. Current estimate: $0.08 per RVU.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}