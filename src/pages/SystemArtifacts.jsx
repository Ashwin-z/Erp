import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Database, Server } from 'lucide-react';

export default function SystemArtifacts() {
  const openApiSpec = `openapi: 3.0.0
info:
  title: Arktira ERP & Compliance API
  description: API for the PDPA-compliant ERP/DMS system.
  version: 1.0.0
paths:
  /documents/upload:
    post:
      summary: Upload a document for OCR
  /ocr/{task_id}/validate:
    post:
      summary: Submit human validation for OCR task
  /compliance/consents:
    get:
      summary: Retrieve consent records for a user`;

  const architecture = `High-Level Architecture
1. Frontend: React (Vite) + Tailwind + ShadcnUI.
2. Backend: Base44 Serverless (Node.js/Python).
3. Database: Base44 Entities (MongoDB/Postgres compatible).
4. AI Engine: Integrated ML Pipeline (OCR, Extraction, Risk Scoring).
5. Security: Zero-Trust, RBAC, Field-Level Encryption.

PDPA Compliance Matrix
- Consent: ConsentRecord entity with immutable hash
- Purpose: 'source_channel' and 'purpose_code' tags
- Access: Self-service portal for data export
- Retention: Automated TTL background jobs`;

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Server className="w-8 h-8 text-blue-400" />
        System Artifacts (Sprint 0)
      </h1>

      <Tabs defaultValue="architecture">
        <TabsList className="mb-6 bg-slate-900">
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="openapi">OpenAPI Spec</TabsTrigger>
          <TabsTrigger value="erd">ERD / DocTypes</TabsTrigger>
        </TabsList>

        <TabsContent value="architecture">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle>System Architecture</CardTitle></CardHeader>
            <CardContent>
              <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono bg-slate-950 p-4 rounded-lg">
                {architecture}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="openapi">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle>OpenAPI Specification</CardTitle></CardHeader>
            <CardContent>
              <pre className="text-sm text-emerald-400 whitespace-pre-wrap font-mono bg-slate-950 p-4 rounded-lg">
                {openApiSpec}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="erd">
           <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle>Core Entities</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
               {['Invoice', 'Vendor', 'Employee', 'ConsentRecord', 'AuditLog', 'OCRTask'].map(e => (
                 <div key={e} className="p-3 border border-slate-700 rounded flex items-center gap-2">
                   <Database className="w-4 h-4 text-purple-400" />
                   <span>{e}</span>
                 </div>
               ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}