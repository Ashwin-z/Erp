import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles, RefreshCw, Copy, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle2, Lightbulb, BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

export default function AIReportInsights({ reportData, onInsertInsight }) {
  const [generating, setGenerating] = useState(false);
  const [insights, setInsights] = useState([
    { id: 1, type: 'trend', title: 'RVU Growth Trend', content: 'RVU generation increased by 15.2% compared to last period, driven primarily by invoice payments (+23%) and new member signups.', confidence: 94 },
    { id: 2, type: 'anomaly', title: 'Unusual Activity Detected', content: 'Transaction volume on Nov 15 was 3.2x higher than the 30-day average. This coincides with the promotional campaign launch.', confidence: 87 },
    { id: 3, type: 'recommendation', title: 'Optimization Opportunity', content: 'Consider increasing referral bonus weights by 10-15% to capitalize on the current growth momentum in new signups.', confidence: 78 }
  ]);
  const [summary, setSummary] = useState('');

  const generateInsights = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    setSummary('This period shows strong overall performance with RVU generation up 15.2%. Key drivers include increased invoice payment activity and successful member acquisition. The fraud detection rate remains low at 0.3%, indicating healthy platform activity. Recommendation: Focus on scaling referral programs to maintain growth trajectory.');
    setGenerating(false);
    toast.success('AI insights generated');
  };

  const insertToReport = (insight) => {
    onInsertInsight?.(insight);
    toast.success('Insight added to report');
  };

  const typeConfig = {
    trend: { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    anomaly: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/20' },
    recommendation: { icon: Lightbulb, color: 'text-cyan-400', bg: 'bg-cyan-500/20' }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-400" />
          AI-Powered Insights
        </h3>
        <Button size="sm" onClick={generateInsights} disabled={generating} className="bg-violet-500 hover:bg-violet-400">
          {generating ? <RefreshCw className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
          {generating ? 'Generating...' : 'Generate Insights'}
        </Button>
      </div>

      {summary && (
        <Card className="bg-violet-500/10 border-violet-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-violet-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-violet-400 font-medium text-sm mb-1">Executive Summary</p>
                <p className="text-slate-300 text-sm">{summary}</p>
                <Button size="sm" variant="ghost" className="mt-2 text-violet-400" onClick={() => insertToReport({ type: 'summary', content: summary })}>
                  <Copy className="w-3 h-3 mr-1" />
                  Insert to Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {insights.map((insight) => {
          const config = typeConfig[insight.type];
          const Icon = config.icon;
          return (
            <Card key={insight.id} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-medium text-sm">{insight.title}</p>
                      <Badge className="bg-slate-700 text-slate-300 text-xs">{insight.confidence}% confidence</Badge>
                    </div>
                    <p className="text-slate-400 text-sm">{insight.content}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => insertToReport(insight)}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}