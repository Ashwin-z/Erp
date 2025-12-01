import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, AlertTriangle, Eye, Lock, UserX, Activity,
  TrendingUp, TrendingDown
} from 'lucide-react';

export default function SecurityDashboardStats({ stats }) {
  const defaultStats = stats || {
    totalEvents: 12847,
    activeAlerts: 3,
    criticalAlerts: 1,
    blockedAttempts: 47,
    activeUsers: 23,
    suspiciousActivities: 5,
    threatsBlocked: 156,
    dataAccessEvents: 892
  };

  const statCards = [
    { label: 'Active Alerts', value: defaultStats.activeAlerts, icon: AlertTriangle, color: 'bg-red-500', trend: -12 },
    { label: 'Critical Threats', value: defaultStats.criticalAlerts, icon: Shield, color: 'bg-red-600', trend: null },
    { label: 'Blocked Attempts', value: defaultStats.blockedAttempts, icon: Lock, color: 'bg-amber-500', trend: 8 },
    { label: 'Suspicious Activities', value: defaultStats.suspiciousActivities, icon: Eye, color: 'bg-purple-500', trend: -5 },
    { label: 'Active Sessions', value: defaultStats.activeUsers, icon: Activity, color: 'bg-blue-500', trend: 3 },
    { label: 'Threats Blocked (30d)', value: defaultStats.threatsBlocked, icon: UserX, color: 'bg-green-500', trend: 15 }
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
          <Card className={stat.value > 0 && (stat.label.includes('Critical') || stat.label.includes('Alert')) ? 'border-red-200 bg-red-50' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                {stat.trend !== null && (
                  <div className={`flex items-center text-xs ${stat.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(stat.trend)}%
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}