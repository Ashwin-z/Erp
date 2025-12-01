import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Folder, FileText, ChevronRight, ChevronDown, Plus, MoreVertical } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CoANode = ({ account, level = 0, onSelect }) => {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = account.children && account.children.length > 0;

    return (
        <div className="select-none">
            <div 
                className={`flex items-center py-2 px-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 ${level === 0 ? 'font-semibold bg-slate-50/50' : ''}`}
                style={{ paddingLeft: `${level * 20 + 12}px` }}
                onClick={() => {
                    if(hasChildren) setExpanded(!expanded);
                    onSelect(account);
                }}
            >
                <div className="w-6 flex justify-center mr-2">
                    {hasChildren ? (
                        expanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />
                    ) : (
                        <div className="w-4" />
                    )}
                </div>
                <span className={`mr-3 font-mono text-sm ${account.is_group ? 'text-slate-800' : 'text-slate-600'}`}>
                    {account.account_code}
                </span>
                <span className="flex-1 text-sm text-slate-700 truncate">
                    {account.account_name}
                </span>
                <Badge variant="outline" className={`text-xs ml-2 ${account.root_type === 'Asset' ? 'text-blue-600 bg-blue-50' : account.root_type === 'Liability' ? 'text-red-600 bg-red-50' : ''}`}>
                    {account.root_type}
                </Badge>
            </div>
            {expanded && hasChildren && (
                <div>
                    {account.children.map(child => (
                        <CoANode key={child.id} account={child} level={level + 1} onSelect={onSelect} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function GeneralLedgerView() {
    const { data: accounts, isLoading } = useQuery({
        queryKey: ['glAccounts'],
        queryFn: () => base44.entities.GLAccount.list('account_code', 1000)
    });

    const buildTree = (flatAccounts) => {
        if (!flatAccounts) return [];
        const map = {};
        const roots = [];
        
        // Sort by code for order
        const sorted = [...flatAccounts].sort((a,b) => a.account_code.localeCompare(b.account_code));

        // Initialize map
        sorted.forEach(acc => {
            map[acc.id] = { ...acc, children: [] };
        });

        // Build hierarchy
        sorted.forEach(acc => {
            if (acc.parent_account && map[acc.parent_account]) {
                map[acc.parent_account].children.push(map[acc.id]);
            } else {
                roots.push(map[acc.id]);
            }
        });
        return roots;
    };

    const treeData = buildTree(accounts);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            <Card className="col-span-2 overflow-hidden flex flex-col">
                <div className="p-4 border-b flex justify-between items-center bg-white">
                    <h3 className="font-semibold text-slate-800">Chart of Accounts</h3>
                    <div className="flex gap-2">
                         <Button size="sm" variant="outline"><FileText className="w-4 h-4 mr-2"/> Export CSV</Button>
                         <Button size="sm"><Plus className="w-4 h-4 mr-2"/> New Account</Button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto bg-white">
                    {isLoading ? (
                        <div className="p-8 text-center text-slate-500">Loading Chart of Accounts...</div>
                    ) : (
                        treeData.map(root => <CoANode key={root.id} account={root} onSelect={() => {}} />)
                    )}
                </div>
            </Card>

            <Card className="p-6 space-y-6">
                <div>
                    <h3 className="font-semibold mb-4">Account Details</h3>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center text-slate-500">
                        Select an account to view details, balances, and recent transactions.
                    </div>
                </div>
                
                <div className="pt-6 border-t">
                     <h3 className="font-semibold mb-4">Quick Actions</h3>
                     <div className="grid grid-cols-2 gap-3">
                         <Button variant="outline" className="justify-start">View Ledger</Button>
                         <Button variant="outline" className="justify-start">Edit Account</Button>
                         <Button variant="outline" className="justify-start">Budgeting</Button>
                         <Button variant="outline" className="justify-start text-red-600 hover:bg-red-50">Disable</Button>
                     </div>
                </div>
            </Card>
        </div>
    );
}