import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Globe, Users, Clock, ShieldCheck, 
  Coins, FileText, Share2, PlayCircle 
} from 'lucide-react';

export default function CrowdfundProject() {
  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video bg-slate-800 rounded-xl overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <PlayCircle className="w-16 h-16 text-white" />
            </div>
            {/* Placeholder Image */}
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center text-slate-500">
              Project Video / Render
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-blue-500">Real Estate</Badge>
              <Badge variant="outline" className="text-emerald-400 border-emerald-500">Verified Asset</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">Marina Bay Solar Farm - Phase 1</h1>
            <p className="text-slate-400 leading-relaxed">
              Participate in Singapore's largest floating solar farm initiative. 
              Projected yield 8-12% APY backed by long-term government power purchase agreements.
            </p>
          </div>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader><CardTitle>Project Highlights</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-slate-300">Insurance Backed</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-slate-300">10 Year Term</span>
              </div>
              <div className="flex items-center gap-3">
                <Coins className="w-5 h-5 text-orange-400" />
                <span className="text-sm text-slate-300">Monthly Payouts</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-slate-300">1,240 Backers</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Funding Status */}
        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-800 shadow-xl">
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Raised</p>
                <h2 className="text-4xl font-bold text-emerald-400">$425,000</h2>
                <p className="text-xs text-slate-500 mt-1">of $500,000 Goal</p>
              </div>
              
              <div className="space-y-2">
                <Progress value={85} className="h-3 bg-slate-800" />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>85% Funded</span>
                  <span>5 Days Left</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-sm text-white">Select Tier</h4>
                {[
                  { name: 'Seed', amount: '$100', perk: 'Early Access' },
                  { name: 'Core', amount: '$1,000', perk: '+ Bonus Yield 0.5%' },
                  { name: 'Whale', amount: '$10,000', perk: '+ VIP Events' },
                ].map(tier => (
                  <div key={tier.name} className="p-3 border border-slate-700 rounded-lg hover:border-blue-500 cursor-pointer bg-slate-950 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm">{tier.name}</p>
                      <p className="text-xs text-slate-400">{tier.perk}</p>
                    </div>
                    <span className="font-bold text-emerald-400">{tier.amount}</span>
                  </div>
                ))}
              </div>

              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold text-lg h-12">
                Pledge Now
              </Button>
              <p className="text-center text-xs text-slate-500">Secure payment via Stripe / Crypto</p>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button variant="outline" className="flex-1 border-slate-700"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
            <Button variant="outline" className="flex-1 border-slate-700"><FileText className="w-4 h-4 mr-2" /> Docs</Button>
          </div>
        </div>
      </div>
    </div>
  );
}