import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, Users, 
  FileText, TrendingUp, TrendingDown
} from 'lucide-react';

export default function PDPADashboardStats({ stats }) {
  const defaultStats = stats || {
    complianceScore: 94,
    activeIncidents: 3,
    resolvedToday: 12,
    blockedActions: 8,
    trainedUsers: 156,
    pendingConsents: 23,
    riskLevel: 'low'
  };

  const statCards = [
    { label: 'Compliance Score', value: `${defaultStats.complianceScore}%`, icon: Shield, color: defaultStats.complianceScore >= 90 ? 'bg-green-500' : defaultStats.complianceScore >= 70 ? 'bg-amber-500' : 'bg-red-500', trend: 3 },
    { label: 'Active Incidents', value: defaultStats.activeIncidents, icon: AlertTriangle, color: 'bg-red-500', trend: -15 },
    { label: 'Resolved Today', value: defaultStats.resolvedToday, icon: CheckCircle, color: 'bg-green-500', trend: 8 },
    { label: 'Blocked Actions', value: defaultStats.blockedActions, icon: XCircle, color: 'bg-orange-500', trend: 5 },
    { label: 'Trained Users', value: defaultStats.trainedUsers, icon: Users, color: 'bg-blue-500', trend: 12 },
    { label: 'Pending Consents', value: defaultStats.pendingConsents, icon: FileText, color: 'bg-purple-500', trend: -4 }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                {stat.trend !== undefined && (
                  <div className={`flex items-center text-xs ${stat.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(stat.trend)}%
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}