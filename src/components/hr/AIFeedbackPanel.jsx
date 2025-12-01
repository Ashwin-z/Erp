import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, AlertTriangle, BookOpen, Target } from 'lucide-react';

export default function AIFeedbackPanel({ kpiData }) {
  const { strengths = [], weaknesses = [], training_recommendations = [], ai_feedback, ai_action_plan } = kpiData || {};

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Strengths & Weaknesses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="w-5 h-5 text-lime-500" />
            AI Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Strengths
            </p>
            <div className="flex flex-wrap gap-2">
              {strengths.map((s, i) => (
                <Badge key={i} className="bg-green-100 text-green-700">{s}</Badge>
              ))}
              {strengths.length === 0 && <span className="text-sm text-slate-400">Analyzing...</span>}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-amber-700 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Areas for Improvement
            </p>
            <div className="flex flex-wrap gap-2">
              {weaknesses.map((w, i) => (
                <Badge key={i} className="bg-amber-100 text-amber-700">{w}</Badge>
              ))}
              {weaknesses.length === 0 && <span className="text-sm text-slate-400">Analyzing...</span>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="w-5 h-5 text-blue-500" />
            Training Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {training_recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Target className="w-4 h-4 text-blue-500 mt-0.5" />
                <span className="text-sm">{rec}</span>
              </li>
            ))}
            {training_recommendations.length === 0 && (
              <p className="text-sm text-slate-400">AI is analyzing your performance data...</p>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* AI Feedback */}
      {ai_feedback && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="w-5 h-5 text-purple-500" />
              AI Personal Coach Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
              <p className="text-slate-700 leading-relaxed">{ai_feedback}</p>
            </div>
            {ai_action_plan && (
              <div className="mt-4 p-4 border border-lime-200 bg-lime-50 rounded-lg">
                <p className="text-sm font-medium text-lime-800 mb-2">📋 Your Action Plan</p>
                <p className="text-sm text-slate-700">{ai_action_plan}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}