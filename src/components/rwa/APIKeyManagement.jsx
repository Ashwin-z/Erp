import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Key, Plus, RotateCcw, Trash2, Eye, EyeOff, Copy, Clock, AlertTriangle,
  Shield, Gauge, Bell, Calendar
} from 'lucide-react';
import { toast } from 'sonner';

const apiKeys = [
  { id: 1, name: 'Production Key', prefix: 'sk_live_', status: 'active', created: '2024-10-15', expires: '2025-10-15', lastUsed: '2024-11-27 14:30', usageToday: 4523, limit: 10000 },
  { id: 2, name: 'Sandbox Key', prefix: 'sk_test_', status: 'active', created: '2024-11-01', expires: '2025-11-01', lastUsed: '2024-11-27 10:15', usageToday: 156, limit: 50000 },
  { id: 3, name: 'Legacy Key', prefix: 'sk_old_', status: 'expiring', created: '2024-01-15', expires: '2024-12-15', lastUsed: '2024-11-20 09:00', usageToday: 0, limit: 5000 }
];

export default function APIKeyManagement({ partnerId }) {
  const [showKey, setShowKey] = useState({});
  const [rateLimits, setRateLimits] = useState({ perSecond: 100, perMinute: 1000, perDay: 50000 });
  const [expiryNotifications, setExpiryNotifications] = useState({ days30: true, days7: true, days1: true });

  const rotateKey = (keyId) => {
    toast.success('API key rotated. Old key will remain valid for 24 hours.');
  };

  const copyKey = (key) => {
    navigator.clipboard.writeText(`${key.prefix}xxxxxxxxxxxxxxxxxxxx`);
    toast.success('API key copied to clipboard');
  };

  const daysUntilExpiry = (expires) => {
    const diff = new Date(expires) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* API Keys */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              API Keys
            </CardTitle>
            <Button size="sm"><Plus className="w-4 h-4 mr-1" />Generate Key</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {apiKeys.map((key) => {
            const days = daysUntilExpiry(key.expires);
            const isExpiring = days <= 30;
            return (
              <div key={key.id} className={`p-4 rounded-lg border ${isExpiring ? 'border-amber-500/30 bg-amber-500/5' : 'border-slate-700 bg-slate-800/50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${key.status === 'active' ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
                      <Key className={`w-5 h-5 ${key.status === 'active' ? 'text-emerald-400' : 'text-amber-400'}`} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{key.name}</p>
                      <div className="flex items-center gap-2">
                        <code className="text-slate-400 text-sm">{key.prefix}••••••••••••</code>
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => copyKey(key)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={key.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
                      {key.status === 'expiring' ? `Expires in ${days} days` : key.status}
                    </Badge>
                    <Button variant="outline" size="sm" className="border-slate-600" onClick={() => rotateKey(key.id)}>
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Rotate
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs">Created</p>
                    <p className="text-slate-300">{key.created}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Expires</p>
                    <p className={isExpiring ? 'text-amber-400' : 'text-slate-300'}>{key.expires}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Last Used</p>
                    <p className="text-slate-300">{key.lastUsed}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Usage Today</p>
                    <div className="flex items-center gap-2">
                      <Progress value={(key.usageToday / key.limit) * 100} className="h-1 flex-1 bg-slate-700" />
                      <span className="text-slate-300 text-xs">{key.usageToday}/{key.limit}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Rate Limiting */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Gauge className="w-4 h-4 text-cyan-400" />
            Rate Limiting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Requests per Second</Label>
              <Input type="number" className="bg-slate-700 border-slate-600" value={rateLimits.perSecond} onChange={(e) => setRateLimits({ ...rateLimits, perSecond: parseInt(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Requests per Minute</Label>
              <Input type="number" className="bg-slate-700 border-slate-600" value={rateLimits.perMinute} onChange={(e) => setRateLimits({ ...rateLimits, perMinute: parseInt(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Requests per Day</Label>
              <Input type="number" className="bg-slate-700 border-slate-600" value={rateLimits.perDay} onChange={(e) => setRateLimits({ ...rateLimits, perDay: parseInt(e.target.value) })} />
            </div>
          </div>
          <Button className="mt-4" onClick={() => toast.success('Rate limits updated')}>Save Rate Limits</Button>
        </CardContent>
      </Card>

      {/* Expiry Notifications */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Bell className="w-4 h-4 text-violet-400" />
            Expiry Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">30 days before expiry</span>
            </div>
            <Switch checked={expiryNotifications.days30} onCheckedChange={(c) => setExpiryNotifications({ ...expiryNotifications, days30: c })} />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">7 days before expiry</span>
            </div>
            <Switch checked={expiryNotifications.days7} onCheckedChange={(c) => setExpiryNotifications({ ...expiryNotifications, days7: c })} />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300">1 day before expiry</span>
            </div>
            <Switch checked={expiryNotifications.days1} onCheckedChange={(c) => setExpiryNotifications({ ...expiryNotifications, days1: c })} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}