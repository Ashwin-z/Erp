import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { DollarSign, Play, Download, FileText, Plus, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from '@/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import PayrollStats from '@/components/payroll/PayrollStats';
import PayrollTable from '@/components/payroll/PayrollTable';
import PayrollRunModal from '@/components/payroll/PayrollRunModal';
import PayrollSOP from '@/components/payroll/PayrollSOP';
import PayrollAIAuditor from '@/components/payroll/PayrollAIAuditor';
import SalaryStructureBuilder from '@/components/payroll/SalaryStructureBuilder';
import TaxFormGenerator from '@/components/payroll/TaxFormGenerator';

export default function Payroll() {
    const [activeTab, setActiveTab] = useState('slips');
    const [isRunOpen, setIsRunOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: slips, isLoading: slipsLoading } = useQuery({
        queryKey: ['salarySlips'],
        queryFn: () => base44.entities.SalarySlip.list('-posting_date', 50),
        initialData: []
    });

    // Filter logic for the table
    const filteredSlips = slips.filter(slip => 
        slip.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slip.employee?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50/50 p-6">
            <PageHeader 
                title="Payroll Processing" 
                subtitle="Manage salaries, payslips, and batch runs"
                icon={DollarSign}
                iconColor="text-emerald-600"
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" /> Export Report
                        </Button>
                        <Dialog open={isRunOpen} onOpenChange={setIsRunOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-sm">
                                    <Play className="w-4 h-4 mr-2" /> Run Payroll
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Run Payroll Batch</DialogTitle>
                                </DialogHeader>
                                <PayrollRunModal onClose={() => setIsRunOpen(false)} />
                            </DialogContent>
                        </Dialog>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="lg:col-span-3">
                    <PayrollStats />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <PayrollAIAuditor />
                    <TaxFormGenerator />
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-white border shadow-sm p-1">
                    <TabsTrigger value="slips" className="px-4">Salary Slips</TabsTrigger>
                    <TabsTrigger value="sop" className="px-4">SOP Guide</TabsTrigger>
                    <TabsTrigger value="structures" className="px-4">Structures & Rules</TabsTrigger>
                </TabsList>

                <TabsContent value="slips" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input 
                                placeholder="Search employees..." 
                                className="pl-9 bg-white" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">Filter Period</Button>
                        </div>
                    </div>

                    <Card className="border-none shadow-sm">
                        <CardContent className="p-0">
                            <PayrollTable slips={filteredSlips} loading={slipsLoading} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="sop">
                    <div className="max-w-4xl mx-auto">
                        <PayrollSOP />
                    </div>
                </TabsContent>

                <TabsContent value="structures">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Structure Configuration</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <SalaryStructureBuilder />
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-6">
                            <Card className="bg-indigo-50 border-indigo-100">
                                <CardHeader>
                                    <CardTitle className="text-sm text-indigo-800">Tax Rules (2024)</CardTitle>
                                </CardHeader>
                                <CardContent className="text-xs space-y-2 text-indigo-700">
                                    <p>• Progressive Tax Rate applied automatically.</p>
                                    <p>• CPF/EPF capping at $6,000 wage ceiling.</p>
                                    <p>• Foreign Worker Levy auto-calculated based on tier.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}