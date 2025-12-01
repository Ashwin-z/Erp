import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Globe, Zap, AlertTriangle, ArrowRight, 
  ShieldAlert, CheckCircle2, TrendingUp 
} from 'lucide-react';
import { toast } from 'sonner';

const regulatoryFeed = [
    {
        id: 1,
        source: "MAS (Monetary Authority of Singapore)",
        title: "Updated Guidelines on Digital Asset Tokenisation",
        date: "2024-11-28",
        impact_level: "High",
        ai_analysis: "New requirements for accredited investor verification frequency. Affects RWA Pool #4.",
        action_required: "Update KYC intervals from 12m to 6m.",
        status: "Pending Action"
    },
    {
        id: 2,
        source: "SEC (US)",
        title: "Rule 144 Exemption Clarifications",
        date: "2024-11-27",
        impact_level: "Medium",
        ai_analysis: "Minor adjustments to holding period calculations for US investors.",
        action_required: "Review US Investor automated lock-up rules.",
        status: "Analysis Complete"
    },
    {
        id: 3,
        source: "Global AML Watchlist",
        title: "Sanctions List Update (Batch #2024-11-28)",
        date: "2024-11-28",
        impact_level: "Critical",
        ai_analysis: "3 existing wallet addresses in Liquidity Pool A matched new sanctions.",
        action_required: "Immediate freeze of assets required.",
        status: "Urgent"
    }
];

export default function RegulatoryImpactMonitor() {
    const [alerts, setAlerts] = useState(regulatoryFeed);
    const [scanning, setScanning] = useState(false);

    const runScan = () => {
        setScanning(true);
        toast.info("AI Scanning Global Regulatory Feeds...");
        
        setTimeout(() => {
            setScanning(false);
            toast.success("Scan Complete: No new critical threats found.");
        }, 2500);
    };

    const handleAutoFix = (id) => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 2000)),
            {
                loading: 'AI Applying Compliance Patches...',
                success: 'Rules Updated & Reports Regenerated',
                error: 'Failed to update'
            }
        );
        setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'Resolved', action_required: 'Automated Fix Applied' } : a));
    };

    return (
        <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2 text-lg">
                        <Globe className="w-5 h-5 text-cyan-400" />
                        Global Regulatory Monitor
                    </CardTitle>
                    <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={runScan}
                        disabled={scanning}
                        className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                    >
                        {scanning ? <Zap className="w-4 h-4 mr-2 animate-pulse" /> : <Zap className="w-4 h-4 mr-2" />}
                        {scanning ? 'Analyzing...' : 'Scan Now'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {alerts.map((item) => (
                    <Alert key={item.id} className={`
                        border-0 bg-opacity-10 
                        ${item.impact_level === 'Critical' ? 'bg-red-500 border-l-4 border-red-500' : 
                          item.impact_level === 'High' ? 'bg-amber-500 border-l-4 border-amber-500' : 
                          'bg-blue-500 border-l-4 border-blue-500'}
                    `}>
                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                {item.impact_level === 'Critical' ? <ShieldAlert className="w-5 h-5 text-red-400" /> :
                                 item.impact_level === 'High' ? <AlertTriangle className="w-5 h-5 text-amber-400" /> :
                                 <TrendingUp className="w-5 h-5 text-blue-400" />}
                            </div>
                            <div className="flex-1">
                                <AlertTitle className="text-white flex items-center justify-between">
                                    <span>{item.source}: {item.title}</span>
                                    <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                                        {item.date}
                                    </Badge>
                                </AlertTitle>
                                <AlertDescription className="mt-2 text-slate-300 text-sm space-y-2">
                                    <p><strong className="text-cyan-400">AI Analysis:</strong> {item.ai_analysis}</p>
                                    <div className="flex items-center gap-2 p-2 bg-slate-900/50 rounded border border-slate-700/50">
                                        <ArrowRight className="w-4 h-4 text-slate-500" />
                                        <span className="text-white font-medium">{item.action_required}</span>
                                    </div>
                                </AlertDescription>
                                
                                {item.status !== 'Resolved' && (
                                    <div className="mt-3 flex gap-2">
                                        <Button 
                                            size="sm" 
                                            className="bg-cyan-500 hover:bg-cyan-600 text-white border-0"
                                            onClick={() => handleAutoFix(item.id)}
                                        >
                                            <Zap className="w-3 h-3 mr-2" /> Auto-Implement Fix
                                        </Button>
                                        <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                                            View Source
                                        </Button>
                                    </div>
                                )}
                                {item.status === 'Resolved' && (
                                    <div className="mt-2 flex items-center gap-2 text-emerald-400 text-sm">
                                        <CheckCircle2 className="w-4 h-4" /> Resolved via AI Automation
                                    </div>
                                )}
                            </div>
                        </div>
                    </Alert>
                ))}
            </CardContent>
        </Card>
    );
}