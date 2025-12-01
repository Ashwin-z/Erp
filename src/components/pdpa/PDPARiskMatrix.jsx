import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, Users, Database, FileText, Download, 
  Share2, Trash2, Eye, Shield
} from 'lucide-react';

export default function PDPARiskMatrix() {
  const riskMatrix = [
    { action: 'Export Customer Data', icon: Download, impact: 'high', likelihood: 'medium', risk: 'high', controls: ['Require DPO approval', 'Log all exports', 'Limit to 100 records'] },
    { action: 'Bulk Delete Records', icon: Trash2, impact: 'critical', likelihood: 'low', risk: 'high', controls: ['Require admin approval', '48hr recovery window', 'Full audit trail'] },
    { action: 'Share Personal Data', icon: Share2, impact: 'high', likelihood: 'high', risk: 'critical', controls: ['Block external sharing', 'Encrypt in transit', 'Consent verification'] },
    { action: 'View Sensitive Records', icon: Eye, impact: 'medium', likelihood: 'high', risk: 'medium', controls: ['Role-based access', 'Session logging', 'Auto-timeout'] },
    { action: 'Access HR Data', icon: Users, impact: 'high', likelihood: 'medium', risk: 'high', controls: ['HR role required', 'Need-to-know basis', 'Audit all access'] },
    { action: 'Download Financial Reports', icon: FileText, impact: 'medium', likelihood: 'medium', risk: 'medium', controls: ['Watermark files', 'Track downloads', 'Expiring links'] }
  ];

  const riskColors = {
    critical: 'bg-red-500 text-white',
    high: 'bg-orange-500 text-white',
    medium: 'bg-amber-500 text-white',
    low: 'bg-green-500 text-white'
  };

  const impactColors = {
    critical: 'text-red-600 bg-red-100',
    high: 'text-orange-600 bg-orange-100',
    medium: 'text-amber-600 bg-amber-100',
    low: 'text-green-600 bg-green-100'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-500" />
          PDPA Risk Assessment Matrix
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left p-3 font-medium">Action</th>
                <th className="text-center p-3 font-medium">Impact</th>
                <th className="text-center p-3 font-medium">Likelihood</th>
                <th className="text-center p-3 font-medium">Risk Level</th>
                <th className="text-left p-3 font-medium">Controls Applied</th>
              </tr>
            </thead>
            <tbody>
              {riskMatrix.map((item, i) => (
                <tr key={i} className="border-b hover:bg-slate-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-slate-500" />
                      <span className="font-medium">{item.action}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <Badge className={impactColors[item.impact]}>{item.impact}</Badge>
                  </td>
                  <td className="p-3 text-center">
                    <Badge className={impactColors[item.likelihood]}>{item.likelihood}</Badge>
                  </td>
                  <td className="p-3 text-center">
                    <Badge className={riskColors[item.risk]}>{item.risk.toUpperCase()}</Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {item.controls.map((control, j) => (
                        <Badge key={j} variant="outline" className="text-xs">{control}</Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Risk Legend */}
        <div className="mt-4 p-4 bg-slate-50 rounded-lg">
          <p className="text-sm font-medium mb-2">Risk Level Legend:</p>
          <div className="flex gap-4">
            <Badge className="bg-red-500">Critical: Immediate block + alert</Badge>
            <Badge className="bg-orange-500">High: Require approval + log</Badge>
            <Badge className="bg-amber-500">Medium: Warning + log</Badge>
            <Badge className="bg-green-500">Low: Log only</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}