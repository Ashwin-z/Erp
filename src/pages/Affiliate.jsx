import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Users, DollarSign, QrCode, Link2, TrendingUp, Gift,
  Copy, Download, Eye, Award, ChevronRight
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import SOPGuide from '../components/modules/SOPGuide';
import ModuleDashboard from '../components/modules/ModuleDashboard';

const affiliateSOP = {
  title: "Affiliate Program Workflow",
  description: "Signup → Share → Track → Earn",
  steps: [
    { name: "Signup", description: "Register as an affiliate partner.", checklist: ["Create account", "Verify identity", "Accept terms", "Get affiliate code"] },
    { name: "Share", description: "Share referral links and promotions.", checklist: ["Get referral link", "Generate QR code", "Share on channels", "Track clicks"] },
    { name: "Track", description: "Monitor referrals and conversions.", checklist: ["View referrals", "Track conversions", "Monitor tiers", "Check earnings"] },
    { name: "Earn", description: "Receive commission payouts.", checklist: ["Accumulate commission", "Request payout", "Choose wallet", "Receive funds"] }
  ]
};

export default function Affiliate() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Affiliates', value: 156, icon: Users, color: 'bg-blue-500', trend: 12 },
    { label: 'Total Referrals', value: 892, icon: Link2, color: 'bg-green-500', trend: 25 },
    { label: 'Commission Paid', value: '$45.2K', icon: DollarSign, color: 'bg-purple-500', trend: 18 },
    { label: 'Pending Payout', value: '$8.5K', icon: Gift, color: 'bg-amber-500', trend: 8 }
  ];

  const affiliates = [
    { id: 1, name: 'John Tan', email: 'john@partner.com', code: 'JOHN2024', tier: 1, referrals: 45, commission: 4500, pending: 850, status: 'active' },
    { id: 2, name: 'Lisa Wong', email: 'lisa@partner.com', code: 'LISA2024', tier: 1, referrals: 32, commission: 3200, pending: 450, status: 'active' },
    { id: 3, name: 'David Lee', email: 'david@partner.com', code: 'DAVID24', tier: 2, referrals: 28, commission: 2100, pending: 320, status: 'active' },
    { id: 4, name: 'Emily Chen', email: 'emily@partner.com', code: 'EMILY24', tier: 2, referrals: 15, commission: 1125, pending: 180, status: 'pending' }
  ];

  const tierStructure = [
    { tier: 1, name: 'Direct Referral', rate: 10, description: 'Commission on direct referrals' },
    { tier: 2, name: 'Second Level', rate: 5, description: 'Commission on referrals from your referrals' },
    { tier: 3, name: 'Third Level', rate: 2, description: 'Commission on 3rd level referrals' }
  ];

  const promotions = [
    { id: 1, name: 'New Year Bonus', description: '2x commission for January signups', multiplier: 2, status: 'active', expires: '2025-01-31' },
    { id: 2, name: 'First 10 Bonus', description: 'Extra $50 for first 10 referrals', bonus: 50, status: 'active', expires: '2025-12-31' }
  ];

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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Affiliate Program</h1>
                <p className="text-slate-500">3-tier affiliate tracking with points and commission</p>
              </div>
              <Button className="bg-lime-500 hover:bg-lime-600">
                <Users className="w-4 h-4 mr-2" />
                Add Affiliate
              </Button>
            </div>

            <SOPGuide {...affiliateSOP} />
            <ModuleDashboard stats={stats} />

            {/* Referral Link Card */}
            <Card className="mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Your Referral Link</h3>
                    <p className="text-purple-200 font-mono text-sm">https://arkfinex.com/ref/ADMIN2024</p>
                  </div>
                  <div className="flex gap-3">
                    <Button className="bg-white/20 hover:bg-white/30">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                    <Button className="bg-white/20 hover:bg-white/30">
                      <QrCode className="w-4 h-4 mr-2" />
                      QR Code
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Affiliates</TabsTrigger>
                <TabsTrigger value="tiers">Tier Structure</TabsTrigger>
                <TabsTrigger value="promotions">Promotions</TabsTrigger>
                <TabsTrigger value="payouts">Payouts</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Affiliate</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Tier</TableHead>
                          <TableHead>Referrals</TableHead>
                          <TableHead>Commission</TableHead>
                          <TableHead>Pending</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {affiliates.map((affiliate) => (
                          <TableRow key={affiliate.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{affiliate.name}</p>
                                <p className="text-xs text-slate-500">{affiliate.email}</p>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono">{affiliate.code}</TableCell>
                            <TableCell>
                              <Badge variant="outline">Tier {affiliate.tier}</Badge>
                            </TableCell>
                            <TableCell>{affiliate.referrals}</TableCell>
                            <TableCell className="text-green-600">${affiliate.commission.toLocaleString()}</TableCell>
                            <TableCell className="text-amber-600">${affiliate.pending.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge className={affiliate.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                                {affiliate.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tiers">
                <div className="grid md:grid-cols-3 gap-6">
                  {tierStructure.map((tier) => (
                    <Card key={tier.tier} className={tier.tier === 1 ? 'border-lime-300 bg-lime-50' : ''}>
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                          <Award className={`w-8 h-8 ${tier.tier === 1 ? 'text-lime-500' : 'text-slate-400'}`} />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">{tier.name}</h3>
                        <p className="text-3xl font-bold text-lime-600 mb-2">{tier.rate}%</p>
                        <p className="text-sm text-slate-500">{tier.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="promotions">
                <div className="grid md:grid-cols-2 gap-6">
                  {promotions.map((promo) => (
                    <Card key={promo.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{promo.name}</h3>
                            <p className="text-slate-500">{promo.description}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-700">{promo.status}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <span>Expires: {promo.expires}</span>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  );
}