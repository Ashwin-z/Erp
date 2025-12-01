import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import { Building2, Settings, ShieldCheck, CreditCard } from 'lucide-react';
import GovAPIManager from '@/components/gov-integration/GovAPIManager';
import IRASSubmissionPanel from '@/components/gov-integration/IRASSubmissionPanel';
import CPFSubmissionPanel from '@/components/gov-integration/CPFSubmissionPanel';
import ACRAFilingPanel from '@/components/gov-integration/ACRAFilingPanel';
import GovAutomationPanel from '@/components/gov-integration/GovAutomationPanel';
import GovComplianceWidget from '@/components/dashboard/widgets/GovComplianceWidget';

export default function GovIntegration() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader 
        title="Government Integration Hub" 
        subtitle="Seamlessly manage IRAS, CPF, and ACRA compliance"
        icon={Building2}
        iconColor="text-indigo-600"
      />

      {/* Command Center Summary */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <GovAPIManager />
        </div>
        <div className="md:col-span-1">
          <GovComplianceWidget />
        </div>
      </div>

      <Tabs defaultValue="automation" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0 space-x-6">
          <TabsTrigger value="automation" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 px-0 pb-2">
            Automation & AI
          </TabsTrigger>
          <TabsTrigger value="iras" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 px-0 pb-2">
            IRAS (Tax)
          </TabsTrigger>
          <TabsTrigger value="cpf" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 px-0 pb-2">
            CPF Board
          </TabsTrigger>
          <TabsTrigger value="acra" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 px-0 pb-2">
            ACRA
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="automation">
            <GovAutomationPanel />
          </TabsContent>
          <TabsContent value="iras">
            <IRASSubmissionPanel />
          </TabsContent>
          <TabsContent value="cpf">
            <CPFSubmissionPanel />
          </TabsContent>
          <TabsContent value="acra">
            <ACRAFilingPanel />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}