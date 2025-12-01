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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Wallet, ArrowLeft, Plus, Send, Download, ArrowUpRight, ArrowDownLeft,
  RefreshCw, Lock, Unlock, CreditCard, Building2, Users, Gift,
  TrendingUp, Clock, CheckCircle2, AlertTriangle, MoreHorizontal, QrCode
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { toast } from 'sonner';

const sampleWallets = [
  { id: 'WAL-0001', name: 'Main Company Wallet', type: 'company', balance: 15420.50, available: 14920.50, frozen: 500, currency: 'SGD', status: 'active', lastTx: '2 mins ago' },
  { id: 'WAL-0002', name: 'Reward Wallet', type: 'reward', balance: 3250.75, available: 3250.75, frozen: 0, currency: 'SGD', status: 'active', lastTx: '1 hour ago' },
  { id: 'WAL-0003', name: 'Marketing Credits', type: 'marketing_credit', balance: 1500.00, available: 1500.00, frozen: 0, currency: 'SGD', status: 'active', lastTx: '3 days ago' },
  { id: 'WAL-0004', name: 'Loan Rebate Wallet', type: 'loan_rebate', balance: 850.25, available: 850.25, frozen: 0, currency: 'SGD', status: 'active', lastTx: '1 week ago' },
];

const sampleTransactions = [
  { id: 'TXN-001', type: 'credit', category: 'rwa_reward', amount: 362.74, walletName: 'Reward Wallet', description: 'Nov 2024 RWA Distribution', status: 'completed', timestamp: '2024-11-27 14:30:00' },
  { id: 'TXN-002', type: 'debit', category: 'psp_payout', amount: 1000.00, walletName: 'Main Company Wallet', description: 'Payout to DBS ****4567', status: 'processing', timestamp: '2024-11-27 12:15:00' },
  { id: 'TXN-003', type: 'credit', category: 'rwa_reward', amount: 125.50, walletName: 'Reward Wallet', description: 'Invoice RVU Reward', status: 'completed', timestamp: '2024-11-27 10:00:00' },
  { id: 'TXN-004', type: 'transfer_out', category: 'internal_transfer', amount: 500.00, walletName: 'Main Company Wallet', description: 'Transfer to Marketing Credits', status: 'completed', timestamp: '2024-11-26 16:30:00' },
  { id: 'TXN-005', type: 'credit', category: 'loan_rebate', amount: 250.00, walletName: 'Loan Rebate Wallet', description: 'Loan Interest Rebate', status: 'completed', timestamp: '2024-11-26 09:00:00' },
];

const walletTypeConfig = {
  company: { label: 'Company', icon: Building2, color: 'bg-blue-500' },
  reward: { label: 'Reward', icon: Gift, color: 'bg-emerald-500' },
  marketing_credit: { label: 'Marketing', icon: TrendingUp, color: 'bg-violet-500' },
  loan_rebate: { label: 'Loan Rebate', icon: CreditCard, color: 'bg-amber-500' },
  staff: { label: 'Staff', icon: Users, color: 'bg-pink-500' },
};

export default function RWAWallets() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [transferModal, setTransferModal] = useState(false);
  const [payoutModal, setPayoutModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);

  const totalBalance = sampleWallets.reduce((sum, w) => sum + w.balance, 0);
  const totalAvailable = sampleWallets.reduce((sum, w) => sum + w.available, 0);

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
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    Multi-Wallet Manager
                  </h1>
                  <p className="text-slate-400 mt-1">Manage your RWA wallets and transactions</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => setTransferModal(true)}>
                  <Send className="w-4 h-4 mr-2" />
                  Transfer
                </Button>
                <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400" onClick={() => setPayoutModal(true)}>
                  <Download className="w-4 h-4 mr-2" />
                  Payout
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-violet-500/30">
                <CardContent className="p-5">
                  <p className="text-violet-300 text-sm">Total Balance</p>
                  <p className="text-3xl font-bold text-white mt-1">${totalBalance.toLocaleString()}</p>
                  <p className="text-slate-400 text-sm mt-2">{sampleWallets.length} wallets</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-emerald-500/30">
                <CardContent className="p-5">
                  <p className="text-emerald-300 text-sm">Available Balance</p>
                  <p className="text-3xl font-bold text-white mt-1">${totalAvailable.toLocaleString()}</p>
                  <p className="text-slate-400 text-sm mt-2">Ready for withdrawal</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30">
                <CardContent className="p-5">
                  <p className="text-amber-300 text-sm">Pending Transactions</p>
                  <p className="text-3xl font-bold text-white mt-1">2</p>
                  <p className="text-slate-400 text-sm mt-2">$1,500 processing</p>
                </CardContent>
              </Card>
            </div>

            {/* Wallets Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {sampleWallets.map((wallet, idx) => {
                const typeInfo = walletTypeConfig[wallet.type] || walletTypeConfig.company;
                const TypeIcon = typeInfo.icon;
                return (
                  <motion.div
                    key={wallet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card 
                      className={`bg-slate-800/50 border-slate-700 hover:border-violet-500/50 transition-all cursor-pointer ${selectedWallet?.id === wallet.id ? 'border-violet-500 ring-2 ring-violet-500/20' : ''}`}
                      onClick={() => setSelectedWallet(wallet)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl ${typeInfo.color} bg-opacity-20 flex items-center justify-center`}>
                            <TypeIcon className={`w-6 h-6 ${typeInfo.color.replace('bg-', 'text-')}`} />
                          </div>
                          <Badge className={wallet.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600 text-slate-300'}>
                            {wallet.status}
                          </Badge>
                        </div>
                        <p className="text-white font-medium mb-1">{wallet.name}</p>
                        <p className="text-slate-500 text-xs mb-3">{wallet.id}</p>
                        <p className="text-2xl font-bold text-white">${wallet.balance.toLocaleString()}</p>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
                          <span className="text-slate-400 text-xs">Available: ${wallet.available.toLocaleString()}</span>
                          {wallet.frozen > 0 && (
                            <span className="text-amber-400 text-xs flex items-center gap-1">
                              <Lock className="w-3 h-3" />${wallet.frozen}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Transactions */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Recent Transactions</CardTitle>
                  <Button variant="ghost" size="sm" className="text-slate-400">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableHead className="text-slate-400">Transaction</TableHead>
                      <TableHead className="text-slate-400">Wallet</TableHead>
                      <TableHead className="text-slate-400">Description</TableHead>
                      <TableHead className="text-slate-400 text-right">Amount</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleTransactions.map((tx) => (
                      <TableRow key={tx.id} className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              tx.type === 'credit' ? 'bg-emerald-500/20' : 
                              tx.type === 'debit' ? 'bg-red-500/20' : 'bg-blue-500/20'
                            }`}>
                              {tx.type === 'credit' ? (
                                <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                              ) : tx.type === 'debit' ? (
                                <ArrowUpRight className="w-4 h-4 text-red-400" />
                              ) : (
                                <Send className="w-4 h-4 text-blue-400" />
                              )}
                            </div>
                            <span className="text-slate-400 font-mono text-sm">{tx.id}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">{tx.walletName}</TableCell>
                        <TableCell className="text-slate-400 text-sm">{tx.description}</TableCell>
                        <TableCell className={`text-right font-medium ${
                          tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            tx.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                            tx.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-amber-500/20 text-amber-400'
                          }>
                            {tx.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">
                          {new Date(tx.timestamp).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Transfer Modal */}
            <Dialog open={transferModal} onOpenChange={setTransferModal}>
              <DialogContent className="bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-violet-400" />
                    Internal Transfer
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>From Wallet</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue placeholder="Select source wallet" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {sampleWallets.map((w) => (
                          <SelectItem key={w.id} value={w.id}>{w.name} (${w.available})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>To Wallet</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue placeholder="Select destination wallet" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {sampleWallets.map((w) => (
                          <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (SGD)</Label>
                    <Input type="number" placeholder="0.00" className="bg-slate-800 border-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (Optional)</Label>
                    <Input placeholder="Transfer note" className="bg-slate-800 border-slate-700" />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button variant="outline" className="border-slate-700" onClick={() => setTransferModal(false)}>Cancel</Button>
                  <Button className="bg-violet-500 hover:bg-violet-400">Confirm Transfer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Payout Modal */}
            <Dialog open={payoutModal} onOpenChange={setPayoutModal}>
              <DialogContent className="bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-emerald-400" />
                    Withdraw to Bank
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>From Wallet</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue placeholder="Select wallet" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {sampleWallets.filter(w => w.available > 0).map((w) => (
                          <SelectItem key={w.id} value={w.id}>{w.name} (${w.available})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Bank Account</Label>
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-white">DBS Bank ****4567</p>
                          <p className="text-slate-500 text-sm">ARKFinex Pte Ltd</p>
                        </div>
                        <Badge className="bg-emerald-500/20 text-emerald-400 ml-auto">Verified</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (SGD)</Label>
                    <Input type="number" placeholder="0.00" className="bg-slate-800 border-slate-700" />
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-amber-400">Processing Time</p>
                        <p className="text-slate-400">Payouts typically take 1-3 business days. Amounts over $50,000 require trustee approval.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button variant="outline" className="border-slate-700" onClick={() => setPayoutModal(false)}>Cancel</Button>
                  <Button className="bg-emerald-500 hover:bg-emerald-400">Request Payout</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}