import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Link2, DollarSign, Copy, 
  TrendingUp, Share2 
} from 'lucide-react';

export default function AffiliateCenter() {
  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            Affiliate Partner Center
          </h1>
          <p className="text-slate-400">Earn commissions by referring investors & SMEs</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Unpaid Earnings</p>
          <h2 className="text-2xl font-bold text-emerald-400">$1,250.00</h2>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Links */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader><CardTitle>Your Referral Links</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'General Invite', url: 'arktira.com/join?ref=USER123' },
                { label: 'SME Deal: 50% Off', url: 'arktira.com/sme-promo?ref=USER123' },
                { label: 'Crowdfund: Solar Farm', url: 'arktira.com/project/solar?ref=USER123' },
              ].map((link, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div>
                    <p className="text-sm font-bold text-slate-300">{link.label}</p>
                    <p className="text-xs text-blue-400 truncate w-64">{link.url}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-8 border-slate-700"><Copy className="w-3 h-3" /></Button>
                    <Button size="sm" variant="outline" className="h-8 border-slate-700"><Share2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader><CardTitle>Performance History</CardTitle></CardHeader>
            <CardContent>
               <div className="space-y-2">
                 <div className="grid grid-cols-4 text-xs font-bold text-slate-500 uppercase mb-2">
                   <span>Date</span>
                   <span>Referral</span>
                   <span>Action</span>
                   <span className="text-right">Commission</span>
                 </div>
                 {[
                   { date: 'Nov 28', ref: 'Mike Ross', action: 'SME Signup', comm: '+$50.00' },
                   { date: 'Nov 27', ref: 'Anon User', action: 'Investment', comm: '+$12.50' },
                   { date: 'Nov 25', ref: 'Jane Doe', action: 'SME Signup', comm: '+$50.00' },
                 ].map((row, i) => (
                   <div key={i} className="grid grid-cols-4 text-sm py-2 border-b border-slate-800/50 last:border-0">
                     <span className="text-slate-400">{row.date}</span>
                     <span className="text-white">{row.ref}</span>
                     <span className="text-slate-300">{row.action}</span>
                     <span className="text-right text-emerald-400 font-bold">{row.comm}</span>
                   </div>
                 ))}
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
           <Card className="bg-slate-900/50 border-slate-800">
             <CardContent className="p-6 space-y-6">
               <div>
                 <p className="text-xs text-slate-400 uppercase">Total Clicks</p>
                 <h3 className="text-2xl font-bold">1,540</h3>
                 <Progress value={70} className="h-1 mt-2 bg-slate-800" />
               </div>
               <div>
                 <p className="text-xs text-slate-400 uppercase">Signups</p>
                 <h3 className="text-2xl font-bold">42</h3>
                 <Progress value={30} className="h-1 mt-2 bg-slate-800" />
               </div>
               <div>
                 <p className="text-xs text-slate-400 uppercase">Conversion Rate</p>
                 <h3 className="text-2xl font-bold text-blue-400">2.7%</h3>
               </div>
             </CardContent>
           </Card>

           <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl text-white">
             <h4 className="font-bold mb-1">Boost Your Earnings</h4>
             <p className="text-xs text-blue-100 mb-3">
               Share our new "SME Growth Kit" e-book and earn $100 per qualified lead!
             </p>
             <Button size="sm" variant="secondary" className="w-full text-blue-900 font-bold">Get Promo Materials</Button>
           </div>
        </div>
      </div>
    </div>
  );
}