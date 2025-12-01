import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function PDPAAgreementModal({ open, onAccept, onDecline, agreementType = 'pdpa' }) {
  const [accepted, setAccepted] = useState(false);

  const agreements = {
    pdpa: {
      title: 'PDPA Compliance Agreement',
      icon: Shield,
      content: `
PERSONAL DATA PROTECTION ACT (PDPA) COMPLIANCE AGREEMENT

By using this platform, you agree to comply with the Personal Data Protection Act 2012 of Singapore.

1. DATA COLLECTION & PURPOSE
- We collect personal data only for legitimate business purposes
- Data collected includes: name, email, contact information, usage data
- Purpose: Service delivery, communication, security, compliance

2. CONSENT
- You consent to the collection, use, and disclosure of your personal data
- You may withdraw consent at any time by contacting us
- Withdrawal may affect your ability to use certain features

3. DATA PROTECTION
- We implement reasonable security measures to protect your data
- Access to personal data is restricted to authorized personnel
- Data is encrypted in transit and at rest

4. DATA RETENTION
- Personal data is retained only as long as necessary
- Upon account termination, data will be deleted within 90 days
- Some data may be retained for legal/compliance purposes

5. YOUR RIGHTS
- Right to access your personal data
- Right to correct inaccurate data
- Right to request deletion (subject to legal requirements)
- Right to data portability

6. CROSS-BORDER TRANSFERS
- Data may be transferred to service providers outside Singapore
- We ensure adequate protection for such transfers

7. BREACH NOTIFICATION
- We will notify you within 72 hours of a data breach
- Notification to PDPC will be made as required by law

8. DATA PROTECTION OFFICER
Contact: net28528@gmail.com

By accepting, you confirm you have read, understood, and agree to this PDPA Compliance Agreement.
      `
    },
    cybersecurity: {
      title: 'Cybersecurity Agreement',
      icon: Shield,
      content: `
CYBERSECURITY AGREEMENT

In accordance with Singapore Cybersecurity Act and best practices (OWASP), you agree to:

1. ACCOUNT SECURITY
- Maintain strong passwords (minimum 12 characters, mixed case, numbers, symbols)
- Enable two-factor authentication when available
- Never share your login credentials
- Report any suspicious activity immediately

2. DEVICE SECURITY
- Keep your devices updated with latest security patches
- Use antivirus/antimalware software
- Lock devices when unattended
- Use secure networks for accessing the platform

3. DATA HANDLING
- Do not download or export data without authorization
- Do not share sensitive data via unsecured channels
- Report any data breaches immediately
- Follow data classification guidelines

4. ACCESS CONTROL
- Access only data necessary for your role
- Log out after each session
- Do not attempt to access unauthorized areas
- Report any access anomalies

5. INCIDENT REPORTING
- Report security incidents to IT immediately
- Preserve evidence of suspicious activity
- Cooperate with security investigations

6. COMPLIANCE
- Follow all security policies and procedures
- Complete mandatory security training
- Accept regular security audits

7. PENALTIES
- Violation may result in account suspension
- Serious violations may result in legal action
- All activities are logged and monitored

By accepting, you acknowledge your responsibility to maintain security and report any incidents.
      `
    }
  };

  const agreement = agreements[agreementType];
  const Icon = agreement.icon;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-blue-600" />
            {agreement.title}
          </DialogTitle>
          <DialogDescription>
            Please read and accept this agreement to continue using the platform.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] border rounded-lg p-4 bg-slate-50">
          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans">
            {agreement.content}
          </pre>
        </ScrollArea>

        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Important:</strong> You must accept this agreement to access the system. 
            If you decline, you will not be able to use any features. 
            A copy will be emailed to you and the system administrators.
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox 
            id="accept" 
            checked={accepted} 
            onCheckedChange={setAccepted}
          />
          <label htmlFor="accept" className="text-sm font-medium cursor-pointer">
            I have read, understood, and agree to the terms of this agreement
          </label>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onDecline} className="text-red-600 hover:bg-red-50">
            Decline & Exit
          </Button>
          <Button 
            onClick={onAccept} 
            disabled={!accepted}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Accept Agreement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}