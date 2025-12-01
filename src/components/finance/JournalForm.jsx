import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function JournalForm({ onSuccess }) {
    const queryClient = useQueryClient();
    const [header, setHeader] = useState({
        posting_date: new Date().toISOString().split('T')[0],
        entry_type: 'Journal Entry',
        reference_number: '',
        narration: '',
        currency: 'USD',
        exchange_rate: 1.0
    });

    const [lines, setLines] = useState([
        { account_code: '', debit: 0, credit: 0, description: '' },
        { account_code: '', debit: 0, credit: 0, description: '' }
    ]);

    const { data: accounts } = useQuery({
        queryKey: ['glAccountsFlat'],
        queryFn: () => base44.entities.GLAccount.list()
    });

    // Filter only leaf accounts (not groups)
    const activeAccounts = accounts?.filter(a => !a.is_group) || [];

    const handleLineChange = (index, field, value) => {
        const newLines = [...lines];
        newLines[index][field] = value;
        setLines(newLines);
    };

    const addLine = () => {
        setLines([...lines, { account_code: '', debit: 0, credit: 0, description: '' }]);
    };

    const removeLine = (index) => {
        if (lines.length <= 2) return;
        const newLines = lines.filter((_, i) => i !== index);
        setLines(newLines);
    };

    const totals = lines.reduce((acc, line) => ({
        debit: acc.debit + (parseFloat(line.debit) || 0),
        credit: acc.credit + (parseFloat(line.credit) || 0)
    }), { debit: 0, credit: 0 });

    const isBalanced = Math.abs(totals.debit - totals.credit) < 0.01;

    const handleSubmit = async () => {
        if (!isBalanced) {
            toast.error("Journal entry is not balanced");
            return;
        }
        if (totals.debit === 0) {
            toast.error("Total amount cannot be zero");
            return;
        }

        try {
            await base44.entities.JournalEntry.create({
                ...header,
                total_debit: totals.debit,
                total_credit: totals.credit,
                lines: lines.map(l => ({
                    ...l,
                    debit: parseFloat(l.debit) || 0,
                    credit: parseFloat(l.credit) || 0
                })),
                status: 'Draft'
            });
            toast.success("Journal Entry Created");
            queryClient.invalidateQueries(['journals']);
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error("Failed to create journal: " + error.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Posting Date</Label>
                    <Input type="date" value={header.posting_date} onChange={e => setHeader({...header, posting_date: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label>Entry Type</Label>
                    <Select value={header.entry_type} onValueChange={v => setHeader({...header, entry_type: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Journal Entry">Journal Entry</SelectItem>
                            <SelectItem value="Opening Entry">Opening Entry</SelectItem>
                            <SelectItem value="Accrual">Accrual</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Reference</Label>
                    <Input placeholder="e.g. INV-001" value={header.reference_number} onChange={e => setHeader({...header, reference_number: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label>Narration</Label>
                    <Input placeholder="Description for this entry..." value={header.narration} onChange={e => setHeader({...header, narration: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label>Currency</Label>
                    <div className="flex gap-2">
                        <Input className="w-24" value={header.currency} onChange={e => setHeader({...header, currency: e.target.value})} />
                        <Input 
                            type="number" 
                            className="w-24" 
                            value={header.exchange_rate} 
                            onChange={e => setHeader({...header, exchange_rate: parseFloat(e.target.value)})} 
                            placeholder="Rate"
                        />
                    </div>
                </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="p-3 text-left font-medium text-slate-600">Account</th>
                            <th className="p-3 text-left font-medium text-slate-600">Description</th>
                            <th className="p-3 text-right font-medium text-slate-600 w-32">Debit</th>
                            <th className="p-3 text-right font-medium text-slate-600 w-32">Credit</th>
                            <th className="p-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {lines.map((line, i) => (
                            <tr key={i} className="bg-white">
                                <td className="p-2">
                                    <select 
                                        className="w-full p-2 border rounded bg-transparent"
                                        value={line.account_code}
                                        onChange={e => handleLineChange(i, 'account_code', e.target.value)}
                                    >
                                        <option value="">Select Account...</option>
                                        {activeAccounts.map(acc => (
                                            <option key={acc.id} value={acc.account_code}>
                                                {acc.account_code} - {acc.account_name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-2">
                                    <Input 
                                        value={line.description} 
                                        onChange={e => handleLineChange(i, 'description', e.target.value)}
                                        className="border-0 shadow-none focus-visible:ring-0 bg-transparent"
                                        placeholder="Line description..."
                                    />
                                </td>
                                <td className="p-2">
                                    <Input 
                                        type="number" 
                                        value={line.debit} 
                                        onChange={e => {
                                            handleLineChange(i, 'debit', e.target.value);
                                            if(parseFloat(e.target.value) > 0) handleLineChange(i, 'credit', 0);
                                        }}
                                        className="text-right border-0 shadow-none focus-visible:ring-0 bg-transparent"
                                    />
                                </td>
                                <td className="p-2">
                                    <Input 
                                        type="number" 
                                        value={line.credit} 
                                        onChange={e => {
                                            handleLineChange(i, 'credit', e.target.value);
                                            if(parseFloat(e.target.value) > 0) handleLineChange(i, 'debit', 0);
                                        }}
                                        className="text-right border-0 shadow-none focus-visible:ring-0 bg-transparent"
                                    />
                                </td>
                                <td className="p-2 text-center">
                                    <button onClick={() => removeLine(i)} className="text-slate-400 hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-slate-50 font-semibold border-t">
                        <tr>
                            <td colSpan={2} className="p-3 text-right">Total</td>
                            <td className="p-3 text-right font-mono">${totals.debit.toFixed(2)}</td>
                            <td className="p-3 text-right font-mono">${totals.credit.toFixed(2)}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="flex justify-between items-center">
                <Button variant="outline" onClick={addLine} size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Add Line
                </Button>
                <div className="flex items-center gap-4">
                    {!isBalanced && (
                        <span className="text-sm text-red-600 flex items-center font-medium">
                            <AlertCircle className="w-4 h-4 mr-1" /> Out of balance by ${(totals.debit - totals.credit).toFixed(2)}
                        </span>
                    )}
                    <Button onClick={handleSubmit} disabled={!isBalanced} className="bg-emerald-600 hover:bg-emerald-700">
                        <Save className="w-4 h-4 mr-2" /> Save Draft
                    </Button>
                </div>
            </div>
        </div>
    );
}