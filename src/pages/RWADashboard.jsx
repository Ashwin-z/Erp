import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Rocket, TrendingUp, DollarSign, Users, 
  Zap, Target, Megaphone, Globe, 
  ArrowUpRight, PlayCircle, BarChart3
} from 'lucide-react';

export default function RWADashboard() {
  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Rocket className="w-8 h-8 text-orange-500" />
            RWA Revenue Engine
          </h1>
          <p className="text-slate-400">AI-Powered Asset Marketing & Crowdfunding</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-700 text-orange-400 hover:bg-slate-900">
            <Zap className="w-4 h-4 mr-2" />
            Run 10x Growth Loop
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Megaphone className="w-4 h-4 mr-2" />
            New Ad Campaign
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Predicted Daily Rev', value: '$14,500', change: '+12%', icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Crowdfund Progress', value: '68%', change: '+$250k', icon: Users, color: 'text-blue-400' },
          { label: 'Active Ads', value: '15', change: '3.5x ROAS', icon: Target, color: 'text-purple-400' },
          { label: 'Pending Investors', value: '45', change: 'KYC Ready', icon: Globe, color: 'text-orange-400' },
        ].map((stat, idx) => (
          <Card key={idx} className="bg-slate-900/50 border-slate-800 backdrop-blur">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className={`text-xs font-bold flex items-center ${stat.color}`}>
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  {stat.change}
                </p>
              </div>
              <stat.icon className={`w-8 h-8 opacity-20 ${stat.color.replace('text-', 'bg-')}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart / AI Feed */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Real-Time AI Actions</CardTitle>
              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                System Active
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { agent: 'Growth Agent', action: 'Optimized Ad Bids', details: 'Increased budget for "Tech ETF" campaign by 15% due to high CTR.', time: '2 mins ago' },
                  { agent: 'Deal Matcher', action: 'Investor Matched', details: 'Found 5 high-fit investors for "Marina Bay Rental" project.', time: '15 mins ago' },
                  { agent: 'Pricing Bot', action: 'Dynamic Discount', details: 'Applied 5% limited-time offer to "Office Equipment" asset.', time: '1 hour ago' },
                ].map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-200">{log.agent}</span>
                        <Badge variant="secondary" className="text-[10px] h-5">{log.action}</Badge>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{log.details}</p>
                      <p className="text-[10px] text-slate-600 mt-1">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
             <Card className="bg-slate-900/50 border-slate-800">
               <CardHeader><CardTitle className="text-base">Asset Performance</CardTitle></CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   {['Luxury Villa Token', 'Logistics Fleet A', 'Green Bond 2025'].map(asset => (
                     <div key={asset} className="flex justify-between items-center text-sm">
                       <span>{asset}</span>
                       <div className="flex items-center gap-2">
                         <span className="text-emerald-400">+8.4%</span>
                         <BarChart3 className="w-4 h-4 text-slate-500" />
                       </div>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>
             
             <Card className="bg-slate-900/50 border-slate-800">
               <CardHeader><CardTitle className="text-base">Affiliate Leaderboard</CardTitle></CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   {[
                     { name: 'CryptoCompare', rev: '$12,500' },
                     { name: 'InvestSg Blog', rev: '$8,200' },
                     { name: 'Agent Smith', rev: '$5,400' }
                   ].map((aff, i) => (
                     <div key={i} className="flex justify-between items-center text-sm">
                       <div className="flex items-center gap-2">
                         <Badge className="w-5 h-5 p-0 flex items-center justify-center">{i+1}</Badge>
                         <span>{aff.name}</span>
                       </div>
                       <span className="font-bold text-orange-400">{aff.rev}</span>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Live Projects */}
          <Card className="bg-slate-900/50 border-slate-800">
             <CardHeader>
               <CardTitle>Crowdfund Projects</CardTitle>
               <CardDescription>3 Active • 2 Pending</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
               {[
                 { name: 'Solar Farm Phase 1', funded: 85, target: '$500k' },
                 { name: 'Urban Retail Fund', funded: 42, target: '$1.2M' },
               ].map((proj, idx) => (
                 <div key={idx}>
                   <div className="flex justify-between text-sm mb-2">
                     <span className="font-medium">{proj.name}</span>
                     <span className="text-emerald-400 font-bold">{proj.funded}%</span>
                   </div>
                   <Progress value={proj.funded} className="h-2 bg-slate-800" />
                   <p className="text-xs text-slate-500 mt-1 text-right">Target: {proj.target}</p>
                 </div>
               ))}
               <Button className="w-full bg-blue-600 hover:bg-blue-700">
                 <Rocket className="w-4 h-4 mr-2" />
                 Launch New Project
               </Button>
             </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="bg-gradient-to-br from-orange-900/20 to-slate-900 border-orange-500/30 border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <Zap className="w-5 h-5" />
                Growth Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <h4 className="font-bold text-sm text-orange-200">Launch "Early Bird" Tier</h4>
                <p className="text-xs text-slate-400 mt-1">AI predicts 15% faster funding for Solar Farm if 5% discount offered today.</p>
                <Button size="sm" variant="ghost" className="w-full mt-2 h-7 text-orange-400 hover:bg-orange-500/20">Auto-Execute</Button>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                 <h4 className="font-bold text-sm text-blue-200">SME Upsell</h4>
                 <p className="text-xs text-slate-400 mt-1">3 Mid-tier SMEs qualify for Premium. Send automated invite?</p>
                 <Button size="sm" variant="ghost" className="w-full mt-2 h-7 text-blue-400 hover:bg-blue-500/20">Send Invites</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}