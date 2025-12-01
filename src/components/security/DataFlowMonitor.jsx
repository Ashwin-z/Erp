import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Database, Download, Upload, Globe, Server, 
  ArrowRight, AlertTriangle, CheckCircle, Eye
} from 'lucide-react';

export default function DataFlowMonitor({ flows }) {
  const sampleFlows = flows || [
    { id: 1, source: 'Customer Database', destination: 'Export API', user: 'john@techstart.com', data_type: 'Customer PII', records: 1250, size: '2.3 MB', status: 'flagged', risk: 'high', time: '10 mins ago' },
    { id: 2, source: 'Financial Reports', destination: 'Email Attachment', user: 'sarah@techstart.com', data_type: 'Financial Data', records: 1, size: '450 KB', status: 'approved', risk: 'low', time: '25 mins ago' },
    { id: 3, source: 'External API', destination: 'Product Database', user: 'system', data_type: 'Product Data', records: 500, size: '1.2 MB', status: 'normal', risk: 'low', time: '1 hour ago' },
    { id: 4, source: 'User Uploads', destination: 'Cloud Storage', user: 'anna@techstart.com', data_type: 'Documents', records: 15, size: '25 MB', status: 'scanning', risk: 'medium', time: '2 hours ago' }
  ];

  const statusConfig = {
    flagged: { icon: AlertTriangle, color: 'bg-red-100 text-red-700 border-red-200' },
    approved: { icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-200' },
    normal: { icon: CheckCircle, color: 'bg-slate-100 text-slate-700 border-slate-200' },
    scanning: { icon: Eye, color: 'bg-blue-100 text-blue-700 border-blue-200' }
  };

  const riskColors = {
    low: 'bg-green-500',
    medium: 'bg-amber-500',
    high: 'bg-red-500'
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-500" />
          Data Flow Monitor
        </CardTitle>
        <Button variant="outline" size="sm">View All Flows</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sampleFlows.map((flow) => {
            const StatusIcon = statusConfig[flow.status].icon;
            return (
              <div 
                key={flow.id}
                className={`p-4 rounded-xl border ${flow.status === 'flagged' ? 'bg-red-50 border-red-200' : 'bg-slate-50'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Flow Visualization */}
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-white rounded-lg border">
                        <Server className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium">{flow.source}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400" />
                      <div className="p-2 bg-white rounded-lg border">
                        {flow.destination.includes('API') ? (
                          <Globe className="w-5 h-5 text-purple-500" />
                        ) : flow.destination.includes('Email') ? (
                          <Download className="w-5 h-5 text-orange-500" />
                        ) : (
                          <Database className="w-5 h-5 text-cyan-500" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium">{flow.destination}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{flow.data_type}</p>
                      <p className="text-xs text-slate-500">{flow.records.toLocaleString()} records • {flow.size}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{flow.user}</p>
                      <p className="text-xs text-slate-400">{flow.time}</p>
                    </div>
                    <Badge className={`${riskColors[flow.risk]} text-white`}>{flow.risk}</Badge>
                    <Badge className={statusConfig[flow.status].color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {flow.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}