import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Sparkles, AlertTriangle, TrendingUp, Lightbulb, Lock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AIInsightsWidget({ widget }) {
  const insights = widget.data?.insights || [
    { type: 'warning', message: '3 tasks at risk of delay', icon: AlertTriangle },
    { type: 'opportunity', message: 'Sales trending 15% above target', icon: TrendingUp },
    { type: 'suggestion', message: 'Consider reassigning 2 tasks from John', icon: Lightbulb }
  ];
  const isPrivate = widget.visibility === 'private';

  return (
    <Card className="h-full hover:shadow-lg transition-all border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-600" />
          {widget.title || 'AI Insights'}
          <Sparkles className="w-3 h-3 text-purple-400" />
          {isPrivate && <Lock className="w-3 h-3 text-slate-400 ml-auto" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        {insights.map((insight, i) => (
          <div 
            key={i}
            className={`p-2 rounded-lg text-sm flex items-start gap-2 ${
              insight.type === 'warning' ? 'bg-amber-100' :
              insight.type === 'opportunity' ? 'bg-green-100' : 'bg-blue-100'
            }`}
          >
            <insight.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
              insight.type === 'warning' ? 'text-amber-600' :
              insight.type === 'opportunity' ? 'text-green-600' : 'text-blue-600'
            }`} />
            <span>{insight.message}</span>
          </div>
        ))}
        <Button variant="ghost" size="sm" className="w-full text-purple-600">
          View All Insights
        </Button>
      </CardContent>
    </Card>
  );
}