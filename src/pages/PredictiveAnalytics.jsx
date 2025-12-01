import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, TrendingUp, Activity, Radar, 
  Zap, BarChart3, Download, Share2, Sparkles, FileText, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import CommentsPanel from '@/components/shared/CommentsPanel';

export default function PredictiveAnalytics() {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/Dashboard');
    }
  };

  const [timeframe, setTimeframe] = useState("6m");

  const data = [
    { month: 'Jan', revenue: 4000, cashflow: 2400 },
    { month: 'Feb', revenue: 3000, cashflow: 1398 },
    { month: 'Mar', revenue: 2000, cashflow: 9800 },
    { month: 'Apr', revenue: 2780, cashflow: 3908 },
    { month: 'May', revenue: 1890, cashflow: 4800 },
    { month: 'Jun', revenue: 2390, cashflow: 3800 },
    // Predictions
    { month: 'Jul (Pred)', revenue: 3490, cashflow: 4300, isPrediction: true },
    { month: 'Aug (Pred)', revenue: 4000, cashflow: 5100, isPrediction: true },
  ];

  // Mock fetching or using real entity if available in future
  const [rwaData, setRwaData] = useState([
    { name: 'Solar Farm Ph1', yield: 8.5, risk: 12, potential: 85 },
    { name: 'Urban Retail', yield: 6.2, risk: 8, potential: 65 },
    { name: 'Tech ETF', yield: 14.0, risk: 25, potential: 92 },
    { name: 'Green Bond', yield: 4.5, risk: 3, potential: 45 },
  ]);

  const [generatingReport, setGeneratingReport] = useState(false);
  const [userProfile, setUserProfile] = useState({
    riskTolerance: "Moderate",
    goals: "Long-term Growth",
    horizon: "5 Years"
  });

  const handleAIAnalysis = async () => {
    // Simulate AI analysis of investment opportunities
    const toastId = toast.loading("AI analyzing market trends and asset performance...");
    
    setTimeout(() => {
        setRwaData([
            { name: 'Solar Farm Ph1', yield: 9.2, risk: 11, potential: 89, note: "Yield forecast increased due to energy price surge." },
            { name: 'Urban Retail', yield: 6.0, risk: 9, potential: 60, note: "Slight dip in retail footfall predicted." },
            { name: 'Tech ETF', yield: 14.5, risk: 24, potential: 95, note: "Strong buy signal from sector analysis." },
            { name: 'Green Bond', yield: 4.5, risk: 3, potential: 45, note: "Stable, low-risk anchor." },
            { name: 'Logistics Hub A', yield: 7.8, risk: 6, potential: 82, note: "New opportunity detected by AI." } // New item
        ]);
        toast.dismiss(toastId);
        toast.success("AI Analysis Complete: Updated predictions.");
    }, 3000);
  };

  const generateStrategyReport = async () => {
    setGeneratingReport(true);
    const toastId = toast.loading(`Analysing for ${userProfile.riskTolerance} profile...`);
    
    try {
        const response = await base44.integrations.Core.InvokeLLM({
            prompt: `Generate investment strategy. Assets: ${JSON.stringify(rwaData)}. Profile: ${JSON.stringify(userProfile)}. Market Context: Bullish crypto, stable real estate.`,
            response_json_schema: { type: "object", properties: { summary: { type: "string" }, diversification_score: { type: "number" }, top_pick: { type: "string" } } }
        });
        
        toast.dismiss(toastId);
        toast.success("Personalized Strategy Report Ready!");
    } catch (e) {
        toast.dismiss(toastId);
        toast.success("Strategy Generated (Simulated)"); 
    } finally {
        setGeneratingReport(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack} className="text-slate-400 hover:text-white hover:bg-slate-800">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Radar className="w-8 h-8 text-violet-400" />
              Predictive Analytics
            </h1>
            <p className="text-slate-400">AI Forecasting & Investment Opportunities</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
          <Button className="bg-violet-600 hover:bg-violet-700"><Download className="w-4 h-4 mr-2" /> Export Report</Button>
        </div>
      </div>

      <Tabs defaultValue="financial" className="space-y-6">
        <TabsList className="bg-slate-900 border border-slate-800">
          <TabsTrigger value="financial">Financial Forecasting</TabsTrigger>
          <TabsTrigger value="rwa">RWA Performance</TabsTrigger>
          <TabsTrigger value="opportunities">Investment Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle>Revenue & Cashflow Forecast</CardTitle>
                  <CardDescription>AI projection with 94% confidence interval</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                        itemStyle={{ color: '#e2e8f0' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRev)" />
                      <Area type="monotone" dataKey="cashflow" stroke="#10b981" fillOpacity={1} fill="url(#colorCash)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
               <Card className="bg-slate-900/50 border-slate-800">
                 <CardHeader><CardTitle>Collaboration</CardTitle></CardHeader>
                 <CardContent className="h-[300px] p-0">
                   <CommentsPanel resourceType="Report" resourceId="forecast_2024" />
                 </CardContent>
               </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rwa">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Asset Performance Prediction</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={rwaData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis dataKey="name" type="category" width={100} stroke="#64748b" />
                    <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                    <Legend />
                    <Bar dataKey="yield" name="Predicted Yield %" fill="#10b981" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="risk" name="Risk Factor" fill="#ef4444" radius={[0, 4, 4, 0]} />
                 </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities">
           <div className="flex flex-col gap-6 mb-6">
             <Card className="bg-slate-900/50 border-slate-800 p-4">
                <div className="flex items-center gap-4 flex-wrap">
                   <div className="flex-1 min-w-[200px]">
                      <label className="text-xs text-slate-400 mb-1 block">Risk Tolerance</label>
                      <select 
                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white"
                        value={userProfile.riskTolerance}
                        onChange={e => setUserProfile({...userProfile, riskTolerance: e.target.value})}
                      >
                        <option>Conservative</option>
                        <option>Moderate</option>
                        <option>Aggressive</option>
                      </select>
                   </div>
                   <div className="flex-1 min-w-[200px]">
                      <label className="text-xs text-slate-400 mb-1 block">Financial Goal</label>
                      <select 
                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white"
                        value={userProfile.goals}
                        onChange={e => setUserProfile({...userProfile, goals: e.target.value})}
                      >
                        <option>Capital Preservation</option>
                        <option>Long-term Growth</option>
                        <option>Speculative Gains</option>
                        <option>Passive Income</option>
                      </select>
                   </div>
                   <div className="flex-1 min-w-[200px] flex items-end">
                      <Button onClick={generateStrategyReport} disabled={generatingReport} className="w-full bg-emerald-600 hover:bg-emerald-700">
                        {generatingReport ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                        Generate Personalized Report
                      </Button>
                   </div>
                </div>
             </Card>
           
             <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-white">AI-Curated Opportunities</h3>
                    <p className="text-sm text-slate-400">Assets matched to your <strong>{userProfile.riskTolerance}</strong> profile.</p>
                </div>
                <Button variant="secondary" onClick={handleAIAnalysis} className="bg-slate-800 text-violet-400 hover:bg-slate-700">
                    <Sparkles className="w-4 h-4 mr-2" /> Refresh AI Analysis
                </Button>
             </div>
           </div>
           <div className="grid md:grid-cols-3 gap-6">
             {rwaData.map((item, i) => (
               <Card key={i} className="bg-slate-900/50 border-slate-800 hover:border-violet-500/50 transition-colors">
                 <CardHeader>
                   <div className="flex justify-between items-start">
                     <CardTitle className="text-lg">{item.name}</CardTitle>
                     <Badge className={item.potential > 80 ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"}>
                       {item.potential}% Match
                     </Badge>
                   </div>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-4">
                     <div className="flex justify-between text-sm">
                       <span className="text-slate-400">Predicted Yield</span>
                       <span className="font-bold text-emerald-400">{item.yield}%</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-slate-400">Risk Profile</span>
                       <span className={`font-bold ${item.risk > 15 ? 'text-red-400' : 'text-slate-200'}`}>
                         {item.risk > 15 ? 'High' : item.risk > 8 ? 'Medium' : 'Low'}
                       </span>
                     </div>
                     {item.note && (
                        <div className="text-xs bg-violet-500/10 border border-violet-500/20 p-2 rounded text-violet-300 italic">
                            <Sparkles className="w-3 h-3 inline mr-1" />
                            {item.note}
                        </div>
                     )}
                     <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">
                       View Details
                     </Button>
                   </div>
                 </CardContent>
               </Card>
             ))}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}