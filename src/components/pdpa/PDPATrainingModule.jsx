import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, Award, Clock, CheckCircle, Play, 
  AlertTriangle, Users, FileText
} from 'lucide-react';

export default function PDPATrainingModule({ trainings, onStartTraining }) {
  const sampleModules = [
    { id: 1, name: 'PDPA Fundamentals', type: 'awareness', duration: '30 mins', completed: true, score: 95, required: true },
    { id: 2, name: 'Data Handling Best Practices', type: 'handling', duration: '45 mins', completed: true, score: 88, required: true },
    { id: 3, name: 'Breach Response Protocol', type: 'breach_response', duration: '20 mins', completed: false, score: null, required: true },
    { id: 4, name: 'Consent Management', type: 'consent_management', duration: '25 mins', completed: false, score: null, required: false },
    { id: 5, name: 'Data Protection Principles', type: 'data_protection', duration: '35 mins', completed: false, score: null, required: true }
  ];

  const completedCount = sampleModules.filter(m => m.completed).length;
  const requiredCount = sampleModules.filter(m => m.required).length;
  const completedRequired = sampleModules.filter(m => m.completed && m.required).length;
  const progress = Math.round((completedCount / sampleModules.length) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          PDPA Training & Education
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-600">Training Progress</p>
              <p className="text-2xl font-bold">{completedCount} / {sampleModules.length} Completed</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Required Modules</p>
              <p className="text-2xl font-bold text-green-600">{completedRequired} / {requiredCount}</p>
            </div>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-slate-500 mt-2">{progress}% Complete</p>
        </div>

        {/* Modules List */}
        <div className="space-y-3">
          {sampleModules.map((module) => (
            <div 
              key={module.id}
              className={`p-4 rounded-xl border ${module.completed ? 'bg-green-50 border-green-200' : 'bg-white'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    module.completed ? 'bg-green-500' : 'bg-slate-100'
                  }`}>
                    {module.completed ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <BookOpen className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{module.name}</span>
                      {module.required && <Badge className="bg-red-100 text-red-700">Required</Badge>}
                      {module.completed && <Badge className="bg-green-100 text-green-700">Completed</Badge>}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {module.duration}
                      </span>
                      <Badge variant="outline" className="capitalize">{module.type.replace('_', ' ')}</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {module.completed ? (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{module.score}%</p>
                      <p className="text-xs text-slate-500">Score</p>
                    </div>
                  ) : (
                    <Button onClick={() => onStartTraining && onStartTraining(module)} className="bg-blue-500 hover:bg-blue-600">
                      <Play className="w-4 h-4 mr-2" />
                      Start Training
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Status */}
        {completedRequired < requiredCount && (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-700">Training Incomplete</p>
                <p className="text-sm text-slate-600">
                  You must complete all required PDPA training modules to maintain compliance. 
                  {requiredCount - completedRequired} required module(s) remaining.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}