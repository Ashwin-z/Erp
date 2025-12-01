import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle, Activity, TrendingUp, TrendingDown, Bell, BellOff,
  Eye, CheckCircle2, XCircle, Clock, Zap, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

const anomalyTypes = {
  velocity: { label: 'Velocity Spike', color: 'text-red-400', bg: 'bg-red-500/20' },
  pattern: { label: 'Pattern Deviation', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  amount: { label: 'Amount Anomaly', color: 'text-violet-400', bg: 'bg-violet-500/20' },
  behavior: { label: 'Behavioral', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  timing: { label: 'Timing Anomaly', color: 'text-pink-400', bg: 'bg-pink-500/20' }
};

export default function AnomalyDetectionPanel({ module = 'fraud' }) {
  const [anomalies, setAnomalies] = useState([
    { id: 'ANM-001', type: 'velocity', severity: 'high', entity: 'Unknown Corp', description: '15 transactions in 2 minutes', confidence: 94, timestamp: new Date(), status: 'new' },
    { id: 'ANM-002', type: 'amount', severity: 'medium', entity: 'TechStart Pte Ltd', description: 'Transaction 5x higher than average', confidence: 78, timestamp: new Date(Date.now() - 300000), status: 'reviewing' },
    { id: 'ANM-003', type: 'pattern', severity: 'low', entity: 'Marina Foods', description: 'Unusual activity pattern detected', confidence: 62, timestamp: new Date(Date.now() - 900000), status: 'dismissed' }
  ]);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  useEffect(() => {
    if (!realTimeEnabled) return;
    
    const interval = setInterval(() => {
      const types = Object.keys(anomalyTypes);
      const randomAnomaly = {
        id: `ANM-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        type: types[Math.floor(Math.random() * types.length)],
        severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        entity: ['Global Logistics', 'Urban Retail', 'Skyline Props'][Math.floor(Math.random() * 3)],
        description: 'New anomaly detected by AI',
        confidence: Math.floor(Math.random() * 30) + 70,
        timestamp: new Date(),
        status: 'new'
      };
      
      if (Math.random() > 0.7) {
        setAnomalies(prev => [randomAnomaly, ...prev.slice(0, 9)]);
        if (alertsEnabled) {
          toast.warning(`New ${anomalyTypes[randomAnomaly.type].label} detected for ${randomAnomaly.entity}`);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [realTimeEnabled, alertsEnabled]);

  const handleAction = (id, action) => {
    setAnomalies(prev => prev.map(a => 
      a.id === id ? { ...a, status: action === 'dismiss' ? 'dismissed' : 'resolved' } : a
    ));
    toast.success(`Anomaly ${action === 'dismiss' ? 'dismissed' : 'resolved'}`);
  };

  const severityColors = {
    high: 'border-red-500 bg-red-500/10',
    medium: 'border-amber-500 bg-amber-500/10',
    low: 'border-blue-500 bg-blue-500/10'
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="border-b border-slate-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Real-Time Anomaly Detection
            {realTimeEnabled && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {alertsEnabled ? <Bell className="w-4 h-4 text-slate-400" /> : <BellOff className="w-4 h-4 text-slate-500" />}
              <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Live</span>
              <Switch checked={realTimeEnabled} onCheckedChange={setRealTimeEnabled} />
            </div>
            <Button variant="outline" size="sm" className="border-slate-700">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {anomalies.map((anomaly, idx) => {
            const typeInfo = anomalyTypes[anomaly.type];
            return (
              <motion.div
                key={anomaly.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className={`mb-3 p-4 rounded-xl border-l-4 ${severityColors[anomaly.severity]} transition-all`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${typeInfo.bg} ${typeInfo.color}`}>
                        {typeInfo.label}
                      </Badge>
                      <Badge className={
                        anomaly.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                        anomaly.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      }>
                        {anomaly.severity}
                      </Badge>
                      {anomaly.status === 'new' && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                      )}
                    </div>
                    <p className="text-white font-medium">{anomaly.entity}</p>
                    <p className="text-slate-400 text-sm">{anomaly.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {anomaly.confidence}% confidence
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(anomaly.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  {anomaly.status === 'new' && (
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" className="border-emerald-500 text-emerald-400" onClick={() => handleAction(anomaly.id, 'resolve')}>
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-400" onClick={() => handleAction(anomaly.id, 'dismiss')}>
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  {anomaly.status !== 'new' && (
                    <Badge className={anomaly.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}>
                      {anomaly.status}
                    </Badge>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {anomalies.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No anomalies detected</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}