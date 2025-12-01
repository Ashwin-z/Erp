import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  TrendingUp, Wallet, Shield, FileText, Download, PieChart,
  ArrowUpRight, ArrowDownRight, Coins, Building2, BarChart3,
  Clock, CheckCircle2, Eye, ExternalLink, Lock, Landmark
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const portfolioAssets = [
  { id: 1, name: 'Invoice Pool Q4-2024', type: 'invoice', tokens: 5000, value: 50000, yield: 8.5, status: 'active', maturity: '2025-03-15' },
  { id: 2, name: 'Trade Finance Bundle A', type: 'receivable', tokens: 2500, value: 25000, yield: 7.2, status: 'active', maturity: '2025-02-28' },
  { id: 3, name: 'SME Working Capital', type: 'loan', tokens: 10000, value: 100000, yield: 9.8, status: 'active', maturity: '2025-06-30' },
  { id: 4, name: 'Equipment Lease Pool', type: 'lease', tokens: 3000, value: 30000, yield: 6.5, status: 'maturing', maturity: '2024-12-31' },
];

const opportunities = [
  { id: 1, name: 'Invoice Pool Jan-2025', type: 'invoice', minInvestment: 1000, targetYield: 8.2, risk: 'low', funded: 65, target: 500000 },
  { id: 2, name: 'Logistics Receivables', type: 'receivable', minInvestment: 5000, targetYield: 9.5, risk: 'medium', funded: 42, target: 750000 },
  { id: 3, name: 'Tech Startup Loans', type: 'loan', minInvestment: 10000, targetYield: 12.0, risk: 'high', funded: 28, target: 1000000 },
];

const distributions = [
  { id: 1, date: '2024-11-25', asset: 'Invoice Pool Q4-2024', type: 'yield', amount: 354.17 },
  { id: 2, date: '2024-11-20', asset: 'Trade Finance Bundle A', type: 'yield', amount: 150.00 },
  { id: 3, date: '2024-11-15', asset: 'SME Working Capital', type: 'yield', amount: 816.67 },
  { id: 4, date: '2024-11-01', asset: 'Invoice Pool Q3-2024', type: 'principal', amount: 25000.00 },
];

const complianceDocs = [
  { name: 'Investment Terms & Conditions', type: 'legal', date: '2024-01-15' },
  { name: 'Risk Disclosure Statement', type: 'risk', date: '2024-01-15' },
  { name: 'Token Purchase Agreement', type: 'legal', date: '2024-06-01' },
  { name: 'AML/KYC Verification Certificate', type: 'compliance', date: '2024-11-01' },
  { name: 'Quarterly Performance Report Q3', type: 'report', date: '2024-10-15' },
];

const riskColors = { low: 'bg-emerald-500/20 text-emerald-400', medium: 'bg-amber-500/20 text-amber-400', high: 'bg-red-500/20 text-red-400' };
const typeIcons = { invoice: FileText, receivable: Coins, loan: Landmark, lease: Building2 };

export default function InvestorDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");

  const totalValue = portfolioAssets.reduce((a, b) => a + b.value, 0);
  const totalYield = portfolioAssets.reduce((a, b) => a + (b.value * b.yield / 100), 0);
  const avgYield = portfolioAssets.reduce((a, b) => a + b.yield, 0) / portfolioAssets.length;

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  Investor Dashboard
                </h1>
                <p className="text-slate-400 mt-1">Track your tokenised asset portfolio and opportunities</p>
              </div>
              <div className="flex gap-3">
                <Link to={createPageUrl('RWATokenisation')}>
                  <Button variant="outline" className="border-slate-700 text-slate-300">
                    <Coins className="w-4 h-4 mr-2" />
                    Tokenise Assets
                  </Button>
                </Link>
                <Link to={createPageUrl('RWAShield')}>
                  <Button className="bg-gradient-to-r from-violet-500 to-purple-500">
                    <Shield className="w-4 h-4 mr-2" />
                    RWA Shield
                  </Button>
                </Link>
              </div>
            </div>

            {/* Portfolio Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-violet-500/30">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-5 h-5 text-violet-400" />
                    <span className="text-slate-400 text-sm">Portfolio Value</span>
                  </div>
                  <p className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-sm">+5.2%</span>
                    <span className="text-slate-500 text-xs">this month</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span className="text-slate-400 text-sm">Monthly Yield</span>
                  </div>
                  <p className="text-2xl font-bold text-white">${totalYield.toLocaleString()}</p>
                  <p className="text-emerald-400 text-sm mt-1">{avgYield.toFixed(1)}% avg APY</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="w-5 h-5 text-amber-400" />
                    <span className="text-slate-400 text-sm">Total Tokens</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{portfolioAssets.reduce((a, b) => a + b.tokens, 0).toLocaleString()}</p>
                  <p className="text-slate-500 text-sm mt-1">Across {portfolioAssets.length} assets</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <span className="text-slate-400 text-sm">Risk Reserve</span>
                  </div>
                  <p className="text-2xl font-bold text-white">$2.5M</p>
                  <p className="text-cyan-400 text-sm mt-1">50% of target</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="portfolio">
              <TabsList className="bg-slate-800/50 border-slate-700 mb-6">
                <TabsTrigger value="portfolio"><PieChart className="w-4 h-4 mr-2" />Portfolio</TabsTrigger>
                <TabsTrigger value="opportunities"><TrendingUp className="w-4 h-4 mr-2" />Opportunities</TabsTrigger>
                <TabsTrigger value="distributions"><Coins className="w-4 h-4 mr-2" />Distributions</TabsTrigger>
                <TabsTrigger value="compliance"><FileText className="w-4 h-4 mr-2" />Compliance</TabsTrigger>
              </TabsList>

              {/* Portfolio Tab */}
              <TabsContent value="portfolio">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="border-b border-slate-800">
                    <CardTitle className="text-white">Your Tokenised Assets</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-transparent">
                          <TableHead className="text-slate-400">Asset</TableHead>
                          <TableHead className="text-slate-400 text-center">Tokens</TableHead>
                          <TableHead className="text-slate-400 text-right">Value</TableHead>
                          <TableHead className="text-slate-400 text-center">Yield</TableHead>
                          <TableHead className="text-slate-400">Maturity</TableHead>
                          <TableHead className="text-slate-400">Status</TableHead>
                          <TableHead className="text-slate-400"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {portfolioAssets.map((asset) => {
                          const TypeIcon = typeIcons[asset.type];
                          return (
                            <TableRow key={asset.id} className="border-slate-800 hover:bg-slate-800/50">
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                    <TypeIcon className="w-5 h-5 text-violet-400" />
                                  </div>
                                  <div>
                                    <p className="text-white font-medium">{asset.name}</p>
                                    <p className="text-slate-500 text-xs capitalize">{asset.type}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-center text-white">{asset.tokens.toLocaleString()}</TableCell>
                              <TableCell className="text-right text-white font-medium">${asset.value.toLocaleString()}</TableCell>
                              <TableCell className="text-center">
                                <Badge className="bg-emerald-500/20 text-emerald-400">{asset.yield}%</Badge>
                              </TableCell>
                              <TableCell className="text-slate-400">{asset.maturity}</TableCell>
                              <TableCell>
                                <Badge className={asset.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
                                  {asset.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" className="text-slate-400">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Opportunities Tab */}
              <TabsContent value="opportunities">
                <div className="grid md:grid-cols-3 gap-4">
                  {opportunities.map((opp, idx) => {
                    const TypeIcon = typeIcons[opp.type];
                    return (
                      <motion.div key={opp.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                        <Card className="bg-slate-900/50 border-slate-800 hover:border-violet-500/50 transition-colors">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                <TypeIcon className="w-6 h-6 text-violet-400" />
                              </div>
                              <Badge className={riskColors[opp.risk]}>{opp.risk} risk</Badge>
                            </div>
                            <h3 className="text-white font-bold mb-1">{opp.name}</h3>
                            <p className="text-slate-500 text-sm capitalize mb-4">{opp.type}</p>
                            
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                                <p className="text-slate-500 text-xs">Target Yield</p>
                                <p className="text-emerald-400 font-bold">{opp.targetYield}%</p>
                              </div>
                              <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                                <p className="text-slate-500 text-xs">Min. Investment</p>
                                <p className="text-white font-bold">${opp.minInvestment.toLocaleString()}</p>
                              </div>
                            </div>

                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-400">Funded</span>
                                <span className="text-white">{opp.funded}%</span>
                              </div>
                              <Progress value={opp.funded} className="h-2" />
                              <p className="text-slate-500 text-xs mt-1">${(opp.target * opp.funded / 100).toLocaleString()} of ${opp.target.toLocaleString()}</p>
                            </div>

                            <Button className="w-full bg-violet-500 hover:bg-violet-400">
                              Invest Now
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Distributions Tab */}
              <TabsContent value="distributions">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="border-b border-slate-800">
                    <CardTitle className="text-white">Recent Distributions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-transparent">
                          <TableHead className="text-slate-400">Date</TableHead>
                          <TableHead className="text-slate-400">Asset</TableHead>
                          <TableHead className="text-slate-400">Type</TableHead>
                          <TableHead className="text-slate-400 text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {distributions.map((dist) => (
                          <TableRow key={dist.id} className="border-slate-800 hover:bg-slate-800/50">
                            <TableCell className="text-slate-400">{dist.date}</TableCell>
                            <TableCell className="text-white">{dist.asset}</TableCell>
                            <TableCell>
                              <Badge className={dist.type === 'yield' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}>
                                {dist.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right text-emerald-400 font-medium">+${dist.amount.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Compliance Tab */}
              <TabsContent value="compliance">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="border-b border-slate-800">
                    <CardTitle className="text-white">Compliance Documentation</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {complianceDocs.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-violet-400" />
                            <div>
                              <p className="text-white font-medium">{doc.name}</p>
                              <p className="text-slate-500 text-xs">Updated: {doc.date}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="text-slate-400">
                              <Eye className="w-4 h-4 mr-1" />View
                            </Button>
                            <Button variant="ghost" size="sm" className="text-slate-400">
                              <Download className="w-4 h-4 mr-1" />Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}