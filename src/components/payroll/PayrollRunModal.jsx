import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Play } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function PayrollRunModal({ onClose }) {
    const queryClient = useQueryClient();
    const [config, setConfig] = useState({ 
        start: '', 
        end: '', 
        posting: new Date().toISOString().split('T')[0],
        department: 'All' 
    });
    const [loading, setLoading] = useState(false);

    const handleRun = async () => {
        if (!config.start || !config.end) {
            toast.error("Please select start and end dates");
            return;
        }
        
        setLoading(true);
        try {
            // 1. Create Payroll Entry
            const entry = await base44.entities.PayrollEntry.create({
                start_date: config.start,
                end_date: config.end,
                posting_date: config.posting,
                department: config.department === 'All' ? null : config.department,
                status: 'Draft'
            });

            // 2. Simulate Slip Generation (Mock)
            await new Promise(r => setTimeout(r, 2000)); // Fake processing delay
            
            // Mock slips generation
            const mockEmployees = [
                { id: 'EMP-001', name: 'John Doe', dept: 'Engineering', desig: 'Senior Dev', gross: 8500, ded: 1200 },
                { id: 'EMP-002', name: 'Sarah Smith', dept: 'Marketing', desig: 'Marketing Lead', gross: 6200, ded: 800 },
                { id: 'EMP-003', name: 'Mike Johnson', dept: 'Sales', desig: 'Sales Executive', gross: 4500, ded: 500 },
            ];

            for (const emp of mockEmployees) {
                await base44.entities.SalarySlip.create({
                    employee: emp.id,
                    employee_name: emp.name,
                    start_date: config.start,
                    end_date: config.end,
                    gross_pay: emp.gross,
                    total_deduction: emp.ded,
                    net_pay: emp.gross - emp.ded,
                    status: 'Draft',
                    payroll_entry_id: entry.id,
                    // Extra fields for UI (assuming entity schema allows or we add them)
                    department: emp.dept, 
                    designation: emp.desig
                });
            }

            toast.success(`Payroll processed successfully. Generated ${mockEmployees.length} slips.`);
            queryClient.invalidateQueries(['payrollEntries']);
            queryClient.invalidateQueries(['salarySlips']);
            onClose();
        } catch (e) {
            toast.error("Payroll run failed: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" value={config.start} onChange={e => setConfig({...config, start: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" value={config.end} onChange={e => setConfig({...config, end: e.target.value})} />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Posting Date</Label>
                <Input type="date" value={config.posting} onChange={e => setConfig({...config, posting: e.target.value})} />
                <p className="text-xs text-slate-500">Date when the journal entry will be posted.</p>
            </div>

            <div className="space-y-2">
                <Label>Department (Optional)</Label>
                <Select value={config.department} onValueChange={v => setConfig({...config, department: v})}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Departments</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="HR">Human Resources</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="pt-2">
                <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700" 
                    onClick={handleRun}
                    disabled={loading}
                >
                    <Play className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> 
                    {loading ? 'Processing Batch...' : 'Generate Salary Slips'}
                </Button>
            </div>
        </div>
    );
}