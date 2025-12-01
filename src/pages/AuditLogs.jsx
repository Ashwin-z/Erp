import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, ShieldAlert, Database, Globe, 
  User, Key, FileCode 
} from 'lucide-react';

export default function AuditLogs() {
  const logs = [
    { id: 'evt_1234', actor: 'Sarah Chen (CFO)', action: 'Viewed Payroll', target: 'Payroll_Oct2024', time: '2024-11-28 10:42:15', status: 'Success', ip: '192.168.1.45' },
    { id: 'evt_1235', actor: 'System (Auto-OCR)', action: 'Processed Document', target: 'INV-002.pdf', time: '2024-11-28 10:40:00', status: 'Success', ip: 'Internal' },
    { id: 'evt_1236', actor: 'Mike Ross', action: 'Export Data', target: 'Customer_List_All', time: '2024-11-28 10:35:22', status: 'Blocked', ip: '10.0.0.5' },
  ];

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="w-8 h-8 text-slate-400" />
            System Audit Logs
          </h1>
          <p className="text-slate-400">Immutable Traceability for Compliance & Security</p>
        </div>
        <div className="flex gap-2">
           <Badge variant="outline" className="border-slate-700 text-slate-400">Retention: 1 Year</Badge>
           <Badge variant="outline" className="border-slate-700 text-slate-400">Mode: WORM (Write-Once)</Badge>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle>Live Event Stream</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 uppercase p-3 border-b border-slate-800">
              <div className="col-span-2">Timestamp</div>
              <div className="col-span-2">Actor</div>
              <div className="col-span-3">Action</div>
              <div className="col-span-3">Target</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">IP</div>
            </div>
            {logs.map((log) => (
              <div key={log.id} className="grid grid-cols-12 gap-4 items-center p-3 hover:bg-slate-800/50 transition-colors text-sm border-b border-slate-800/50 font-mono">
                <div className="col-span-2 text-slate-400">{log.time}</div>
                <div className="col-span-2 flex items-center gap-2">
                   <User className="w-3 h-3 text-slate-500" />
                   <span className="truncate">{log.actor}</span>
                </div>
                <div className="col-span-3 text-slate-300">{log.action}</div>
                <div className="col-span-3 text-slate-500 truncate">{log.target}</div>
                <div className="col-span-1">
                  <Badge variant={log.status === 'Success' ? 'outline' : 'destructive'} className={log.status === 'Success' ? 'text-emerald-400 border-emerald-500/30' : ''}>
                    {log.status}
                  </Badge>
                </div>
                <div className="col-span-1 text-slate-500 text-xs">{log.ip}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}