import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Shield, ArrowLeft, Lock, Building2, FileCheck, Users, Wallet,
  CheckCircle2, AlertTriangle, Info, ExternalLink, Download,
  Landmark, Globe, Key, Eye, Scale, FileText, Briefcase,
  ShieldCheck, Layers, Server, Database, BadgeCheck
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const protectionLayers = [
  {
    layer: 1,
    name: 'Custodial Protection',
    icon: Landmark,
    color: 'from-blue-400 to-blue-600',
    description: 'All funds held by MAS-licensed custodian partners',
    coverage: '100% of deposits',
    providers: ['DBS Trustee', 'Fireblocks', 'HexTrust'],
    features: [
      'Segregated client accounts',
      'Independent custody (not held by ARKFinex)',
      'Bankruptcy-remote structure',
      'MAS-regulated oversight'
    ]
  },
  {
    layer: 2,
    name: 'Platform Liability Insurance',
    icon: Shield,
    color: 'from-emerald-400 to-emerald-600',
    description: 'Protection against operational errors and fraud',
    coverage: 'Up to SGD 10M',
    providers: ["Lloyd's of London", 'AIG', 'Allianz'],
    features: [
      'Fraud by platform operator',
      'Employee misappropriation',
      'Operational failures',
      'System errors'
    ]
  },
  {
    layer: 3,
    name: 'Cyber & Digital Asset Insurance',
    icon: Lock,
    color: 'from-violet-400 to-violet-600',
    description: 'Protection against cyber theft and digital asset loss',
    coverage: 'Up to SGD 5M',
    providers: ['Munich RE', 'Swiss Re', 'Marsh'],
    features: [
      'Hot wallet protection',
      'Cold storage insurance',
      'Cyber theft coverage',
      'Ransomware protection'
    ]
  },
  {
    layer: 4,
    name: 'Smart Contract Insurance',
    icon: FileCheck,
    color: 'from-cyan-400 to-cyan-600',
    description: 'RWA token and smart contract failure protection',
    coverage: 'Up to SGD 2M',
    providers: ['Nexus Mutual', 'InsurAce', 'ChainProof'],
    features: [
      'Smart contract failures',
      'Oracle manipulation protection',
      'RWA token misvaluation',
      'Protocol exploits'
    ]
  },
  {
    layer: 5,
    name: 'Directors & Officers Insurance',
    icon: Briefcase,
    color: 'from-amber-400 to-amber-600',
    description: 'Leadership liability protection',
    coverage: 'Up to SGD 5M',
    providers: ['Chubb', 'AXA', 'Zurich'],
    features: [
      'Management decisions protection',
      'Regulatory investigation costs',
      'Legal defense coverage',
      'Settlement coverage'
    ]
  }
];

const complianceItems = [
  { name: 'MAS Payment Services Act', status: 'compliant', description: 'Partner PSP holds Major Payment Institution license' },
  { name: 'PDPA Compliance', status: 'compliant', description: 'Full data protection compliance with consent management' },
  { name: 'AML/CFT Requirements', status: 'compliant', description: 'KYC/AML verification via licensed partners' },
  { name: 'Permissioned Ledger Audit', status: 'compliant', description: 'Immutable transaction hashes on enterprise blockchain' },
  { name: 'SOC 2 Type II', status: 'in_progress', description: 'Security audit certification in progress' },
  { name: 'ISO 27001', status: 'planned', description: 'Information security management certification' },
];

const riskReserve = {
  currentBalance: 2500000,
  targetBalance: 5000000,
  contributionRate: 2.5,
  lastAudit: '2024-11-15',
  auditor: 'KPMG Singapore'
};

const notCovered = [
  'Investment returns or profit guarantees',
  'Market value fluctuations of RWA tokens',
  'Capital losses from market conditions',
  'Interest income guarantees',
  'Third-party platform failures outside ecosystem'
];

export default function RWAShield() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="max-w-[1400px] mx-auto">
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
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    RWA Shield™ Protection
                  </h1>
                  <p className="text-slate-400 mt-1">Multi-layer investor and membership fund protection</p>
                </div>
              </div>
              <Button variant="outline" className="border-slate-700 text-slate-300">
                <Download className="w-4 h-4 mr-2" />
                Download Protection Certificate
              </Button>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-emerald-500/30">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <span className="text-slate-400 text-sm">Total Coverage</span>
                  </div>
                  <p className="text-2xl font-bold text-white">SGD 22M+</p>
                  <p className="text-emerald-400 text-xs mt-1">Across 5 protection layers</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Landmark className="w-5 h-5 text-blue-400" />
                    <span className="text-slate-400 text-sm">Custody Partner</span>
                  </div>
                  <p className="text-2xl font-bold text-white">MAS Licensed</p>
                  <p className="text-blue-400 text-xs mt-1">Segregated accounts</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-violet-400" />
                    <span className="text-slate-400 text-sm">Risk Reserve</span>
                  </div>
                  <p className="text-2xl font-bold text-white">SGD {(riskReserve.currentBalance / 1000000).toFixed(1)}M</p>
                  <p className="text-violet-400 text-xs mt-1">{((riskReserve.currentBalance / riskReserve.targetBalance) * 100).toFixed(0)}% of target</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <BadgeCheck className="w-5 h-5 text-lime-400" />
                    <span className="text-slate-400 text-sm">Compliance</span>
                  </div>
                  <p className="text-2xl font-bold text-white">4/6</p>
                  <p className="text-lime-400 text-xs mt-1">Certifications achieved</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="layers">
              <TabsList className="bg-slate-800/50 border-slate-700 mb-6">
                <TabsTrigger value="layers" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                  <Layers className="w-4 h-4 mr-2" />
                  Protection Layers
                </TabsTrigger>
                <TabsTrigger value="compliance" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                  <Scale className="w-4 h-4 mr-2" />
                  Compliance
                </TabsTrigger>
                <TabsTrigger value="reserve" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
                  <Wallet className="w-4 h-4 mr-2" />
                  Risk Reserve
                </TabsTrigger>
                <TabsTrigger value="disclosures" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
                  <FileText className="w-4 h-4 mr-2" />
                  Disclosures
                </TabsTrigger>
              </TabsList>

              {/* Protection Layers */}
              <TabsContent value="layers">
                <div className="space-y-4">
                  {protectionLayers.map((layer, idx) => {
                    const LayerIcon = layer.icon;
                    return (
                      <motion.div
                        key={layer.layer}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-6">
                              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${layer.color} flex items-center justify-center shrink-0`}>
                                <LayerIcon className="w-8 h-8 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Badge className="bg-slate-700 text-slate-300">Layer {layer.layer}</Badge>
                                  <h3 className="text-xl font-bold text-white">{layer.name}</h3>
                                </div>
                                <p className="text-slate-400 mb-4">{layer.description}</p>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="bg-slate-800/50 rounded-lg p-3">
                                    <p className="text-slate-500 text-xs mb-1">Coverage Amount</p>
                                    <p className="text-emerald-400 font-bold">{layer.coverage}</p>
                                  </div>
                                  <div className="bg-slate-800/50 rounded-lg p-3">
                                    <p className="text-slate-500 text-xs mb-1">Providers</p>
                                    <p className="text-white text-sm">{layer.providers.join(', ')}</p>
                                  </div>
                                </div>
                                <div className="mt-4">
                                  <p className="text-slate-500 text-xs mb-2">What's Covered:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {layer.features.map((feature, i) => (
                                      <Badge key={i} className="bg-slate-800 text-slate-300 text-xs">
                                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" />
                                        {feature}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Compliance */}
              <TabsContent value="compliance">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Scale className="w-5 h-5 text-blue-400" />
                      Regulatory Compliance Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {complianceItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          {item.status === 'compliant' ? (
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            </div>
                          ) : item.status === 'in_progress' ? (
                            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                              <AlertTriangle className="w-5 h-5 text-amber-400" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                              <Info className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-white font-medium">{item.name}</p>
                            <p className="text-slate-400 text-sm">{item.description}</p>
                          </div>
                        </div>
                        <Badge className={
                          item.status === 'compliant' ? 'bg-emerald-500/20 text-emerald-400' :
                          item.status === 'in_progress' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-slate-700 text-slate-400'
                        }>
                          {item.status === 'compliant' ? 'Compliant' : item.status === 'in_progress' ? 'In Progress' : 'Planned'}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800 mt-6">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Landmark className="w-5 h-5 text-blue-400" />
                      Partner Structure (No License Required)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <p className="text-blue-400 font-medium">ARKFinex operates through licensed partners</p>
                          <p className="text-slate-400 text-sm mt-1">
                            All fiat flows are processed by MAS-licensed Payment Service Providers. ARKFinex provides the technology platform, RVU accounting, and business logic while partners handle regulated settlement.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                        <Building2 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-white font-medium">Licensed PSP</p>
                        <p className="text-slate-400 text-sm">Fiat settlement & custody</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                        <Server className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                        <p className="text-white font-medium">ARKFinex Platform</p>
                        <p className="text-slate-400 text-sm">RVU engine & business logic</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                        <Database className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                        <p className="text-white font-medium">Permissioned Ledger</p>
                        <p className="text-slate-400 text-sm">Immutable audit trail</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Risk Reserve */}
              <TabsContent value="reserve">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-violet-400" />
                        Risk Reserve Fund
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-6">
                        <p className="text-5xl font-bold text-white">SGD {(riskReserve.currentBalance / 1000000).toFixed(2)}M</p>
                        <p className="text-slate-400 mt-2">of SGD {(riskReserve.targetBalance / 1000000).toFixed(0)}M target</p>
                      </div>
                      <Progress value={(riskReserve.currentBalance / riskReserve.targetBalance) * 100} className="h-3 mb-4" />
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <p className="text-slate-400 text-xs">Contribution Rate</p>
                          <p className="text-white font-bold">{riskReserve.contributionRate}%</p>
                          <p className="text-slate-500 text-xs">of platform revenue</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <p className="text-slate-400 text-xs">Last Audit</p>
                          <p className="text-white font-bold">{riskReserve.lastAudit}</p>
                          <p className="text-slate-500 text-xs">by {riskReserve.auditor}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-white">How Risk Reserve Works</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                          <span className="text-emerald-400 font-bold text-sm">1</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">Revenue Contribution</p>
                          <p className="text-slate-400 text-sm">{riskReserve.contributionRate}% of all platform revenue flows to the reserve fund</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                          <span className="text-emerald-400 font-bold text-sm">2</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">Segregated Account</p>
                          <p className="text-slate-400 text-sm">Funds held in separate trustee-managed account</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                          <span className="text-emerald-400 font-bold text-sm">3</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">Compensates Losses</p>
                          <p className="text-slate-400 text-sm">Used for accidental losses, not investment failures</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                          <span className="text-emerald-400 font-bold text-sm">4</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">Blockchain Transparent</p>
                          <p className="text-slate-400 text-sm">All movements recorded on permissioned ledger</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Disclosures */}
              <TabsContent value="disclosures">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                      Important Risk Disclosures
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
                      <p className="text-amber-400 font-medium mb-2">What Is NOT Covered</p>
                      <p className="text-slate-400 text-sm mb-4">
                        To maintain regulatory compliance, the following cannot be insured or guaranteed:
                      </p>
                      <div className="space-y-2">
                        {notCovered.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                              <span className="text-red-400 text-xs">✕</span>
                            </div>
                            <span className="text-slate-300 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <p className="text-white font-medium mb-3">RWA Utility Model (Not Investment)</p>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        ARKFinex RWA operates as a <strong className="text-white">utility and membership rewards system</strong>, not an investment product. 
                        Members earn RVU rewards, loyalty points, rebates, advertising revenue share, marketplace profit share, and referral bonuses 
                        based on platform usage and activity. This structure is designed to comply with Singapore regulations without requiring 
                        a Capital Markets Services license.
                      </p>
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <p className="text-slate-500 text-xs">
                          Funds are never held by ARKFinex directly. All fiat flows are processed and custodied by MAS-licensed partners. 
                          For more information, consult our legal documentation or contact compliance@arkfinex.com.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-6">
                      <FileText className="w-10 h-10 text-slate-400 mb-4" />
                      <h3 className="text-white font-bold mb-2">Terms of Service</h3>
                      <p className="text-slate-400 text-sm mb-4">Full legal terms governing platform usage and RVU participation</p>
                      <Button variant="outline" className="border-slate-700 text-slate-300 w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-6">
                      <Eye className="w-10 h-10 text-slate-400 mb-4" />
                      <h3 className="text-white font-bold mb-2">Privacy Policy</h3>
                      <p className="text-slate-400 text-sm mb-4">PDPA-compliant data handling and user privacy protections</p>
                      <Button variant="outline" className="border-slate-700 text-slate-300 w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}