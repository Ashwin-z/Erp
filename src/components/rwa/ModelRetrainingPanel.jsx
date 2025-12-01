import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  RefreshCw, Zap, AlertTriangle, TrendingDown, Clock, Play, Pause,
  CheckCircle2, Settings, RotateCcw, History, Brain
} from 'lucide-react';
import { toast } from 'sonner';

const models = [
  { id: 'fraud', name: 'Fraud Detection', version: 'v2.4', accuracy: 95.8, drift: 0.8, lastRetrain: '2024-11-15', status: 'healthy', autoRetrain: true },
  { id: 'activity', name: 'Activity Scoring', version: 'v1.9', accuracy: 93.1, drift: 1.2, lastRetrain: '2024-11-20', status: 'healthy', autoRetrain: true },
  { id: 'credit', name: 'Creditworthiness', version: 'v3.1', accuracy: 88.9, drift: 2.5, lastRetrain: '2024-10-30', status: 'drift_warning', autoRetrain: false },
  { id: 'hr', name: 'HR KPIs', version: 'v1.2', accuracy: 87.3, drift: 0.5, lastRetrain: '2024-11-10', status: 'healthy', autoRetrain: true }
];

const retrainingHistory = [
  { id: 1, model: 'Fraud Detection', fromVersion: 'v2.3', toVersion: 'v2.4', date: '2024-11-15', trigger: 'Scheduled', accuracy: { before: 94.2, after: 95.8 } },
  { id: 2, model: 'Activity Scoring', fromVersion: 'v1.8', toVersion: 'v1.9', date: '2024-11-20', trigger: 'Performance Degradation', accuracy: { before: 91.5, after: 93.1 } },
  { id: 3, model: 'HR KPIs', fromVersion: 'v1.1', toVersion: 'v1.2', date: '2024-11-10', trigger: 'Manual', accuracy: { before: 85.1, after: 87.3 } }
];

export default function ModelRetrainingPanel({ onRollback }) {
  const [triggers, setTriggers] = useState({
    accuracyThreshold: 90,
    driftThreshold: 2.0,
    scheduleEnabled: true,
    scheduleFrequency: 'weekly'
  });
  const [retrainingModel, setRetrainingModel] = useState(null);

  const startRetraining = (model) => {
    setRetrainingModel(model.id);
    toast.success(`Retraining started for ${model.name}`);
    setTimeout(() => {
      setRetrainingModel(null);
      toast.success(`${model.name} retraining complete`);
    }, 3000);
  };

  const rollbackModel = (model) => {
    onRollback?.(model);
    toast.success(`${model.name} rolled back to previous version`);
  };

  return (
    <div className="space-y-6">
      {/* Retraining Triggers */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Settings className="w-4 h-4 text-violet-400" />
            Auto-Retraining Triggers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Accuracy Threshold (%)</Label>
              <div className="flex items-center gap-2">
                <Input type="number" className="bg-slate-700 border-slate-600" value={triggers.accuracyThreshold} onChange={(e) => setTriggers({ ...triggers, accuracyThreshold: parseFloat(e.target.value) })} />
                <span className="text-slate-500 text-sm">Retrain when accuracy drops below</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Drift Threshold (%)</Label>
              <div className="flex items-center gap-2">
                <Input type="number" step="0.1" className="bg-slate-700 border-slate-600" value={triggers.driftThreshold} onChange={(e) => setTriggers({ ...triggers, driftThreshold: parseFloat(e.target.value) })} />
                <span className="text-slate-500 text-sm">Alert when drift exceeds</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <div>
              <p className="text-white">Scheduled Retraining</p>
              <p className="text-slate-500 text-sm">Automatically retrain models on schedule</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={triggers.scheduleFrequency} onValueChange={(v) => setTriggers({ ...triggers, scheduleFrequency: v })}>
                <SelectTrigger className="w-32 bg-slate-700 border-slate-600"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <Switch checked={triggers.scheduleEnabled} onCheckedChange={(c) => setTriggers({ ...triggers, scheduleEnabled: c })} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Brain className="w-4 h-4 text-cyan-400" />
            Model Status & Retraining
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {models.map((model) => (
            <div key={model.id} className={`p-4 rounded-lg border ${model.status === 'drift_warning' ? 'border-amber-500/30 bg-amber-500/5' : 'border-slate-700 bg-slate-800/50'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${model.status === 'healthy' ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
                    {model.status === 'healthy' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-amber-400" />}
                  </div>
                  <div>
                    <p className="text-white font-medium">{model.name}</p>
                    <p className="text-slate-500 text-sm">{model.version} • Last retrained: {model.lastRetrain}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={model.autoRetrain} />
                  <span className="text-slate-500 text-xs">Auto</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-slate-500 text-xs">Accuracy</p>
                  <p className="text-white font-medium">{model.accuracy}%</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Drift</p>
                  <p className={`font-medium ${model.drift > triggers.driftThreshold ? 'text-amber-400' : 'text-white'}`}>{model.drift}%</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Status</p>
                  <Badge className={model.status === 'healthy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
                    {model.status === 'healthy' ? 'Healthy' : 'Drift Warning'}
                  </Badge>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="outline" className="border-slate-600" onClick={() => rollbackModel(model)}>
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Rollback
                  </Button>
                  <Button size="sm" onClick={() => startRetraining(model)} disabled={retrainingModel === model.id}>
                    {retrainingModel === model.id ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <Play className="w-3 h-3 mr-1" />}
                    {retrainingModel === model.id ? 'Training...' : 'Retrain'}
                  </Button>
                </div>
              </div>
              {retrainingModel === model.id && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Retraining in progress...</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-1 bg-slate-700" />
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Retraining History */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            Retraining History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {retrainingHistory.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-slate-600 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-slate-300" />
                </div>
                <div>
                  <p className="text-white text-sm">{entry.model}: {entry.fromVersion} → {entry.toVersion}</p>
                  <p className="text-slate-500 text-xs">{entry.date} • {entry.trigger}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 text-sm">+{(entry.accuracy.after - entry.accuracy.before).toFixed(1)}%</p>
                <p className="text-slate-500 text-xs">{entry.accuracy.before}% → {entry.accuracy.after}%</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}