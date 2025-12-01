import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Share2, TrendingUp, ArrowUpRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AIInsightDetail() {
  const navigate = useNavigate();

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-slate-400 hover:text-white hover:bg-slate-800">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Revenue Growth Analysis
              <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/50">AI Generated</Badge>
            </h1>
            <p className="text-slate-400">Generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-700 text-slate-300">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <Button className="bg-white text-slate-900 hover:bg-slate-100 font-medium border-0">
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">Executive Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                Revenue has demonstrated a strong upward trajectory, growing by <span className="text-emerald-400 font-bold">14% Month-over-Month (MoM)</span>. 
                This growth is primarily attributed to the successful launch and funding of the 'Solar Farm' crowdfunding project, which exceeded initial targets by 25%.
              </p>
              <p>
                Despite a planned 10% increase in advertising spend to support the Solar Farm launch, overall operating expenses have stabilized. 
                Efficiencies in automated vendor management and reduced administrative overhead contributed to this balance.
              </p>
              <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-lg mt-4">
                <h4 className="text-violet-300 font-bold mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> AI Recommendation
                </h4>
                <p className="text-sm text-slate-300">
                  With the current cash surplus from the revenue spike, it is recommended to reallocate approximately <strong>$50,000</strong> into short-term, high-yield instruments to maximize capital efficiency while maintaining liquidity for upcoming project phases.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">Key Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Solar Farm Crowdfunding", impact: "+$45,000", type: "positive", desc: "Exceeded funding cap in 48 hours." },
                  { name: "Ad Spend Efficiency", impact: "+12% ROAS", type: "positive", desc: "AI-optimized bidding reduced CPC by 15%." },
                  { name: "Legacy Server Costs", impact: "-$2,400", type: "negative", desc: "Unused instances identified for termination." }
                ].map((driver, i) => (
                  <div key={i} className="flex items-start justify-between p-4 rounded-lg bg-slate-950 border border-slate-800">
                    <div>
                      <h5 className="font-bold text-slate-200">{driver.name}</h5>
                      <p className="text-sm text-slate-500 mt-1">{driver.desc}</p>
                    </div>
                    <div className={`text-right ${driver.type === 'positive' ? 'text-emerald-400' : 'text-red-400'}`}>
                      <span className="font-bold block">{driver.impact}</span>
                      <Badge variant="outline" className={`mt-1 border-0 ${driver.type === 'positive' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {driver.type === 'positive' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowUpRight className="w-3 h-3 mr-1 rotate-180" />}
                        Impact
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm text-slate-400 uppercase">Confidence Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-2">
                <div className="text-4xl font-bold text-white">94%</div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">High Confidence</Badge>
              </div>
              <p className="text-xs text-slate-500">Based on 12,400+ data points from GL, Sales, and Market Data.</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm text-slate-400 uppercase">Related Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Cash Flow Positive</p>
                  <p className="text-xs text-slate-500">3 consecutive months</p>
                </div>
              </div>
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Budget Variance</p>
                  <p className="text-xs text-slate-500">Marketing +5% over budget</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}