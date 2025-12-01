import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const metricLabels = {
  productivity_score: { label: 'Productivity', icon: '⚡' },
  quality_score: { label: 'Quality', icon: '✨' },
  timeliness_score: { label: 'Timeliness', icon: '⏰' },
  collaboration_score: { label: 'Collaboration', icon: '🤝' },
  innovation_score: { label: 'Innovation', icon: '💡' },
  learning_score: { label: 'Learning', icon: '📚' },
  efficiency_score: { label: 'Efficiency', icon: '🎯' },
  reliability_score: { label: 'Reliability', icon: '🔒' }
};

export default function KPIScoreCard({ metrics, previousMetrics }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-lime-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getTrend = (current, previous) => {
    if (!previous) return null;
    const diff = current - previous;
    if (diff > 0) return { icon: TrendingUp, color: 'text-green-500', value: `+${diff.toFixed(1)}` };
    if (diff < 0) return { icon: TrendingDown, color: 'text-red-500', value: diff.toFixed(1) };
    return { icon: Minus, color: 'text-slate-400', value: '0' };
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(metricLabels).map(([key, { label, icon }]) => {
        const score = metrics?.[key] || 0;
        const prevScore = previousMetrics?.[key];
        const trend = getTrend(score, prevScore);

        return (
          <Card key={key}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{icon}</span>
                {trend && (
                  <div className={`flex items-center gap-1 text-xs ${trend.color}`}>
                    <trend.icon className="w-3 h-3" />
                    {trend.value}
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-500 mb-1">{label}</p>
              <div className="flex items-center gap-2">
                <Progress value={score} className={`h-2 flex-1`} />
                <span className="text-lg font-bold">{score}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}