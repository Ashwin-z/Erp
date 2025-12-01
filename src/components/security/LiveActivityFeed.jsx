import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, Eye, Download, Upload, Search, Settings, 
  LogIn, LogOut, Edit, Trash2, RefreshCw, AlertTriangle
} from 'lucide-react';
import moment from 'moment';

const actionIcons = {
  login: LogIn,
  logout: LogOut,
  page_view: Eye,
  data_access: Eye,
  data_modify: Edit,
  data_delete: Trash2,
  data_export: Download,
  file_upload: Upload,
  file_download: Download,
  search: Search,
  settings_change: Settings,
  failed_login: AlertTriangle,
  suspicious_activity: AlertTriangle
};

const riskColors = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700'
};

export default function LiveActivityFeed({ logs, onRefresh }) {
  const [autoRefresh, setAutoRefresh] = useState(true);

  const sampleLogs = logs || [
    { id: 1, user_email: 'sarah@techstart.com', action_type: 'data_access', resource_name: 'Customer List', risk_level: 'low', ip_address: '192.168.1.45', location: { city: 'Singapore', country: 'SG' }, created_date: new Date().toISOString() },
    { id: 2, user_email: 'john@techstart.com', action_type: 'data_export', resource_name: 'Financial Report Q4', risk_level: 'medium', ip_address: '103.45.67.89', location: { city: 'Bangkok', country: 'TH' }, created_date: moment().subtract(2, 'minutes').toISOString() },
    { id: 3, user_email: 'unknown@suspicious.com', action_type: 'failed_login', resource_name: 'Admin Panel', risk_level: 'high', ip_address: '45.33.12.99', location: { city: 'Unknown', country: 'RU' }, created_date: moment().subtract(5, 'minutes').toISOString() },
    { id: 4, user_email: 'mike@techstart.com', action_type: 'page_view', resource_name: 'Dashboard', risk_level: 'low', ip_address: '192.168.1.78', location: { city: 'Singapore', country: 'SG' }, created_date: moment().subtract(7, 'minutes').toISOString() },
    { id: 5, user_email: 'anna@techstart.com', action_type: 'search', search_query: 'customer data 2024', risk_level: 'low', ip_address: '192.168.1.22', location: { city: 'Singapore', country: 'SG' }, created_date: moment().subtract(10, 'minutes').toISOString() }
  ];

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        onRefresh && onRefresh();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Live Activity Feed
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={autoRefresh ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setAutoRefresh(!autoRefresh)}>
            Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </Badge>
          <Button variant="ghost" size="icon" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto">
        <div className="space-y-2">
          {sampleLogs.map((log, i) => {
            const Icon = actionIcons[log.action_type] || Activity;
            return (
              <div 
                key={log.id || i}
                className={`p-3 rounded-lg border transition-all hover:shadow-sm ${log.risk_level === 'high' || log.risk_level === 'critical' ? 'bg-red-50 border-red-200' : 'bg-slate-50'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${riskColors[log.risk_level] || 'bg-slate-100'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm truncate">{log.user_email}</span>
                      <Badge variant="outline" className="text-xs">{log.action_type.replace('_', ' ')}</Badge>
                      <Badge className={`text-xs ${riskColors[log.risk_level]}`}>{log.risk_level}</Badge>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                      {log.resource_name || log.search_query}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                      <span>{log.ip_address}</span>
                      <span>{log.location?.city}, {log.location?.country}</span>
                      <span>{moment(log.created_date).fromNow()}</span>
                    </div>
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