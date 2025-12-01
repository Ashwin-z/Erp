import React, { useState } from 'react';
import { 
  Mail, MessageSquare, DollarSign, Clock, CheckCheck 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CollectionsAutomation() {
  const [activeRun, setActiveRun] = useState(null);

  const customers = [
    { id: 1, name: 'TechGiant Corp', overdue: 12500, days: 45, risk: 'Low', next_action: 'Send Email Reminder' },
    { id: 2, name: 'StartUp Inc', overdue: 3200, days: 92, risk: 'High', next_action: 'Call CFO' },
    { id: 3, name: 'Global Trade Ltd', overdue: 8500, days: 15, risk: 'Medium', next_action: 'SMS Notification' },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-indigo-600" /> Smart Collections
                </CardTitle>
                <CardDescription>AI-Driven Dunning & Risk Analysis</CardDescription>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Mail className="w-4 h-4 mr-2" /> Run Dunning Cycle
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-lg border">
                <div className="text-sm text-slate-500">Total Overdue</div>
                <div className="text-2xl font-bold text-red-600">$24,200</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border">
                <div className="text-sm text-slate-500">DSO (Days Sales Outstanding)</div>
                <div className="text-2xl font-bold text-slate-800">42 Days</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border">
                <div className="text-sm text-slate-500">Projected Recovery</div>
                <div className="text-2xl font-bold text-emerald-600">$18,500</div>
            </div>
        </div>

        <h4 className="text-sm font-semibold mb-3 text-slate-700">Priority Action List</h4>
        <ScrollArea className="h-[300px]">
            <div className="space-y-3">
                {customers.map(cust => (
                    <div key={cust.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h5 className="font-semibold text-slate-900">{cust.name}</h5>
                                <div className="text-xs text-slate-500 flex gap-2 mt-1">
                                    <span className="text-red-600 font-medium">${cust.overdue.toLocaleString()}</span>
                                    <span>• {cust.days} days overdue</span>
                                </div>
                            </div>
                            <Badge variant={cust.risk === 'High' ? 'destructive' : cust.risk === 'Medium' ? 'secondary' : 'outline'}>
                                {cust.risk} Risk
                            </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed">
                            <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                                {cust.next_action.includes('Email') && <Mail className="w-4 h-4" />}
                                {cust.next_action.includes('Call') && <MessageSquare className="w-4 h-4" />}
                                {cust.next_action}
                            </div>
                            <Button size="sm" variant="outline" className="h-7 text-xs">
                                Execute
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}