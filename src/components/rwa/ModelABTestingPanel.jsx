import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FlaskConical, TrendingUp, CheckCircle2, BarChart3, Zap, Crown,
  Play, Pause, RotateCcw, Settings, AlertTriangle, History
} from 'lucide-react';
import { toast } from 'sonner';

const modelVersions = {
  fraud: [
    { id: 'fraud-v2.3', name: 'v2.3 (Current)', accuracy: 94.2, precision: 92.1, recall: 89.5, f1: 90.8, latency: 45, traffic: 70, status: 'champion' },
    { id: 'fraud-v2.4-beta', name: 'v2.4 Beta', accuracy: 95.8, precision: 94.2, recall: 91.2, f1: 92.7, latency: 52, traffic: 30, status: 'challenger' }
  ],
  activity: [
    { id: 'activity-v1.8', name: 'v1.8 (Current)', accuracy: 91.5, precision: 89.2, recall: 88.1, f1: 88.6, latency: 32, traffic: 80, status: 'champion' },
    { id: 'activity-v1.9-beta', name: 'v1.9 Beta', accuracy: 93.1, precision: 91.5, recall: 90.2, f1: 90.8, latency: 38, traffic: 20, status: 'challenger' }
  ],
  credit: [
    { id: 'credit-v3.1', name: 'v3.1 (Current)', accuracy: 88.9, precision: 86.5, recall: 85.2, f1: 85.8, latency: 125, traffic: 100, status: 'champion' },
    { id: 'credit-v3.2-beta', name: 'v3.2 Beta', accuracy: 91.2, precision: 89.8, recall: 88.5, f1: 89.1, latency: 142, traffic: 0, status: 'pending' }
  ],
  hr: [
    { id: 'hr-v1.2', name: 'v1.2 (Current)', accuracy: 87.3, precision: 85.1, recall: 84.5, f1: 84.8, latency: 28, traffic: 100, status: 'champion' }
  ]
};

export default function ModelABTestingPanel({ module = 'fraud', onRollback }) {
  const [models, setModels] = useState(modelVersions[module] || modelVersions.fraud);
  const [testRunning, setTestRunning] = useState(module === 'fraud' || module === 'activity');
  const [autoSelect, setAutoSelect] = useState(true);
  const [driftAlert, setDriftAlert] = useState(module === 'credit');
  const [versionHistory, setVersionHistory] = useState([
    { version: 'v2.2', accuracy: 92.1, date: '2024-10-15' },
    { version: 'v2.1', accuracy: 90.5, date: '2024-09-20' },
    { version: 'v2.0', accuracy: 88.2, date: '2024-08-10' }
  ]);

  const startTest = (modelId) => {
    setTestRunning(true);
    toast.success('A/B test started');
  };

  const promoteModel = (modelId) => {
    setModels(prev => prev.map(m => ({
      ...m,
      status: m.id === modelId ? 'champion' : 'challenger',
      traffic: m.id === modelId ? 100 : 0
    })));
    toast.success('Model promoted to production');
  };

  const rollbackToVersion = (version) => {
    onRollback?.(version);
    toast.success(`Rolling back to ${version.version}...`);
    setTimeout(() => toast.success(`Rollback to ${version.version} complete`), 2000);
  };

  const updateTraffic = (modelId, traffic) => {
    const remaining = 100 - traffic;
    setModels(prev => prev.map(m => ({
      ...m,
      traffic: m.id === modelId ? traffic : remaining / (prev.length - 1)
    })));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'champion': return <Badge className="bg-emerald-500/20 text-emerald-400"><Crown className="w-3 h-3 mr-1" />Champion</Badge>;
      case 'challenger': return <Badge className="bg-amber-500/20 text-amber-400"><FlaskConical className="w-3 h-3 mr-1" />Challenger</Badge>;
      case 'pending': return <Badge className="bg-slate-700 text-slate-400">Pending</Badge>;
      default: return null;
    }
  };

  const champion = models.find(m => m.status === 'champion');
  const challenger = models.find(m => m.status === 'challenger');

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="border-b border-slate-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-violet-400" />
            Model A/B Testing
            {testRunning && (
              <Badge className="bg-emerald-500/20 text-emerald-400 ml-2">
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Running
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Auto-select winner</span>
              <Switch checked={autoSelect} onCheckedChange={setAutoSelect} />
            </div>
            {testRunning ? (
              <Button variant="outline" size="sm" className="border-red-500 text-red-400" onClick={() => setTestRunning(false)}>
                <Pause className="w-4 h-4 mr-1" />
                Stop Test
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="border-emerald-500 text-emerald-400" onClick={() => setTestRunning(true)}>
                <Play className="w-4 h-4 mr-1" />
                Start Test
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Comparison View */}
        {challenger && (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {[champion, challenger].map((model, idx) => (
              <div 
                key={model.id} 
                className={`p-4 rounded-xl border ${
                  model.status === 'champion' ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-violet-500/50 bg-violet-500/5'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white font-medium">{model.name}</p>
                    {getStatusBadge(model.status)}
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">Traffic Split</p>
                    <p className="text-white font-bold text-xl">{model.traffic}%</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                    <p className="text-slate-500 text-xs">Accuracy</p>
                    <p className={`font-bold ${model.accuracy > (idx === 0 ? challenger?.accuracy : champion?.accuracy) ? 'text-emerald-400' : 'text-white'}`}>
                      {model.accuracy}%
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                    <p className="text-slate-500 text-xs">Precision</p>
                    <p className="text-white font-bold">{model.precision}%</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                    <p className="text-slate-500 text-xs">Recall</p>
                    <p className="text-white font-bold">{model.recall}%</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                    <p className="text-slate-500 text-xs">F1 Score</p>
                    <p className={`font-bold ${model.f1 > (idx === 0 ? challenger?.f1 : champion?.f1) ? 'text-lime-400' : 'text-white'}`}>
                      {model.f1}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-slate-500 text-xs flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {model.latency}ms avg latency
                  </span>
                  {model.status === 'challenger' && (
                    <Button size="sm" variant="outline" className="border-emerald-500 text-emerald-400" onClick={() => promoteModel(model.id)}>
                      <Crown className="w-4 h-4 mr-1" />
                      Promote
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Traffic Split Slider */}
        {testRunning && challenger && (
          <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-sm">Traffic Distribution</span>
              <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => updateTraffic(champion.id, 50)}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset to 50/50
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-emerald-400 text-sm w-24">{champion?.name}</span>
              <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-violet-500" 
                  style={{ width: `${champion?.traffic || 50}%` }}
                />
              </div>
              <span className="text-violet-400 text-sm w-24 text-right">{challenger?.name}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={champion?.traffic || 50}
              onChange={(e) => updateTraffic(champion.id, parseInt(e.target.value))}
              className="w-full mt-2 accent-lime-500"
            />
          </div>
        )}

        {/* Model Performance Comparison */}
        <div className="space-y-2">
          <p className="text-slate-400 text-sm font-medium">All Model Versions</p>
          {models.map((model) => (
            <div key={model.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusBadge(model.status)}
                <span className="text-white">{model.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-xs">Accuracy:</span>
                  <span className="text-white font-medium">{model.accuracy}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-xs">F1:</span>
                  <span className="text-lime-400 font-medium">{model.f1}</span>
                </div>
                <div className="w-20">
                  <Progress value={model.traffic} className="h-2 bg-slate-700" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {autoSelect && testRunning && (
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-400 font-medium text-sm">Auto-Selection Active</p>
                <p className="text-slate-400 text-xs">The system will automatically promote the winning model after 7 days or 10,000 predictions, whichever comes first.</p>
              </div>
            </div>
          </div>
        )}

        {/* Drift Alert */}
        {driftAlert && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                <div>
                  <p className="text-amber-400 font-medium text-sm">Drift Detected</p>
                  <p className="text-slate-400 text-xs">Model drift of 2.5% detected. Consider retraining or rollback.</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-amber-500 text-amber-400" onClick={() => setDriftAlert(false)}>
                Dismiss
              </Button>
            </div>
          </div>
        )}

        {/* Version Rollback */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm flex items-center gap-1">
              <History className="w-4 h-4" />
              Version History
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {versionHistory.map((v) => (
              <Button 
                key={v.version} 
                size="sm" 
                variant="outline" 
                className="border-slate-600 text-slate-300"
                onClick={() => rollbackToVersion(v)}
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                {v.version} ({v.accuracy}%)
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}