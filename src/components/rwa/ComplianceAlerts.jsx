import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Eye, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function ComplianceAlerts() {
    const alerts = [
        { id: 1, title: "Potential Structuring Detected", desc: "Investor WAL-009 made 4 transactions just below reporting threshold.", severity: "high", time: "2h ago" },
        { id: 2, title: "KYC Document Expiry", desc: "5 Accredited Investors have documents expiring in < 30 days.", severity: "medium", time: "5h ago" },
        { id: 3, title: "Restricted Region Access", desc: "Login attempt from sanctioned jurisdiction (Geo-IP blocked).", severity: "low", time: "1d ago" },
    ];

    return (
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
            <CardHeader className="pb-2 border-b border-slate-800/50">
                <CardTitle className="text-white flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    AI Compliance Watch
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-800/50">
                    {alerts.map((alert) => (
                        <div key={alert.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={`text-sm font-medium ${alert.severity === 'high' ? 'text-red-400' : 'text-amber-400'}`}>
                                    {alert.title}
                                </h4>
                                <span className="text-slate-600 text-[10px]">{alert.time}</span>
                            </div>
                            <p className="text-slate-400 text-xs mb-3 leading-relaxed">{alert.desc}</p>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="h-6 text-[10px] border-slate-700 text-slate-300 hover:bg-slate-800">
                                    <Eye className="w-3 h-3 mr-1" /> Investigate
                                </Button>
                                <Button size="sm" variant="ghost" className="h-6 text-[10px] text-slate-500 hover:text-white">
                                    Dismiss
                                </Button>
                            </div>
                        </div>
                    ))}
                    {alerts.length === 0 && (
                        <div className="p-8 text-center">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mx-auto mb-2" />
                            <p className="text-slate-500 text-sm">No active alerts</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}