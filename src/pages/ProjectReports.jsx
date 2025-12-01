import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import { FileText, BarChart3, Download, Share2 } from 'lucide-react';
import ProjectReportingDashboard from '@/components/projects/ProjectReportingDashboard'; // Keep existing
import ProjectPredictiveAnalytics from '@/components/projects/ProjectPredictiveAnalytics';
import CustomReportBuilder from '@/components/projects/CustomReportBuilder';

export default function ProjectReports() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader 
        title="Project Analytics & Reporting" 
        subtitle="AI-driven insights, forecasting, and custom report generation"
        icon={BarChart3}
        iconColor="text-blue-600"
      />

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0 space-x-6">
          <TabsTrigger 
            value="dashboard" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 pb-2"
          >
            Performance Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="predictive" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 pb-2"
          >
            Predictive AI
          </TabsTrigger>
          <TabsTrigger 
            value="custom" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 pb-2"
          >
            Custom Reports
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="dashboard">
            <ProjectReportingDashboard />
          </TabsContent>
          
          <TabsContent value="predictive">
            <ProjectPredictiveAnalytics />
          </TabsContent>
          
          <TabsContent value="custom">
            <CustomReportBuilder />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}