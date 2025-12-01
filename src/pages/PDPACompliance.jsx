import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function PDPACompliance() {
  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="w-8 h-8 text-emerald-400" />
            PDPA Compliance Center
          </h1>
          <p className="text-slate-400">Consent Management, Retention Policy & Data Access</p>
        </div>
        <Button variant="outline" className="border-slate-700 text-emerald-400 hover:bg-slate-900">
          <Lock className="w-4 h-4 mr-2" />
          DPO Dashboard
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Stats */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Active Consents</p>
              <h3 className="text-2xl font-bold">1,240</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Retention Alerts</p>
              <h3 className="text-2xl font-bold">5 Pending</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Eye className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Access Requests</p>
              <h3 className="text-2xl font-bold">2 Open</h3>
            </div>
          </CardContent>
        </Card>

        {/* Consent Log */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Recent Consent Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { user: 'Sarah Jenkins', type: 'Marketing', status: 'Granted', date: '2024-11-28 10:30 AM' },
                  { user: 'Mike Ross', type: 'DataProcessing', status: 'Granted', date: '2024-11-28 09:15 AM' },
                  { user: 'John Doe', type: 'ThirdPartyTransfer', status: 'Revoked', date: '2024-11-27 04:45 PM' },
                ].map((record, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
                    <div>
                      <p className="font-bold text-sm">{record.user}</p>
                      <p className="text-xs text-slate-400">{record.type}</p>
                    </div>
                    <div className="text-right">
                       <Badge variant={record.status === 'Granted' ? 'default' : 'destructive'} className="mb-1">
                         {record.status}
                       </Badge>
                       <p className="text-xs text-slate-500">{record.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Retention Policies */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle>Retention Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { type: 'Invoices', ttl: '7 Years', status: 'Active' },
              { type: 'CVs / Resumes', ttl: '2 Years', status: 'Active' },
              { type: 'Access Logs', ttl: '1 Year', status: 'Active' },
            ].map((policy, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 border-b border-slate-800 last:border-0">
                <span className="text-sm">{policy.type}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">{policy.ttl}</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}