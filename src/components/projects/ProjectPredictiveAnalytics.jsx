import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Brain, AlertTriangle, CheckCircle2, TrendingUp, Clock, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function ProjectPredictiveAnalytics() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 2500);
  };

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list()
  });

  const { data: predictions } = useQuery({
    queryKey: ['project-predictions', selectedProject],
    queryFn: () => selectedProject ? base44.entities.ProjectPrediction.list() : [], // Mock list for now
    enabled: !!selectedProject
  });

  // Mock Data for visualization if no real data exists
  const mockTrendData = [
    { date: '2024-01', actual: 10, predicted: 10 },
    { date: '2024-02', actual: 25, predicted: 22 },
    { date: '2024-03', actual: 45, predicted: 40 },
    { date: '2024-04', actual: 60, predicted: 65 },
    { date: '2024-05', actual: null, predicted: 80 },
    { date: '2024-06', actual: null, predicted: 95 },
  ];

  const bottlenecks = [
    { task: "Frontend Integration", issue: "Resource constraint", impact: "5 days", suggestion: "Reallocate Dev A from Maintenance" },
    { task: "UAT Sign-off", issue: "Client availability", impact: "3 days", suggestion: "Schedule pre-review meeting" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Timeline Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTrendData}>
                  <defs>
                    <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="actual" stroke="#10b981" fill="transparent" strokeWidth={2} name="Actual Progress" />
                  <Area type="monotone" dataKey="predicted" stroke="#8884d8" fillOpacity={1} fill="url(#colorPred)" strokeDasharray="5 5" name="AI Forecast" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-between items-center p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm text-slate-500">Predicted Completion</p>
                <p className="text-lg font-bold text-slate-900">15 June 2024</p>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Brain className="w-3 h-3 mr-1" /> 92% Confidence
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-violet-600" />
                AI Risk & Resource Scan
              </CardTitle>
              <Button size="sm" variant="outline" onClick={runAnalysis} disabled={analyzing}>
                {analyzing ? (
                  <><Brain className="w-4 h-4 mr-2 animate-pulse" /> Scanning...</>
                ) : (
                  <><Brain className="w-4 h-4 mr-2" /> Refresh AI Analysis</>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bottlenecks.map((risk, i) => (
                <div key={i} className="p-4 border border-amber-100 bg-amber-50/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-amber-900">{risk.task}</h4>
                        <Badge className="bg-amber-200 text-amber-800 hover:bg-amber-300">
                          +{risk.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-amber-700 mt-1">{risk.issue}</p>
                      <div className="mt-3 flex items-center gap-2 text-sm bg-white p-2 rounded border border-amber-100">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-slate-700">Suggestion:</span>
                        <span className="text-slate-600">{risk.suggestion}</span>
                        <Button size="sm" variant="ghost" className="ml-auto h-6 text-xs">Apply</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="p-4 border border-slate-200 rounded-lg">
                <h4 className="font-medium flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-slate-500" /> Resource Forecast
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Frontend Devs</span>
                    <span className="text-red-600">Shortfall (-20h)</span>
                  </div>
                  <Progress value={120} className="h-2 [&>div]:bg-red-500" />
                  
                  <div className="flex justify-between text-sm mt-2">
                    <span>Backend Devs</span>
                    <span className="text-green-600">Optimal</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}