import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Wallet, Plus, ArrowUpRight, ArrowDownLeft, RefreshCw,
  CreditCard, Coins, Bitcoin, QrCode, Shield, AlertTriangle
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SOPGuide from '@/components/modules/SOPGuide';
import ModuleDashboard from '@/components/modules/ModuleDashboard';

const walletSOP = {
  title: "Wallet Operations Guide",
  description: "Top-up → Transfer → Convert → Withdraw",
  steps: [
    { name: "Top-up", description: "Add funds to wallet via card, bank transfer, or crypto.", checklist: ["Select payment method", "Enter amount", "Verify KYC level", "Confirm transaction"] },
    { name: "Transfer", description: "Transfer funds between wallets or to other users.", checklist: ["Select recipient wallet", "Enter amount", "Check daily limits", "Confirm transfer"] },
    { name: "Convert", description: "Convert between points, fiat, and crypto currencies.", checklist: ["Select conversion pair", "Check exchange rate", "Enter amount", "Approve conversion"] },
    { name: "Withdraw", description: "Withdraw funds to external bank or crypto wallet.", checklist: ["Verify KYC completed", "Enter withdrawal details", "2FA verification", "Process withdrawal"] }
  ]
};

export default function WalletManagement() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [activeTab, setActiveTab] = useState('all');

  const stats = [
    { label: 'Total Balance', value: '$1.2M', icon: Wallet, color: 'bg-blue-500', trend: 8 },
    { label: 'Points Balance', value: '2.5M pts', icon: Coins, color: 'bg-amber-500', trend: 15 },
    { label: 'Crypto (USDT)', value: '$450K', icon: Bitcoin, color: 'bg-purple-500', trend: 22 },
    { label: 'Pending', value: '$28K', icon: RefreshCw, color: 'bg-slate-500', trend: -5 }
  ];

  const wallets = [
    { id: 1, user: 'john@techstart.com', type: 'fiat', currency: 'SGD', balance: 45000, pending: 2500, status: 'active', kyc_level: 3 },
    { id: 2, user: 'john@techstart.com', type: 'points', currency: 'PTS', balance: 125000, pending: 0, status: 'active', kyc_level: 3 },
    { id: 3, user: 'john@techstart.com', type: 'crypto', currency: 'USDT', balance: 15000, pending: 500, status: 'active', kyc_level: 3 },
    { id: 4, user: 'lisa@marina.com', type: 'fiat', currency: 'SGD', balance: 78000, pending: 0, status: 'active', kyc_level: 2 },
    { id: 5, user: 'david@global.com', type: 'fiat', currency: 'SGD', balance: 5000, pending: 0, status: 'suspended', kyc_level: 1 }
  ];

  const transactions = [
    { id: 1, type: 'topup', amount: 5000, currency: 'SGD', status: 'completed', date: '2024-12-20', user: 'john@techstart.com' },
    { id: 2, type: 'conversion', amount: 10000, currency: 'PTS', status: 'completed', date: '2024-12-20', user: 'john@techstart.com', conversion: '10000 PTS → 100 USDT' },
    { id: 3, type: 'withdrawal', amount: 2000, currency: 'SGD', status: 'pending', date: '2024-12-19', user: 'lisa@marina.com' },
    { id: 4, type: 'transfer', amount: 500, currency: 'USDT', status: 'completed', date: '2024-12-19', user: 'john@techstart.com' }
  ];

  const typeIcons = {
    fiat: CreditCard,
    points: Coins,
    crypto: Bitcoin
  };

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    suspended: 'bg-red-100 text-red-700',
    pending: 'bg-amber-100 text-amber-700',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700'
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1800px] mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Multi-Wallet Management</h1>
                <p className="text-slate-500">Points, Fiat & Crypto wallets with conversion</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Payment
                </Button>
                <Button className="bg-lime-500 hover:bg-lime-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New Wallet
                </Button>
              </div>
            </div>

            {/* SOP Guide */}
            <SOPGuide {...walletSOP} />

            {/* Dashboard Stats */}
            <ModuleDashboard stats={stats} />

            {/* Conversion Card */}
            <Card className="mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Quick Convert</h3>
                    <p className="text-purple-200">Points → USDT | USDT → SGD | SGD → Points</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-xs text-purple-200">Points → USDT</p>
                      <p className="text-lg font-bold">100:1</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-purple-200">USDT → SGD</p>
                      <p className="text-lg font-bold">1:1.35</p>
                    </div>
                  </div>
                  <Button className="bg-white text-purple-600 hover:bg-purple-50">
                    Convert Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Wallets</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Balance</TableHead>
                          <TableHead>Pending</TableHead>
                          <TableHead>KYC Level</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {wallets.map((wallet) => {
                          const Icon = typeIcons[wallet.type];
                          return (
                            <TableRow key={wallet.id}>
                              <TableCell>{wallet.user}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Icon className="w-4 h-4" />
                                  <span className="capitalize">{wallet.type}</span>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                {wallet.currency === 'PTS' ? wallet.balance.toLocaleString() : `$${wallet.balance.toLocaleString()}`}
                                <span className="text-slate-400 ml-1">{wallet.currency}</span>
                              </TableCell>
                              <TableCell className="text-amber-600">
                                {wallet.pending > 0 ? `$${wallet.pending.toLocaleString()}` : '-'}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Shield className="w-4 h-4 text-slate-400" />
                                  <span>Level {wallet.kyc_level}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={statusColors[wallet.status]}>{wallet.status}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <ArrowUpRight className="w-4 h-4 mr-1" />
                                    Top-up
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <ArrowDownLeft className="w-4 h-4 mr-1" />
                                    Withdraw
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
              </TabsContent>

              <TabsContent value="transactions">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell>{tx.date}</TableCell>
                            <TableCell>{tx.user}</TableCell>
                            <TableCell className="capitalize">{tx.type}</TableCell>
                            <TableCell className="font-medium">
                              {tx.currency === 'PTS' ? tx.amount.toLocaleString() : `$${tx.amount.toLocaleString()}`} {tx.currency}
                            </TableCell>
                            <TableCell className="text-slate-500">{tx.conversion || '-'}</TableCell>
                            <TableCell>
                              <Badge className={statusColors[tx.status]}>{tx.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="approvals">
                <Card className="p-8 text-center">
                  <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">3 Pending Approvals</h3>
                  <p className="text-slate-500 mb-4">Withdrawal requests requiring admin approval</p>
                  <Button className="bg-lime-500 hover:bg-lime-600">Review All</Button>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  );
}