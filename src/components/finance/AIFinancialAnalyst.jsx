import React, { useState } from 'react';
import { 
  BrainCircuit, TrendingUp, AlertTriangle, Search, 
  MessageSquare, BarChart3, Sparkles 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export default function AIFinancialAnalyst() {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState([
    {
      id: 1,
      type: 'anomaly',
      severity: 'high',
      title: 'Unusual Expense Detected',
      message: 'Travel expenses for Dept: Sales are 45% higher than the 6-month average.',
      action: 'Review recent expense claims',
      date: 'Today, 10:23 AM'
    },
    {
      id: 2,
      type: 'prediction',
      severity: 'medium',
      title: 'Cashflow Forecast',
      message: 'Based on AR aging, projected cash inflow for next week is $12,500, which is below the $15,000 recurring outflow.',
      action: 'View Cashflow Report',
      date: 'Yesterday'
    }
  ]);

  const handleAskAI = async () => {
    if (!query) return;
    setIsAnalyzing(true);
    
    // Simulate AI processing
    setTimeout(() => {
        setInsights(prev => [{
            id: Date.now(),
            type: 'insight',
            severity: 'info',
            title: 'AI Response',
            message: `Analysis for "${query}": I found 3 invoices related to this query. The total trend shows a 12% increase month-over-month.`,
            action: 'View Details',
            date: 'Just now'
        }, ...prev]);
        setQuery('');
        setIsAnalyzing(false);
        toast.success("Insight generated");
    }, 1500);
  };

  return (
    <Card className="h-full border-indigo-100 bg-gradient-to-b from-white to-indigo-50/30">
      <CardHeader>
        <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg">
                <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
                <CardTitle>AI Financial Analyst</CardTitle>
                <CardDescription>Real-time anomaly detection & forecasting</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Query Input */}
        <div className="flex gap-2">
            <Input 
                placeholder="Ask about trends, variances, or specific accounts..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                className="bg-white"
            />
            <Button 
                onClick={handleAskAI} 
                disabled={isAnalyzing}
                className="bg-indigo-600 hover:bg-indigo-700"
            >
                {isAnalyzing ? <Sparkles className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
        </div>

        {/* Insights Stream */}
        <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Insights</h4>
            <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                    {insights.map(item => (
                        <div key={item.id} className="bg-white p-3 rounded-lg border shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    {item.type === 'anomaly' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                                    {item.type === 'prediction' && <TrendingUp className="w-4 h-4 text-blue-500" />}
                                    {item.type === 'insight' && <MessageSquare className="w-4 h-4 text-emerald-500" />}
                                    <span className={`text-sm font-medium ${
                                        item.severity === 'high' ? 'text-red-700' : 
                                        item.severity === 'medium' ? 'text-amber-700' : 'text-slate-700'
                                    }`}>
                                        {item.title}
                                    </span>
                                </div>
                                <span className="text-[10px] text-slate-400">{item.date}</span>
                            </div>
                            <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                                {item.message}
                            </p>
                            {item.action && (
                                <Button variant="link" className="h-auto p-0 text-xs text-indigo-600">
                                    {item.action} →
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
            <Button variant="outline" size="sm" className="text-xs justify-start">
                <BarChart3 className="w-3 h-3 mr-2 text-slate-500" /> Forecast Cashflow
            </Button>
            <Button variant="outline" size="sm" className="text-xs justify-start">
                <AlertTriangle className="w-3 h-3 mr-2 text-slate-500" /> Scan for Fraud
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}