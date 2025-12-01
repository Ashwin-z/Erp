import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  History, ThumbsUp, ThumbsDown, BarChart3, Info, Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';

export default function AIExplainabilityModal({ open, onClose, prediction }) {
  const [feedback, setFeedback] = React.useState('');
  const [feedbackType, setFeedbackType] = React.useState(null);

  if (!prediction) return null;

  const { type, score, factors, historical, recommendation, modelVersion } = prediction;

  const submitFeedback = () => {
    toast.success('Feedback submitted for model retraining');
    setFeedback('');
    setFeedbackType(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            AI Prediction Explainability
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="factors" className="mt-4">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="factors" className="data-[state=active]:bg-cyan-500/20">
              <Lightbulb className="w-4 h-4 mr-2" />
              Key Factors
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-violet-500/20">
              <History className="w-4 h-4 mr-2" />
              Historical
            </TabsTrigger>
            <TabsTrigger value="feedback" className="data-[state=active]:bg-emerald-500/20">
              <ThumbsUp className="w-4 h-4 mr-2" />
              Feedback
            </TabsTrigger>
          </TabsList>

          {/* Key Factors Tab */}
          <TabsContent value="factors" className="mt-4 space-y-4">
            {/* Score Summary */}
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400">Prediction Score</span>
                <Badge className={
                  score >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                  score >= 60 ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }>
                  {score}/100
                </Badge>
              </div>
              <Progress value={score} className="h-3" />
              <p className="text-slate-500 text-xs mt-2">Model: {modelVersion || 'v2.3.1'}</p>
            </div>

            {/* Factor Breakdown */}
            <div className="space-y-3">
              <h4 className="text-white font-medium flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Contributing Factors
              </h4>
              {factors?.map((factor, idx) => (
                <div key={idx} className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {factor.impact > 0 ? (
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      ) : factor.impact < 0 ? (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      ) : (
                        <Info className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="text-white text-sm">{factor.name}</span>
                    </div>
                    <span className={`text-sm font-medium ${
                      factor.impact > 0 ? 'text-emerald-400' : 
                      factor.impact < 0 ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {factor.impact > 0 ? '+' : ''}{factor.impact}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={Math.abs(factor.weight) * 100} 
                      className="h-1.5 flex-1" 
                    />
                    <span className="text-slate-500 text-xs w-12">{(factor.weight * 100).toFixed(0)}% wt</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-2">{factor.explanation}</p>
                </div>
              ))}
            </div>

            {/* Recommendation */}
            {recommendation && (
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div>
                    <p className="text-cyan-400 font-medium">AI Recommendation</p>
                    <p className="text-slate-300 text-sm mt-1">{recommendation}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Historical Comparison Tab */}
          <TabsContent value="history" className="mt-4 space-y-4">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <h4 className="text-white font-medium mb-4">Score Trend (Last 6 Periods)</h4>
              <div className="flex items-end gap-2 h-32">
                {historical?.map((h, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className={`w-full rounded-t ${
                        h.score >= 80 ? 'bg-emerald-500' :
                        h.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ height: `${h.score}%` }}
                    />
                    <span className="text-slate-500 text-xs">{h.period}</span>
                    <span className="text-white text-xs font-medium">{h.score}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-slate-400 text-xs">Average</p>
                <p className="text-white font-bold text-lg">
                  {historical ? Math.round(historical.reduce((a, b) => a + b.score, 0) / historical.length) : '-'}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-slate-400 text-xs">Highest</p>
                <p className="text-emerald-400 font-bold text-lg">
                  {historical ? Math.max(...historical.map(h => h.score)) : '-'}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-slate-400 text-xs">Lowest</p>
                <p className="text-red-400 font-bold text-lg">
                  {historical ? Math.min(...historical.map(h => h.score)) : '-'}
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4">
              <h4 className="text-white font-medium mb-3">Previous Predictions</h4>
              <div className="space-y-2">
                {historical?.slice(0, 3).map((h, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                    <div>
                      <p className="text-white text-sm">{h.period}</p>
                      <p className="text-slate-500 text-xs">{h.outcome || 'Prediction verified'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={h.accurate ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
                        {h.accurate ? 'Accurate' : 'Missed'}
                      </Badge>
                      <span className="text-white font-medium">{h.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="mt-4 space-y-4">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <h4 className="text-white font-medium mb-3">Was this prediction accurate?</h4>
              <div className="flex gap-3">
                <Button
                  variant={feedbackType === 'accurate' ? 'default' : 'outline'}
                  className={feedbackType === 'accurate' ? 'bg-emerald-500 hover:bg-emerald-400' : 'border-slate-600'}
                  onClick={() => setFeedbackType('accurate')}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Accurate
                </Button>
                <Button
                  variant={feedbackType === 'inaccurate' ? 'default' : 'outline'}
                  className={feedbackType === 'inaccurate' ? 'bg-red-500 hover:bg-red-400' : 'border-slate-600'}
                  onClick={() => setFeedbackType('inaccurate')}
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Inaccurate
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400">Additional Comments (Optional)</Label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide details about why the prediction was accurate/inaccurate..."
                className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
              />
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-400 mt-0.5" />
                <p className="text-slate-400 text-xs">
                  Your feedback helps improve our AI models. Submitted feedback is used in periodic model retraining cycles.
                </p>
              </div>
            </div>

            <Button 
              className="w-full bg-cyan-500 hover:bg-cyan-400"
              onClick={submitFeedback}
              disabled={!feedbackType}
            >
              Submit Feedback for Model Improvement
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}