import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Settings, Activity, PlayCircle, GitBranch, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function WorkflowNodeDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const nodeId = params.get('id') || 'node_1';
  const nodeType = params.get('type') || 'Action';
  const label = params.get('label') || 'Workflow Node';

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-slate-400 hover:text-white hover:bg-slate-800">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Node Configuration
              <Badge variant="outline" className="ml-2 border-slate-700 text-slate-400">
                {nodeId}
              </Badge>
            </h1>
            <p className="text-slate-400">Edit parameters and logic for this step</p>
          </div>
        </div>

        <Card className="bg-slate-900/50 border-slate-800 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {nodeType === 'Trigger' ? <PlayCircle className="w-5 h-5 text-blue-400" /> : 
               nodeType === 'Condition' ? <GitBranch className="w-5 h-5 text-orange-400" /> :
               <Activity className="w-5 h-5 text-emerald-400" />}
              {label}
            </CardTitle>
            <CardDescription>
              Type: <span className="font-bold text-slate-300">{nodeType}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-300">Node Label</Label>
              <Input defaultValue={label} className="bg-slate-950 border-slate-700 text-white" />
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Description</Label>
              <Input placeholder="Describe what this step does..." className="bg-slate-950 border-slate-700 text-white" />
            </div>

            <Separator className="bg-slate-800" />

            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-400 uppercase">Parameters</h3>
              
              {nodeType === 'Condition' ? (
                <div className="grid grid-cols-3 gap-4">
                  <Input placeholder="Variable" defaultValue="order_value" className="bg-slate-950 border-slate-700 text-white" />
                  <Input placeholder="Operator" defaultValue=">" className="bg-slate-950 border-slate-700 text-white text-center" />
                  <Input placeholder="Value" defaultValue="1000" className="bg-slate-950 border-slate-700 text-white" />
                </div>
              ) : (
                <div className="p-4 bg-slate-950 rounded border border-slate-800 text-center text-slate-500 text-sm">
                  No additional parameters required for this action type.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-slate-400 hover:text-white">
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}