import React from 'react';
import { 
  BookOpen, CheckCircle, Play, FileText, Settings, 
  AlertCircle, Calendar, UserCheck, DollarSign 
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PayrollSOP() {
  return (
    <Card className="bg-white shadow-sm border-slate-200">
      <CardHeader>
        <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
                <CardTitle>Payroll Standard Operating Procedures (SOP)</CardTitle>
                <CardDescription>Step-by-step guide for processing monthly payroll.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          
          <AccordionItem value="step-1">
            <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-xs">1</div>
                    <span className="font-semibold text-slate-700">Pre-Payroll Validation</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pl-11 space-y-3 text-slate-600 text-sm">
              <p>Before running payroll, ensure all data is up to date:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                    <UserCheck className="w-4 h-4 mt-0.5 text-emerald-500" />
                    <span><strong>Employee Data:</strong> Verify new hires, resignations, and bank account details are updated in HR.</span>
                </li>
                <li className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 mt-0.5 text-blue-500" />
                    <span><strong>Attendance & Leave:</strong> Confirm all leave applications (paid/unpaid) for the month are approved. Unpaid leave will auto-deduct.</span>
                </li>
                <li className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 mt-0.5 text-amber-500" />
                    <span><strong>One-time Payments:</strong> Add any bonuses, commissions, or expense reimbursements to the <em>Additional Salary</em> table.</span>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="step-2">
            <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-xs">2</div>
                    <span className="font-semibold text-slate-700">Running the Payroll Batch</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pl-11 space-y-3 text-slate-600 text-sm">
              <p>Execute the monthly batch process:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Navigate to the <strong>Payroll Runs</strong> tab.</li>
                <li>Click <strong>Run Payroll</strong>.</li>
                <li>Select the <strong>Start Date</strong> and <strong>End Date</strong> (typically 1st to 30th/31st).</li>
                <li>Choose the relevant <strong>Department</strong> or leave blank for all employees.</li>
                <li>Click <strong>Generate Slips</strong>. This creates "Draft" salary slips for review.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="step-3">
            <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-xs">3</div>
                    <span className="font-semibold text-slate-700">Verification & Approval</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pl-11 space-y-3 text-slate-600 text-sm">
              <div className="bg-amber-50 p-3 rounded border border-amber-100 mb-2 flex gap-2">
                 <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                 <span className="text-xs text-amber-800">Critical Step: Ensure totals match the Finance Budget.</span>
              </div>
              <p>Review the generated slips:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Check the <strong>Total Gross Pay</strong> and <strong>Total Net Pay</strong> against expected values.</li>
                <li>Spot check 3-5 random slips for accuracy (tax calculations, CPF/EPF deductions).</li>
                <li>Once verified, click <strong>Submit Batch</strong> to finalize. Status changes to "Submitted".</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="step-4">
            <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-xs">4</div>
                    <span className="font-semibold text-slate-700">Bank Advice & Distribution</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pl-11 space-y-3 text-slate-600 text-sm">
              <p>Final payment processing:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                    <FileText className="w-4 h-4 mt-0.5 text-slate-400" />
                    <span><strong>Bank File:</strong> Download the GIRO/Bank Transfer file (ISO20022/CSV) from the batch summary.</span>
                </li>
                <li className="flex items-start gap-2">
                    <Play className="w-4 h-4 mt-0.5 text-indigo-500" />
                    <span><strong>Email Payslips:</strong> Click "Email Payslips" to automatically send PDF slips to all employees.</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-500" />
                    <span><strong>Post to GL:</strong> The system automatically creates a Journal Entry debiting <em>Salary Expense</em> and crediting <em>Bank/Payable</em>.</span>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
}