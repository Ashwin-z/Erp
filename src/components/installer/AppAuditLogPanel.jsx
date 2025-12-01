import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  History, CheckCircle2, XCircle, RotateCcw, Download, Trash2, RefreshCw 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import moment from 'moment';

export default function AppAuditLogPanel() {
  const { data: logs } = useQuery({
    queryKey: ['appAuditLogs'],
    queryFn: () => base44.entities.AppInstallerAuditLog.list('-timestamp', 50),
    initialData: []
  });

  const getActionIcon = (action) => {
    switch (action) {
      case 'Install': return <Download className="w-4 h-4 text-green-600" />;
      case 'Uninstall': return <Trash2 className="w-4 h-4 text-red-600" />;
      case 'Update': return <RefreshCw className="w-4 h-4 text-blue-600" />;
      case 'Rollback': return <RotateCcw className="w-4 h-4 text-amber-600" />;
      default: return <History className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" /> Audit Log
        </CardTitle>
        <CardDescription>Detailed history of all app management actions.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 border rounded-lg bg-slate-50/50">
                <div className="mt-1 bg-white p-2 rounded border shadow-sm">
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-slate-900">
                      {log.action}: {log.app_name}
                    </h4>
                    <Badge variant={log.outcome === 'Success' ? 'outline' : 'destructive'} className={log.outcome === 'Success' ? 'bg-green-50 text-green-700 border-green-200' : ''}>
                      {log.outcome === 'Success' ? <CheckCircle2 className="w-3 h-3 mr-1"/> : <XCircle className="w-3 h-3 mr-1"/>}
                      {log.outcome}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Performed by <span className="font-medium text-slate-700">{log.performed_by}</span> • {moment(log.timestamp).format('MMM D, YYYY h:mm A')}
                  </p>
                  {log.details && (
                    <div className="mt-2 text-xs font-mono bg-slate-100 p-2 rounded text-slate-600">
                      {log.details}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-center text-slate-400 py-8">No audit logs available.</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}