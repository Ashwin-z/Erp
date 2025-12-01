import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, Shield, Clock, User, MapPin, 
  CheckCircle, XCircle, Eye, Send, Sparkles
} from 'lucide-react';
import moment from 'moment';

const severityConfig = {
  critical: { bg: 'bg-red-500', text: 'text-red-700', border: 'border-red-500', light: 'bg-red-50' },
  high: { bg: 'bg-orange-500', text: 'text-orange-700', border: 'border-orange-500', light: 'bg-orange-50' },
  medium: { bg: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-500', light: 'bg-amber-50' },
  low: { bg: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-500', light: 'bg-blue-50' },
  info: { bg: 'bg-slate-500', text: 'text-slate-700', border: 'border-slate-300', light: 'bg-slate-50' }
};

const categoryIcons = {
  fraud_attempt: '🚨',
  unauthorized_access: '🔐',
  data_breach: '💾',
  suspicious_login: '👤',
  brute_force: '🔨',
  sql_injection: '💉',
  xss_attempt: '⚠️',
  api_abuse: '🔌',
  data_exfiltration: '📤',
  unusual_behavior: '🔍'
};

export default function ThreatAlerts({ alerts, onAction, onViewDetails }) {
  const sampleAlerts = alerts || [
    { id: 1, title: 'Multiple Failed Login Attempts', category: 'brute_force', severity: 'high', status: 'new', affected_user: 'admin@techstart.com', source_ip: '45.33.12.99', source_location: 'Moscow, Russia', ai_analysis: 'Detected 15 failed attempts in 5 minutes from suspicious IP', created_date: new Date().toISOString() },
    { id: 2, title: 'Unusual Data Export Pattern', category: 'data_exfiltration', severity: 'critical', status: 'investigating', affected_user: 'john@techstart.com', source_ip: '103.45.67.89', source_location: 'Bangkok, Thailand', ai_analysis: 'User exported 5x more data than usual pattern. VPN detected.', created_date: moment().subtract(15, 'minutes').toISOString() },
    { id: 3, title: 'SQL Injection Attempt Blocked', category: 'sql_injection', severity: 'medium', status: 'resolved', affected_user: 'anonymous', source_ip: '12.34.56.78', source_location: 'Unknown', ai_analysis: 'Malicious SQL pattern detected and blocked automatically', created_date: moment().subtract(1, 'hour').toISOString() }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Active Threat Alerts
        </CardTitle>
        <Button variant="outline" size="sm">View All</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {sampleAlerts.map((alert) => {
          const config = severityConfig[alert.severity];
          return (
            <div 
              key={alert.id}
              className={`p-4 rounded-xl border-l-4 ${config.border} ${config.light}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{categoryIcons[alert.category] || '⚠️'}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold">{alert.title}</h4>
                      <Badge className={`${config.bg} text-white`}>{alert.severity}</Badge>
                      <Badge variant="outline">{alert.status}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {alert.affected_user}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {alert.source_location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {moment(alert.created_date).fromNow()}
                      </span>
                    </div>

                    {/* AI Analysis */}
                    <div className="mt-3 p-2 bg-white rounded-lg border">
                      <div className="flex items-center gap-1 text-xs text-purple-600 mb-1">
                        <Sparkles className="w-3 h-3" /> AI Analysis
                      </div>
                      <p className="text-sm text-slate-600">{alert.ai_analysis}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                <Button size="sm" variant="outline" onClick={() => onViewDetails && onViewDetails(alert)}>
                  <Eye className="w-4 h-4 mr-1" /> Investigate
                </Button>
                {alert.status === 'new' && (
                  <>
                    <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => onAction && onAction(alert, 'confirm')}>
                      <CheckCircle className="w-4 h-4 mr-1" /> Confirm Threat
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onAction && onAction(alert, 'dismiss')}>
                      <XCircle className="w-4 h-4 mr-1" /> False Positive
                    </Button>
                  </>
                )}
                <Button size="sm" variant="outline" onClick={() => onAction && onAction(alert, 'notify')}>
                  <Send className="w-4 h-4 mr-1" /> Alert Team
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}