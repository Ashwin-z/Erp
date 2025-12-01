import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Bot, Calendar, CheckCircle2, AlertTriangle, Play, History, Settings } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import moment from 'moment';

export default function GovAutomationPanel() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('rules');

  const { data: rules = [] } = useQuery({
    queryKey: ['gov-rules'],
    queryFn: () => base44.entities.GovAutomationRule.list()
  });

  const toggleRuleMutation = useMutation({
    mutationFn: async ({ id, isActive }) => {
      return base44.entities.GovAutomationRule.update(id, { is_active: isActive });
    },
    onSuccess: () => queryClient.invalidateQueries(['gov-rules'])
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Automation Rules</h3>
          <p className="text-sm text-slate-500">Configure triggers for automated government submissions</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> New Rule
        </Button>
      </div>

      <div className="grid gap-4">
        {/* Mock Existing Rules */}
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium">Auto-Submit IRAS GST F5</h4>
                <p className="text-sm text-slate-500">Triggers on 28th of every quarter end</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right mr-4">
                <Badge variant="outline" className="mb-1 border-green-200 text-green-700 bg-green-50">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Validated
                </Badge>
                <p className="text-xs text-slate-400">Last run: 28 Dec 2024</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium">CPF Monthly Contribution</h4>
                <p className="text-sm text-slate-500">Triggers on 14th of every month</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right mr-4">
                <Badge variant="outline" className="mb-1 border-green-200 text-green-700 bg-green-50">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Validated
                </Badge>
                <p className="text-xs text-slate-400">Last run: 14 Jan 2025</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium">ACRA Annual Return Reminder</h4>
                <p className="text-sm text-slate-500">Triggers 30 days before AGM due date</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right mr-4">
                <Badge variant="outline" className="mb-1 border-slate-200 text-slate-600 bg-slate-50">
                  <Clock className="w-3 h-3 mr-1" /> Pending
                </Badge>
                <p className="text-xs text-slate-400">Next run: 01 Feb 2025</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <History className="w-4 h-4" /> Recent Automation Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="mt-0.5">
                  {i === 0 ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <CheckCircle2 className="w-4 h-4 text-slate-400" />}
                </div>
                <div>
                  <p className="font-medium">CPF Submission for Jan 2025</p>
                  <p className="text-slate-500">Successfully validated and submitted. Payment scheduled.</p>
                  <p className="text-xs text-slate-400 mt-1">Today, 10:30 AM</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Plus({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}