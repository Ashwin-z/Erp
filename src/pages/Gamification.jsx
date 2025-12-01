import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, Gift, Star, TrendingUp, Users, 
  Wallet, ArrowUpRight, Sparkles 
} from 'lucide-react';

export default function Gamification() {
  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            KPI & Rewards Engine
          </h1>
          <p className="text-slate-400">Incentivize performance for Clients, Vendors & Employees</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold">Reward Pool: 50,000 Tokens</span>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">Configure Rules</Button>
        </div>
      </div>

      {/* Dashboards per Persona */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        
        {/* Employee */}
        <Card className="bg-gradient-to-br from-blue-900/20 to-slate-900 border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" /> Employee Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-bold">Sarah Chen</p>
                <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 mt-1">Top Performer</Badge>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Points</p>
                <p className="text-xl font-bold text-yellow-400">2,450</p>
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>On-Time Payroll</span>
                <span className="text-emerald-400">+500</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Project Delivery</span>
                <span className="text-emerald-400">+200</span>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full border-blue-500/30 text-blue-400">View All</Button>
          </CardContent>
        </Card>

        {/* Vendor */}
        <Card className="bg-gradient-to-br from-emerald-900/20 to-slate-900 border-emerald-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-emerald-400" /> Vendor Scorecard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-2">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 mb-2">
                 <span className="text-2xl font-bold text-emerald-400">A+</span>
               </div>
               <p className="font-bold">TechSupplies Pte Ltd</p>
            </div>
            <div className="space-y-2">
               <div className="flex justify-between text-xs">
                 <span>Delivery Speed</span>
                 <Progress value={95} className="w-24 h-2 bg-slate-800" />
               </div>
               <div className="flex justify-between text-xs">
                 <span>Early Payment Bonus</span>
                 <span className="font-bold text-yellow-400">Gold Tier</span>
               </div>
            </div>
            <Button size="sm" variant="outline" className="w-full border-emerald-500/30 text-emerald-400">Manage Vendors</Button>
          </CardContent>
        </Card>

        {/* Client */}
        <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-400" /> Client Loyalty
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center font-bold text-white">TC</div>
              <div>
                <p className="font-bold">Tech Corp</p>
                <p className="text-xs text-slate-400">Diamond Member</p>
              </div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-purple-500/20">
              <p className="text-xs text-slate-500 mb-1">Next Reward</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm">5% Service Discount</span>
                <span className="text-xs text-purple-400">80% Progress</span>
              </div>
              <Progress value={80} className="h-1.5 mt-2 bg-slate-800" />
            </div>
            <Button size="sm" variant="outline" className="w-full border-purple-500/30 text-purple-400">View Rewards</Button>
          </CardContent>
        </Card>

      </div>

      {/* Active Rules */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle>Active Reward Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { trigger: 'Early Payment (< 5 Days)', reward: '2% Discount Credit', target: 'Vendor' },
              { trigger: 'Zero Defect Delivery', reward: '500 Reputation Points', target: 'Vendor' },
              { trigger: 'Referral Success', reward: '$500 Commission', target: 'Partner' },
              { trigger: 'Quarterly KPI Met', reward: 'Performance Bonus', target: 'Employee' },
            ].map((rule, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-bold text-sm">{rule.trigger}</p>
                    <p className="text-xs text-slate-400">Target: {rule.target}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-slate-800">{rule.reward}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}