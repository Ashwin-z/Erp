import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, Search, Eye, Shield, AlertTriangle, Activity,
  MapPin, Clock, Monitor, Smartphone, Globe, Lock
} from 'lucide-react';

export default function UserActivityTracker({ users }) {
  const [searchTerm, setSearchTerm] = useState('');

  const sampleUsers = users || [
    { email: 'sarah@techstart.com', name: 'Sarah Chen', role: 'CFO', status: 'online', risk_score: 5, last_activity: 'Viewing Dashboard', location: 'Singapore', device: 'Desktop', sessions: 1, data_accessed: 23, last_seen: 'Just now' },
    { email: 'john@techstart.com', name: 'John Smith', role: 'Manager', status: 'online', risk_score: 45, last_activity: 'Exporting Financial Data', location: 'Bangkok, TH', device: 'Mobile', sessions: 2, data_accessed: 156, last_seen: '2 mins ago', flagged: true },
    { email: 'mike@techstart.com', name: 'Mike Johnson', role: 'Analyst', status: 'online', risk_score: 12, last_activity: 'Searching customers', location: 'Singapore', device: 'Desktop', sessions: 1, data_accessed: 45, last_seen: '5 mins ago' },
    { email: 'anna@techstart.com', name: 'Anna Lee', role: 'Admin', status: 'offline', risk_score: 3, last_activity: 'Settings update', location: 'Singapore', device: 'Desktop', sessions: 0, data_accessed: 12, last_seen: '1 hour ago' }
  ];

  const getRiskBadge = (score) => {
    if (score >= 70) return <Badge className="bg-red-500">Critical</Badge>;
    if (score >= 40) return <Badge className="bg-orange-500">High</Badge>;
    if (score >= 20) return <Badge className="bg-amber-500">Medium</Badge>;
    return <Badge className="bg-green-500">Low</Badge>;
  };

  const filteredUsers = sampleUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          User Activity Tracker
        </CardTitle>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredUsers.map((user, i) => (
            <div 
              key={i}
              className={`p-4 rounded-xl border ${user.flagged ? 'border-orange-300 bg-orange-50' : 'bg-slate-50'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.status === 'online' ? 'bg-green-500' : 'bg-slate-400'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{user.name}</span>
                      {user.flagged && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                      {getRiskBadge(user.risk_score)}
                    </div>
                    <p className="text-sm text-slate-500">{user.email} • {user.role}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      <Activity className="w-3 h-3 inline mr-1" />
                      {user.last_activity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-lg">{user.data_accessed}</p>
                    <p className="text-xs text-slate-500">Data Access</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg">{user.sessions}</p>
                    <p className="text-xs text-slate-500">Sessions</p>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    {user.device === 'Desktop' ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                    <span className="text-xs">{user.device}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs">{user.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <Clock className="w-3 h-3" />
                    {user.last_seen}
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" /> Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}