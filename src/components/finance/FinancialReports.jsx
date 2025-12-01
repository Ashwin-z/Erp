import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Download, Calendar, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ReferenceLine } from 'recharts';

const forecastData = [
    { month: 'Nov', actual: 450000, predicted: 450000 },
    { month: 'Dec', actual: null, predicted: 480000 },
    { month: 'Jan', actual: null, predicted: 460000 },
    { month: 'Feb', actual: null, predicted: 510000 },
    { month: 'Mar', actual: null, predicted: 530000 },
    { month: 'Apr', actual: null, predicted: 550000 },
];

export default function FinancialReports() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Financial Reports</h2>
                <div className="flex gap-2">
                    <Button variant="outline"><Calendar className="w-4 h-4 mr-2"/> This Month</Button>
                    <Button variant="outline"><Download className="w-4 h-4 mr-2"/> Export PDF</Button>
                </div>
            </div>

            <Tabs defaultValue="pl">
                <TabsList>
                    <TabsTrigger value="pl">Profit & Loss</TabsTrigger>
                    <TabsTrigger value="bs">Balance Sheet</TabsTrigger>
                    <TabsTrigger value="cf">Cash Flow</TabsTrigger>
                    <TabsTrigger value="ai_forecast" className="data-[state=active]:bg-violet-500 data-[state=active]:text-white">
                        <Sparkles className="w-3 h-3 mr-2" /> AI Forecasts
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="pl" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">Statement of Profit or Loss</CardTitle>
                            <p className="text-center text-sm text-slate-500">For the period ending Oct 31, 2024</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-w-3xl mx-auto">
                                {/* Revenue Section */}
                                <div className="flex justify-between font-semibold text-slate-800 pt-4 border-t">
                                    <span>Revenue</span>
                                    <span>$450,000.00</span>
                                </div>
                                <div className="pl-4 flex justify-between text-sm text-slate-600">
                                    <span>Sales - Product A</span>
                                    <span>$300,000.00</span>
                                </div>
                                <div className="pl-4 flex justify-between text-sm text-slate-600">
                                    <span>Sales - Services</span>
                                    <span>$150,000.00</span>
                                </div>

                                {/* COGS Section */}
                                <div className="flex justify-between font-semibold text-slate-800 pt-4">
                                    <span>Cost of Goods Sold</span>
                                    <span>($120,000.00)</span>
                                </div>
                                
                                <div className="flex justify-between font-bold text-lg pt-4 border-t border-slate-200">
                                    <span>Gross Profit</span>
                                    <span>$330,000.00</span>
                                </div>

                                {/* Expenses Section */}
                                <div className="flex justify-between font-semibold text-slate-800 pt-6">
                                    <span>Operating Expenses</span>
                                </div>
                                <div className="pl-4 flex justify-between text-sm text-slate-600">
                                    <span>Salaries & Wages</span>
                                    <span>$100,000.00</span>
                                </div>
                                <div className="pl-4 flex justify-between text-sm text-slate-600">
                                    <span>Rent</span>
                                    <span>$20,000.00</span>
                                </div>
                                <div className="pl-4 flex justify-between text-sm text-slate-600">
                                    <span>Utilities</span>
                                    <span>$5,000.00</span>
                                </div>
                                
                                <div className="flex justify-between font-bold text-lg pt-6 border-t border-slate-800 mt-4">
                                    <span>Net Profit</span>
                                    <span className="text-emerald-600">$205,000.00</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="bs">
                    <Card>
                        <CardContent className="p-8 text-center text-slate-500">
                            Balance Sheet Placeholder (Requires data aggregation implementation)
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ai_forecast" className="mt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-violet-500" />
                                    Revenue & Cashflow Prediction
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[350px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={forecastData}>
                                            <XAxis dataKey="month" />
                                            <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                                            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                                            <Legend />
                                            <Line type="monotone" dataKey="actual" stroke="#0f172a" strokeWidth={2} name="Actual Revenue" />
                                            <Line type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeDasharray="5 5" strokeWidth={2} name="AI Prediction" />
                                            <ReferenceLine x="Nov" stroke="#94a3b8" strokeDasharray="3 3" label="Current" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="bg-violet-50 border-violet-100">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-violet-700 uppercase tracking-wider">AI Confidence Score</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-bold text-violet-900">94%</div>
                                    <p className="text-xs text-violet-600 mt-1">Based on 3 years of historical data</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                                        Detected Anomalies
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 text-sm">
                                        <p className="font-medium text-amber-900">Unusual Expense Spike</p>
                                        <p className="text-amber-700 text-xs mt-1">Marketing spend 45% higher than projected for Nov.</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-500 text-center italic">
                                        No other anomalies detected
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}