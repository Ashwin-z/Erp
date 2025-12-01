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
import { Slider } from "@/components/ui/slider";
import {
  Gift, ArrowLeft, Play, Pause, CheckCircle2, Clock, AlertTriangle,
  Calculator, TrendingUp, Users, Coins, BarChart3, Download, RefreshCw,
  Zap, Target, DollarSign, PieChart
} from 'lucide-react';
import RWALifecycleManager from '@/components/rwa/RWALifecycleManager';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { toast } from 'sonner';

const currentPool = {
  id: 'POOL-2024-11',
  period: 'November 2024',
  periodStart: '2024-11-01',
  periodEnd: '2024-11-30',
  status: 'accumulating',
  totalRVUs: 1247856,
  poolAmount: 100000,
  participantCount: 156,
  rvuValue: 0.0802,
  progress: 90,
  feeSources: [
    { source: 'Platform Fees', amount: 45000, percentage: 45 },
    { source: 'Transaction Fees', amount: 30000, percentage: 30 },
    { source: 'Subscription Revenue', amount: 20000, percentage: 20 },
    { source: 'Partner Contributions', amount: 5000, percentage: 5 },
  ]
};

const topParticipants = [
  { rank: 1, company: 'Skyline Properties', tier: 'mnc', rvus: 156780, multiplier: 2.5, estimatedReward: 31483.50 },
  { rank: 2, company: 'Global Logistics SG', tier: 'enterprise', rvus: 45890, multiplier: 2.0, estimatedReward: 7362.45 },
  { rank: 3, company: 'Marina Foods', tier: 'scale', rvus: 12450, multiplier: 1.5, estimatedReward: 1497.53 },
  { rank: 4, company: 'TechStart Pte Ltd', tier: 'growth', rvus: 4523, multiplier: 1.2, estimatedReward: 435.24 },
  { rank: 5, company: 'Urban Retail', tier: 'starter', rvus: 2100, multiplier: 1.0, estimatedReward: 168.42 },
];

const pastPools = [
  { id: 'POOL-2024-10', period: 'October 2024', totalRVUs: 1156234, poolAmount: 95000, distributed: 94850, status: 'distributed' },
  { id: 'POOL-2024-09', period: 'September 2024', totalRVUs: 987654, poolAmount: 85000, distributed: 84920, status: 'distributed' },
  { id: 'POOL-2024-08', period: 'August 2024', totalRVUs: 876543, poolAmount: 75000, distributed: 74890, status: 'distributed' },
];

export default function RWADistribution() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [simulatorModal, setSimulatorModal] = useState(false);
  const [simPoolSize, setSimPoolSize] = useState([100000]);
  const [simMyRVUs, setSimMyRVUs] = useState([5000]);

  const simEstimatedReward = (simMyRVUs[0] / currentPool.totalRVUs) * simPoolSize[0] * 1.2;

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
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    Reward Distribution Engine
                  </h1>
                  <p className="text-slate-400 mt-1">RVU pool management and reward distribution</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => setSimulatorModal(true)}>
                  <Calculator className="w-4 h-4 mr-2" />
                  Simulator
                </Button>
                <Button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400">
                  <Play className="w-4 h-4 mr-2" />
                  Run Distribution
                </Button>
              </div>
            </div>

            {/* Lifecycle Automation */}
            <div className="mb-8">
              <RWALifecycleManager />
            </div>

            {/* Current Pool Status */}
            <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/30 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-white">{currentPool.period}</h2>
                      <Badge className="bg-emerald-500/20 text-emerald-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {currentPool.status}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">{currentPool.id} • {currentPool.periodStart} to {currentPool.periodEnd}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">Period Progress</p>
                    <div className="flex items-center gap-3 mt-1">
                      <Progress value={currentPool.progress} className="w-40 h-2 bg-slate-700" />
                      <span className="text-white font-medium">{currentPool.progress}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-400 text-sm">Pool Amount</span>
                    </div>
                    <p className="text-2xl font-bold text-white">${currentPool.poolAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Coins className="w-4 h-4 text-lime-400" />
                      <span className="text-slate-400 text-sm">Total RVUs</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{currentPool.totalRVUs.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-400 text-sm">RVU Value</span>
                    </div>
                    <p className="text-2xl font-bold text-white">${currentPool.rvuValue.toFixed(4)}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-violet-400" />
                      <span className="text-slate-400 text-sm">Participants</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{currentPool.participantCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {/* Fee Sources */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-emerald-400" />
                    Pool Contributions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentPool.feeSources.map((source, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300 text-sm">{source.source}</span>
                        <span className="text-white font-medium">${source.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={source.percentage} className="h-2 flex-1 bg-slate-700" />
                        <span className="text-slate-500 text-xs w-8">{source.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Top Participants */}
              <Card className="bg-slate-900/50 border-slate-800 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-lime-400" />
                    Top Participants
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-400 w-12">#</TableHead>
                        <TableHead className="text-slate-400">Company</TableHead>
                        <TableHead className="text-slate-400 text-right">RVUs</TableHead>
                        <TableHead className="text-slate-400 text-center">Multiplier</TableHead>
                        <TableHead className="text-slate-400 text-right">Est. Reward</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topParticipants.map((p) => (
                        <TableRow key={p.rank} className="border-slate-800 hover:bg-slate-800/50">
                          <TableCell>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              p.rank === 1 ? 'bg-amber-500 text-white' :
                              p.rank === 2 ? 'bg-slate-300 text-slate-800' :
                              p.rank === 3 ? 'bg-amber-700 text-white' :
                              'bg-slate-700 text-slate-300'
                            }`}>
                              {p.rank}
                            </div>
                          </TableCell>
                          <TableCell className="text-white">{p.company}</TableCell>
                          <TableCell className="text-right text-lime-400 font-medium">{p.rvus.toLocaleString()}</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-violet-500/20 text-violet-400">{p.multiplier}x</Badge>
                          </TableCell>
                          <TableCell className="text-right text-emerald-400 font-bold">${p.estimatedReward.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Past Pools */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Distribution History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableHead className="text-slate-400">Pool ID</TableHead>
                      <TableHead className="text-slate-400">Period</TableHead>
                      <TableHead className="text-slate-400 text-right">Total RVUs</TableHead>
                      <TableHead className="text-slate-400 text-right">Pool Amount</TableHead>
                      <TableHead className="text-slate-400 text-right">Distributed</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastPools.map((pool) => (
                      <TableRow key={pool.id} className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="text-cyan-400 font-mono">{pool.id}</TableCell>
                        <TableCell className="text-white">{pool.period}</TableCell>
                        <TableCell className="text-right text-slate-300">{pool.totalRVUs.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-white font-medium">${pool.poolAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-emerald-400">${pool.distributed.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500/20 text-emerald-400">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Distributed
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-slate-400">
                            <Download className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Simulator Modal */}
            <Dialog open={simulatorModal} onOpenChange={setSimulatorModal}>
              <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-400" />
                    Reward Simulator
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 mt-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Pool Size (SGD)</Label>
                      <span className="text-emerald-400 font-mono">${simPoolSize[0].toLocaleString()}</span>
                    </div>
                    <Slider
                      value={simPoolSize}
                      onValueChange={setSimPoolSize}
                      min={10000}
                      max={500000}
                      step={5000}
                      className="bg-slate-700"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>My RVUs</Label>
                      <span className="text-lime-400 font-mono">{simMyRVUs[0].toLocaleString()}</span>
                    </div>
                    <Slider
                      value={simMyRVUs}
                      onValueChange={setSimMyRVUs}
                      min={100}
                      max={50000}
                      step={100}
                      className="bg-slate-700"
                    />
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
                    <p className="text-slate-400 text-sm mb-2">Estimated Reward (1.2x Growth Tier)</p>
                    <p className="text-4xl font-bold text-emerald-400">${simEstimatedReward.toFixed(2)}</p>
                    <p className="text-slate-500 text-xs mt-2">Based on current pool total of {currentPool.totalRVUs.toLocaleString()} RVUs</p>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button variant="outline" className="border-slate-700" onClick={() => setSimulatorModal(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}