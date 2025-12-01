import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { 
  FileText, Search, Filter, Eye, Download, CheckCircle,
  AlertTriangle, XCircle, Clock, User, MapPin
} from 'lucide-react';
import moment from 'moment';

const riskColors = {
  critical: 'bg-red-500 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-amber-500 text-white',
  low: 'bg-green-500 text-white'
};

const statusConfig = {
  detected: { color: 'bg-blue-100 text-blue-700', icon: Eye },
  warned: { color: 'bg-amber-100 text-amber-700', icon: AlertTriangle },
  acknowledged: { color: 'bg-purple-100 text-purple-700', icon: CheckCircle },
  blocked: { color: 'bg-red-100 text-red-700', icon: XCircle },
  resolved: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
  escalated: { color: 'bg-orange-100 text-orange-700', icon: AlertTriangle }
};

export default function PDPAIncidentLog({ incidents, onViewDetails }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const sampleIncidents = incidents || [
    { id: 1, user_email: 'john@techstart.com', user_name: 'John Smith', user_role: 'Sales Manager', action_type: 'data_export', resource_name: 'Customer Database', records_affected: 1250, risk_level: 'high', status: 'warned', ip_address: '103.45.67.89', location: 'Bangkok, TH', created_date: new Date().toISOString(), user_acknowledged: true },
    { id: 2, user_email: 'sarah@techstart.com', user_name: 'Sarah Chen', user_role: 'CFO', action_type: 'view_restricted', resource_name: 'Employee Salaries', records_affected: 45, risk_level: 'medium', status: 'resolved', ip_address: '192.168.1.45', location: 'Singapore', created_date: moment().subtract(1, 'hour').toISOString(), user_acknowledged: true },
    { id: 3, user_email: 'mike@techstart.com', user_name: 'Mike Johnson', user_role: 'Marketing', action_type: 'bulk_delete', resource_name: 'Contact Records', records_affected: 500, risk_level: 'critical', status: 'blocked', ip_address: '192.168.1.78', location: 'Singapore', created_date: moment().subtract(2, 'hours').toISOString(), user_acknowledged: false },
    { id: 4, user_email: 'anna@techstart.com', user_name: 'Anna Lee', user_role: 'HR', action_type: 'data_share', resource_name: 'Employee Records', records_affected: 120, risk_level: 'high', status: 'escalated', ip_address: '192.168.1.22', location: 'Singapore', created_date: moment().subtract(4, 'hours').toISOString(), user_acknowledged: true }
  ];

  const filteredIncidents = sampleIncidents.filter(inc => {
    const matchSearch = inc.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        inc.resource_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRisk = filterRisk === 'all' || inc.risk_level === filterRisk;
    const matchStatus = filterStatus === 'all' || inc.status === filterStatus;
    return matchSearch && matchRisk && matchStatus;
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-500" />
          PDPA Incident Log
        </CardTitle>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by user or resource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterRisk} onValueChange={setFilterRisk}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Risk Level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risks</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="detected">Detected</SelectItem>
              <SelectItem value="warned">Warned</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Incidents List */}
        <div className="space-y-3">
          {filteredIncidents.map((inc) => {
            const StatusIcon = statusConfig[inc.status]?.icon || Eye;
            return (
              <div 
                key={inc.id}
                className={`p-4 rounded-xl border ${inc.risk_level === 'critical' || inc.risk_level === 'high' ? 'bg-red-50 border-red-200' : 'bg-slate-50'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {inc.user_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{inc.user_name}</span>
                        <Badge variant="outline">{inc.user_role}</Badge>
                        <Badge className={riskColors[inc.risk_level]}>{inc.risk_level}</Badge>
                        <Badge className={statusConfig[inc.status]?.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {inc.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        <span className="font-medium">{inc.action_type.replace('_', ' ').toUpperCase()}</span> on {inc.resource_name}
                      </p>
                      <p className="text-sm text-red-600">
                        {inc.records_affected.toLocaleString()} records affected
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{inc.user_email}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{inc.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{moment(inc.created_date).fromNow()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {inc.user_acknowledged && (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" /> Acknowledged
                      </Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={() => onViewDetails && onViewDetails(inc)}>
                      <Eye className="w-4 h-4 mr-1" /> Details
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