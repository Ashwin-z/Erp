import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RefreshCw, AlertTriangle, CheckCircle2, Calendar, 
  ArrowRightLeft, Trash2, FileText, ShieldCheck,
  Zap, History, TrendingUp, FileCheck, Gavel
} from 'lucide-react';
import { toast } from 'sonner';

export default function RWALifecycleManager() {
    const [activeTab, setActiveTab] = useState('actions');
    const [actions, setActions] = useState([
        { id: 1, type: 'Dividend Payout', asset: 'TKN-001', amount: '$12,500', dueDate: '2024-12-01', status: 'Scheduled', auto: true, trigger: 'Quarterly Profit Threshold Met' },
        { id: 2, type: 'Coupon Payment', asset: 'TKN-004', amount: '$4,200', dueDate: '2024-12-15', status: 'Pending Approval', auto: false, trigger: 'Fixed Schedule' },
        { id: 3, type: 'Rate Adjustment', asset: 'TKN-002', amount: '+0.5%', dueDate: '2024-12-20', status: 'AI Suggested', auto: true, trigger: 'Market Rate Hike > 50bps' },
    ]);

    const [liquidations, setLiquidations] = useState([
        { id: 1, asset: 'TKN-003', type: 'Maturity Redemption', value: '$300,000', date: '2025-01-01', status: 'Scheduled', report: 'Ready' },
        { id: 2, asset: 'TKN-009', type: 'Early Liquidation', value: '$150,000', date: '2024-11-30', status: 'AI Risk Triggered', report: 'Generating...' },
    ]);

    const executeAction = (id) => {
        toast.success("Action executed on blockchain successfully");
        setActions(actions.map(a => a.id === id ? { ...a, status: 'Completed' } : a));
    };

    const generateReport = (id) => {
        toast.info("AI generating liquidation report...");
        setTimeout(() => {
            setLiquidations(liquidations.map(l => l.id === id ? { ...l, report: 'Ready' } : l));
            toast.success("Liquidation Report Generated");
        }, 2000);
    };

    return (
        <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="border-b border-slate-800">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-white flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-cyan-400" />
                        Lifecycle Automation
                    </CardTitle>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                            <Zap className="w-3 h-3 mr-1" /> AI Auto-Pilot Active
                        </Badge>
                        <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">
                            <TrendingUp className="w-3 h-3 mr-1" /> Market Feed: Live
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="px-4 pt-4 border-b border-slate-800">
                        <TabsList className="bg-transparent p-0">
                            <TabsTrigger value="actions" className="data-[state=active]:bg-transparent data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none px-4 pb-2">Corporate Actions</TabsTrigger>
                            <TabsTrigger value="end_of_life" className="data-[state=active]:bg-transparent data-[state=active]:text-red-400 data-[state=active]:border-b-2 data-[state=active]:border-red-400 rounded-none px-4 pb-2">Redemption & Liquidation</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="actions" className="m-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-800 hover:bg-transparent">
                                    <TableHead className="text-slate-400">Action Type</TableHead>
                                    <TableHead className="text-slate-400">Asset</TableHead>
                                    <TableHead className="text-slate-400">Value</TableHead>
                                    <TableHead className="text-slate-400">AI Trigger</TableHead>
                                    <TableHead className="text-slate-400">Status</TableHead>
                                    <TableHead className="text-slate-400 text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {actions.map((action) => (
                                    <TableRow key={action.id} className="border-slate-800 hover:bg-slate-800/50">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
                                                <span className="text-white font-medium">{action.type}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-300">{action.asset}</TableCell>
                                        <TableCell className="text-white">{action.amount}</TableCell>
                                        <TableCell className="text-slate-400 text-sm">
                                            <div className="flex items-center gap-1 text-xs">
                                                <Zap className="w-3 h-3 text-amber-400" />
                                                {action.trigger}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`
                                                ${action.status === 'Scheduled' ? 'bg-blue-500/20 text-blue-400' : 
                                                  action.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 
                                                  action.status.includes('AI') ? 'bg-purple-500/20 text-purple-400' :
                                                  'bg-amber-500/20 text-amber-400'}
                                            `}>
                                                {action.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {action.status !== 'Completed' && (
                                                <Button 
                                                    size="sm" 
                                                    variant="ghost" 
                                                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                                                    onClick={() => executeAction(action.id)}
                                                >
                                                    Execute
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>

                    <TabsContent value="end_of_life" className="m-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-800 hover:bg-transparent">
                                    <TableHead className="text-slate-400">Asset</TableHead>
                                    <TableHead className="text-slate-400">Type</TableHead>
                                    <TableHead className="text-slate-400">Est. Value</TableHead>
                                    <TableHead className="text-slate-400">Date</TableHead>
                                    <TableHead className="text-slate-400">Report</TableHead>
                                    <TableHead className="text-slate-400 text-right">Control</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {liquidations.map((item) => (
                                    <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/50">
                                        <TableCell className="font-medium text-white">{item.asset}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={item.type.includes('Risk') ? 'border-red-500/50 text-red-400' : 'border-slate-600 text-slate-400'}>
                                                {item.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-300">{item.value}</TableCell>
                                        <TableCell className="text-slate-400">{item.date}</TableCell>
                                        <TableCell>
                                            {item.report === 'Ready' ? (
                                                <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300 h-8">
                                                    <FileCheck className="w-3 h-3 mr-1" /> PDF Ready
                                                </Button>
                                            ) : (
                                                <span className="text-slate-500 text-xs italic">Generating...</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                size="sm" 
                                                className={item.report === 'Ready' ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-slate-700 text-slate-400"}
                                                disabled={item.report !== 'Ready'}
                                            >
                                                <Gavel className="w-3 h-3 mr-1" /> Initiate
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="p-4 bg-red-900/10 border-t border-red-900/30 flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            <p className="text-red-400/80 text-xs">
                                <strong>Warning:</strong> Liquidation events are irreversible on the blockchain. Ensure all legal reports are generated and verified before initiation.
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}