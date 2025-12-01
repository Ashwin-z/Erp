import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Rocket, AlertTriangle, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const IFRS_MASTER_COA = [
    { code: '1000', name: 'Assets', type: 'Asset', group: true },
    { code: '1100', name: 'Current Assets', type: 'Asset', group: true, parent: '1000' },
    { code: '1110', name: 'Cash & Equivalents', type: 'Asset', group: true, parent: '1100' },
    { code: '1111', name: 'Petty Cash', type: 'Asset', group: false, parent: '1110' },
    { code: '1112', name: 'Bank - Main Account', type: 'Asset', group: false, parent: '1110' },
    { code: '1120', name: 'Accounts Receivable', type: 'Asset', group: false, parent: '1100' },
    { code: '1200', name: 'Non-Current Assets', type: 'Asset', group: true, parent: '1000' },
    { code: '1210', name: 'Property, Plant & Equipment', type: 'Asset', group: true, parent: '1200' },
    { code: '1211', name: 'Computers & IT Equipment', type: 'Asset', group: false, parent: '1210' },
    
    { code: '2000', name: 'Liabilities', type: 'Liability', group: true },
    { code: '2100', name: 'Current Liabilities', type: 'Liability', group: true, parent: '2000' },
    { code: '2110', name: 'Accounts Payable', type: 'Liability', group: false, parent: '2100' },
    { code: '2120', name: 'Tax Payable', type: 'Liability', group: false, parent: '2100' },
    
    { code: '3000', name: 'Equity', type: 'Equity', group: true },
    { code: '3100', name: 'Share Capital', type: 'Equity', group: false, parent: '3000' },
    { code: '3200', name: 'Retained Earnings', type: 'Equity', group: false, parent: '3000' },
    
    { code: '4000', name: 'Revenue', type: 'Income', group: true },
    { code: '4100', name: 'Operating Revenue', type: 'Income', group: true, parent: '4000' },
    { code: '4110', name: 'Sales - Services', type: 'Income', group: false, parent: '4100' },
    
    { code: '5000', name: 'Cost of Sales', type: 'Expense', group: true },
    { code: '5100', name: 'Direct Costs', type: 'Expense', group: false, parent: '5000' },
    
    { code: '6000', name: 'Operating Expenses', type: 'Expense', group: true },
    { code: '6100', name: 'Administrative Expenses', type: 'Expense', group: true, parent: '6000' },
    { code: '6110', name: 'Rent', type: 'Expense', group: false, parent: '6100' },
    { code: '6120', name: 'Salaries', type: 'Expense', group: false, parent: '6100' }
];

export default function FinanceSetup() {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const runSetup = async () => {
        setLoading(true);
        setProgress(0);
        try {
            // 1. Clean existing (Simulated)
            // await base44.entities.GLAccount.deleteMany({}); 
            
            // 2. Create Accounts
            const total = IFRS_MASTER_COA.length;
            for (let i = 0; i < total; i++) {
                const acc = IFRS_MASTER_COA[i];
                
                // Find parent ID if exists (Mocking simple lookup since we create in order)
                let parentId = null;
                if (acc.parent) {
                    const parents = await base44.entities.GLAccount.list({ account_code: acc.parent }, 1);
                    if (parents.length > 0) parentId = parents[0].id;
                }

                await base44.entities.GLAccount.create({
                    account_code: acc.code,
                    account_name: acc.name,
                    is_group: acc.group,
                    root_type: acc.type,
                    parent_account: parentId
                });
                
                setProgress(Math.round(((i + 1) / total) * 100));
            }
            
            toast.success("Chart of Accounts Initialized Successfully!");
        } catch (e) {
            console.error(e);
            toast.error("Setup failed: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Initialize Master Data</CardTitle>
                    <CardDescription>
                        Install standard IFRS-compliant Chart of Accounts and default configuration.
                        Warning: This is for initial setup only.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                        <div className="text-sm text-amber-800">
                            This process creates 25+ standard GL accounts including Assets, Liabilities, Equity, Income, and Expense structures.
                        </div>
                    </div>
                    
                    {loading && (
                        <div className="space-y-2">
                            <Progress value={progress} />
                            <p className="text-xs text-center text-slate-500">Creating accounts... {progress}%</p>
                        </div>
                    )}

                    <Button onClick={runSetup} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700">
                        <Rocket className="w-4 h-4 mr-2" /> 
                        {loading ? 'Initializing...' : 'Install Standard CoA'}
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Migration Tools</CardTitle>
                    <CardDescription>Import data from legacy systems or CSV.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">1. Import Chart of Accounts</h4>
                        <Button variant="outline" className="w-full justify-start">
                            Upload CSV...
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">2. Import Opening Balances</h4>
                        <Button variant="outline" className="w-full justify-start">
                            Upload Journal CSV...
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}