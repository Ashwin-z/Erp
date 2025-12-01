import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, BrainCircuit, Calendar, Download, 
  FileText, Mail, RefreshCw, Sparkles, PieChart, ChevronLeft
} from 'lucide-react';

export default function AIReporting() {
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState('pnl');
  const [aiSummary, setAiSummary] = useState(null);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setAiSummary("Revenue grew by 14% MoM, driven primarily by the 'Solar Farm' crowdfunding project. Operating expenses stabilized despite increased ad spend. Recommendation: Reallocate surplus cash to short-term yield instruments.");
    }, 2000);
  };

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-slate-400 hover:text-white hover:bg-slate-800">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BrainCircuit className="w-8 h-8 text-violet-400" />
              AI Financial Intelligence
            </h1>
            <p className="text-slate-400">Automated Reporting & Executive Insights</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="bg-white text-slate-900 hover:bg-slate-100 font-medium border-0">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Reports
          </Button>
          <Button className="bg-violet-600 hover:bg-violet-700" onClick={handleGenerate} disabled={generating}>
            {generating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Generate Analysis
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Report Configuration */}
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader><CardTitle>Report Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="bg-slate-950 border-slate-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pnl">Profit & Loss</SelectItem>
                    <SelectItem value="bs">Balance Sheet</SelectItem>
                    <SelectItem value="cf">Cash Flow</SelectItem>
                    <SelectItem value="custom">Custom Query</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Period</label>
                <Select defaultValue="mtd">
                  <SelectTrigger className="bg-slate-950 border-slate-800">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mtd">Month to Date</SelectItem>
                    <SelectItem value="ytd">Year to Date</SelectItem>
                    <SelectItem value="last_q">Last Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-sm font-bold mb-2">Automation</h4>
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span className="text-sm">Email to Executives</span>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insight Box */}
          {aiSummary && (
            <Card className="bg-gradient-to-br from-violet-900/20 to-slate-900 border-violet-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-violet-400">
                  <Sparkles className="w-5 h-5" /> AI CFO Insight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-slate-200">
                  {aiSummary}
                </p>
                <div className="mt-4 flex gap-2">
                   <Button 
                     size="sm" 
                     className="text-xs font-bold bg-white text-slate-900 hover:bg-slate-100"
                     onClick={() => navigate(createPageUrl('AIInsightDetail'))}
                   >
                     Detailed Breakdown
                   </Button>
                   <Button size="sm" variant="ghost" className="text-xs text-slate-400 hover:text-white hover:bg-slate-800">Dismiss</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Report Preview */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/50 border-slate-800 h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {reportType === 'pnl' ? 'Profit & Loss Statement' : 
                 reportType === 'bs' ? 'Balance Sheet' : 'Financial Report'}
              </CardTitle>
              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                <Download className="w-4 h-4 mr-2" /> Export PDF
              </Button>
            </CardHeader>
            <CardContent>
              {/* Mock Table */}
              <div className="space-y-1">
                <div className="grid grid-cols-3 text-xs font-bold text-slate-500 uppercase p-3 border-b border-slate-800">
                  <span>Line Item</span>
                  <span className="text-right">Amount</span>
                  <span className="text-right">% Change</span>
                </div>
                {[
                  { item: 'Total Revenue', amt: '$145,200', change: '+14%', highlight: true },
                  { item: 'Cost of Goods Sold', amt: '($42,000)', change: '+5%', highlight: false },
                  { item: 'Gross Profit', amt: '$103,200', change: '+18%', highlight: true },
                  { item: 'Operating Expenses', amt: '($35,000)', change: '-2%', highlight: false },
                  { item: 'Marketing Spend', amt: '($12,500)', change: '+10%', highlight: false },
                  { item: 'Net Income', amt: '$55,700', change: '+25%', highlight: true, color: 'text-emerald-400' },
                ].map((row, i) => (
                  <div key={i} className={`grid grid-cols-3 text-sm p-3 border-b border-slate-800/50 last:border-0 ${row.highlight ? 'bg-slate-800/30 font-bold' : ''}`}>
                    <span className="text-slate-300">{row.item}</span>
                    <span className={`text-right ${row.color || 'text-white'}`}>{row.amt}</span>
                    <span className={`text-right ${row.change.startsWith('+') ? 'text-emerald-400' : 'text-slate-400'}`}>{row.change}</span>
                  </div>
                ))}
              </div>

              {/* Visuals */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                 <div className="h-32 bg-slate-800/50 rounded flex items-center justify-center text-slate-500 text-xs">
                   <BarChart3 className="w-6 h-6 mb-2" /> <br/> Revenue Trend
                 </div>
                 <div className="h-32 bg-slate-800/50 rounded flex items-center justify-center text-slate-500 text-xs">
                   <PieChart className="w-6 h-6 mb-2" /> <br/> Expense Breakdown
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}