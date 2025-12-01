import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Users, ArrowLeft, Plus, Search, CheckCircle2, Clock, Crown,
  Star, Zap, Rocket, Building2, Upload, FileText, Eye, Edit,
  TrendingUp, Gift, Shield, Award
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { toast } from 'sonner';

const tierConfig = {
  starter: { name: 'Starter', icon: Star, color: 'from-slate-400 to-slate-500', fee: 99, multiplier: 1.0, maxUsers: 5 },
  growth: { name: 'Growth', icon: Zap, color: 'from-blue-400 to-blue-500', fee: 299, multiplier: 1.2, maxUsers: 15 },
  scale: { name: 'Scale', icon: Rocket, color: 'from-violet-400 to-violet-500', fee: 599, multiplier: 1.5, maxUsers: 50 },
  enterprise: { name: 'Enterprise', icon: Building2, color: 'from-amber-400 to-amber-500', fee: 1499, multiplier: 2.0, maxUsers: 200 },
  mnc: { name: 'MNC', icon: Crown, color: 'from-lime-400 to-emerald-500', fee: 4999, multiplier: 2.5, maxUsers: 999 },
};

const sampleMemberships = [
  { id: 'MEM-001', company: 'TechStart Pte Ltd', uen: '202312345A', tier: 'growth', status: 'active', rvuEarned: 4523, joinedDate: '2024-01-15', renewalDate: '2025-01-15', kycStatus: 'approved' },
  { id: 'MEM-002', company: 'Marina Foods', uen: '201987654B', tier: 'scale', status: 'active', rvuEarned: 12450, joinedDate: '2024-02-20', renewalDate: '2025-02-20', kycStatus: 'approved' },
  { id: 'MEM-003', company: 'Global Logistics SG', uen: '200234567C', tier: 'enterprise', status: 'active', rvuEarned: 45890, joinedDate: '2024-03-10', renewalDate: '2025-03-10', kycStatus: 'approved' },
  { id: 'MEM-004', company: 'Urban Retail', uen: '202156789D', tier: 'starter', status: 'pending_kyc', rvuEarned: 0, joinedDate: '2024-11-25', renewalDate: '2025-11-25', kycStatus: 'under_review' },
  { id: 'MEM-005', company: 'Skyline Properties', uen: '199845678E', tier: 'mnc', status: 'active', rvuEarned: 156780, joinedDate: '2024-01-01', renewalDate: '2025-01-01', kycStatus: 'approved' },
];

const kycStatusConfig = {
  not_started: { label: 'Not Started', color: 'bg-slate-500/20 text-slate-400' },
  documents_uploaded: { label: 'Docs Uploaded', color: 'bg-blue-500/20 text-blue-400' },
  under_review: { label: 'Under Review', color: 'bg-amber-500/20 text-amber-400' },
  approved: { label: 'Approved', color: 'bg-emerald-500/20 text-emerald-400' },
  rejected: { label: 'Rejected', color: 'bg-red-500/20 text-red-400' },
};

export default function RWAMembership() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [onboardingModal, setOnboardingModal] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);

  const filteredMembers = sampleMemberships.filter(m =>
    m.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.uen.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    Membership Management
                  </h1>
                  <p className="text-slate-400 mt-1">Manage RWA memberships, tiers, and KYC onboarding</p>
                </div>
              </div>
              <Button 
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400"
                onClick={() => { setOnboardingModal(true); setOnboardingStep(1); }}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Membership
              </Button>
            </div>

            {/* Tier Cards */}
            <div className="grid grid-cols-5 gap-4 mb-8">
              {Object.entries(tierConfig).map(([key, tier], idx) => {
                const TierIcon = tier.icon;
                const count = sampleMemberships.filter(m => m.tier === key).length;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
                      <CardContent className="p-4">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center mb-3`}>
                          <TierIcon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-white font-medium">{tier.name}</p>
                        <p className="text-2xl font-bold text-white mt-1">{count}</p>
                        <div className="flex items-center justify-between mt-2 text-xs">
                          <span className="text-slate-500">${tier.fee}/mo</span>
                          <span className="text-lime-400">{tier.multiplier}x RVU</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Search and Table */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">All Memberships</CardTitle>
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder="Search by company or UEN..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableHead className="text-slate-400">Company</TableHead>
                      <TableHead className="text-slate-400">UEN</TableHead>
                      <TableHead className="text-slate-400">Tier</TableHead>
                      <TableHead className="text-slate-400">KYC Status</TableHead>
                      <TableHead className="text-slate-400 text-right">RVU Earned</TableHead>
                      <TableHead className="text-slate-400">Renewal</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => {
                      const tier = tierConfig[member.tier];
                      const TierIcon = tier.icon;
                      const kyc = kycStatusConfig[member.kycStatus];
                      return (
                        <TableRow key={member.id} className="border-slate-800 hover:bg-slate-800/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center`}>
                                <TierIcon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-white font-medium">{member.company}</p>
                                <p className="text-slate-500 text-xs">{member.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-400 font-mono">{member.uen}</TableCell>
                          <TableCell>
                            <Badge className={`bg-gradient-to-r ${tier.color} text-white`}>
                              {tier.name}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={kyc.color}>{kyc.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-lime-400 font-medium">{member.rvuEarned.toLocaleString()}</span>
                          </TableCell>
                          <TableCell className="text-slate-400 text-sm">{member.renewalDate}</TableCell>
                          <TableCell>
                            <Badge className={member.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
                              {member.status === 'active' ? 'Active' : 'Pending KYC'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="w-4 h-4 text-slate-400" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="w-4 h-4 text-slate-400" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Onboarding Modal */}
            <Dialog open={onboardingModal} onOpenChange={setOnboardingModal}>
              <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-pink-400" />
                    New Member Onboarding
                  </DialogTitle>
                </DialogHeader>
                
                {/* Progress */}
                <div className="flex items-center gap-2 mb-6">
                  {[1, 2, 3, 4].map((step) => (
                    <React.Fragment key={step}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step <= onboardingStep ? 'bg-pink-500 text-white' : 'bg-slate-700 text-slate-400'
                      }`}>
                        {step < onboardingStep ? <CheckCircle2 className="w-4 h-4" /> : step}
                      </div>
                      {step < 4 && <div className={`flex-1 h-1 ${step < onboardingStep ? 'bg-pink-500' : 'bg-slate-700'}`} />}
                    </React.Fragment>
                  ))}
                </div>

                {onboardingStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Company Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company Name *</Label>
                        <Input placeholder="Enter company name" className="bg-slate-800 border-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <Label>UEN *</Label>
                        <Input placeholder="e.g., 202312345A" className="bg-slate-800 border-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Person *</Label>
                        <Input placeholder="Full name" className="bg-slate-800 border-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input type="email" placeholder="email@company.com" className="bg-slate-800 border-slate-700" />
                      </div>
                    </div>
                  </div>
                )}

                {onboardingStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Select Membership Tier</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(tierConfig).slice(0, 3).map(([key, tier]) => {
                        const TierIcon = tier.icon;
                        return (
                          <Card key={key} className="bg-slate-800 border-slate-700 hover:border-pink-500/50 cursor-pointer transition-colors">
                            <CardContent className="p-4 text-center">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mx-auto mb-3`}>
                                <TierIcon className="w-6 h-6 text-white" />
                              </div>
                              <p className="text-white font-medium">{tier.name}</p>
                              <p className="text-2xl font-bold text-white mt-1">${tier.fee}<span className="text-sm text-slate-400">/mo</span></p>
                              <p className="text-lime-400 text-sm mt-2">{tier.multiplier}x RVU Multiplier</p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}

                {onboardingStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">KYC Documents</h3>
                    <div className="space-y-4">
                      {['ACRA Business Profile', 'Director IC/Passport', 'Proof of Address'].map((doc) => (
                        <div key={doc} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-slate-400" />
                              <span className="text-white">{doc}</span>
                            </div>
                            <Button variant="outline" size="sm" className="border-slate-600">
                              <Upload className="w-4 h-4 mr-2" />
                              Upload
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {onboardingStep === 4 && (
                  <div className="space-y-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-medium">Application Submitted</h3>
                    <p className="text-slate-400">Your membership application has been submitted. Our team will review your KYC documents within 1-2 business days.</p>
                  </div>
                )}

                <DialogFooter className="mt-6">
                  {onboardingStep > 1 && onboardingStep < 4 && (
                    <Button variant="outline" className="border-slate-700" onClick={() => setOnboardingStep(s => s - 1)}>
                      Back
                    </Button>
                  )}
                  {onboardingStep < 4 ? (
                    <Button className="bg-pink-500 hover:bg-pink-400" onClick={() => setOnboardingStep(s => s + 1)}>
                      {onboardingStep === 3 ? 'Submit Application' : 'Continue'}
                    </Button>
                  ) : (
                    <Button className="bg-pink-500 hover:bg-pink-400" onClick={() => setOnboardingModal(false)}>
                      Done
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}