import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { 
  Shield, AlertTriangle, XCircle, CheckCircle, Info,
  Lightbulb, Lock, FileText
} from 'lucide-react';

const riskConfig = {
  critical: { color: 'bg-red-500', border: 'border-red-500', light: 'bg-red-50', icon: XCircle, text: 'text-red-700' },
  high: { color: 'bg-orange-500', border: 'border-orange-500', light: 'bg-orange-50', icon: AlertTriangle, text: 'text-orange-700' },
  medium: { color: 'bg-amber-500', border: 'border-amber-500', light: 'bg-amber-50', icon: AlertTriangle, text: 'text-amber-700' },
  low: { color: 'bg-blue-500', border: 'border-blue-500', light: 'bg-blue-50', icon: Info, text: 'text-blue-700' }
};

export default function PDPAAlertPopup({ open, onClose, incident, onAcknowledge, onCancel }) {
  const [acknowledged, setAcknowledged] = useState(false);

  const sampleIncident = incident || {
    action_type: 'data_export',
    resource_name: 'Customer Database',
    records_affected: 1250,
    risk_level: 'high',
    data_category: 'personal_data',
    ai_analysis: 'This export contains personal data of 1,250 customers including names, emails, and phone numbers. Under PDPA, exporting personal data requires proper consent and security measures.',
    ai_recommendation: 'Consider exporting only anonymized data, or ensure you have documented consent for this data transfer.',
    corrective_action: 'Use the "Export Anonymized" option instead, or obtain approval from your Data Protection Officer.'
  };

  const config = riskConfig[sampleIncident.risk_level] || riskConfig.medium;
  const RiskIcon = config.icon;

  const handleAcknowledge = () => {
    if (acknowledged) {
      onAcknowledge && onAcknowledge();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className={`w-full p-4 -mt-6 -mx-6 mb-4 rounded-t-lg ${config.light} border-b-4 ${config.border}`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${config.color} flex items-center justify-center`}>
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <RiskIcon className={`w-5 h-5 ${config.text}`} />
                  PDPA Compliance Alert
                </DialogTitle>
                <Badge className={`mt-1 ${config.color} text-white`}>
                  {sampleIncident.risk_level.toUpperCase()} RISK
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Action Details */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-sm text-slate-500 mb-2">DETECTED ACTION</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Action:</span>
                <span className="font-medium">{sampleIncident.action_type.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Resource:</span>
                <span className="font-medium">{sampleIncident.resource_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Records Affected:</span>
                <span className="font-medium text-red-600">{sampleIncident.records_affected?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Data Type:</span>
                <Badge variant="outline">{sampleIncident.data_category?.replace('_', ' ')}</Badge>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className={`p-4 rounded-lg ${config.light} border ${config.border}`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className={`w-4 h-4 ${config.text}`} />
              <h4 className={`font-semibold text-sm ${config.text}`}>WHY THIS IS A RISK</h4>
            </div>
            <p className="text-sm text-slate-700">{sampleIncident.ai_analysis}</p>
          </div>

          {/* Safe Alternative */}
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-green-600" />
              <h4 className="font-semibold text-sm text-green-700">PDPA-SAFE ALTERNATIVE</h4>
            </div>
            <p className="text-sm text-slate-700">{sampleIncident.ai_recommendation}</p>
          </div>

          {/* Corrective Action */}
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-sm text-blue-700">RECOMMENDED ACTION</h4>
            </div>
            <p className="text-sm text-slate-700">{sampleIncident.corrective_action}</p>
          </div>

          {/* Acknowledgment */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <Checkbox 
              id="acknowledge"
              checked={acknowledged}
              onCheckedChange={setAcknowledged}
            />
            <label htmlFor="acknowledge" className="text-sm text-slate-700 cursor-pointer">
              I understand the PDPA implications of this action and acknowledge that this incident will be logged and reported to the Data Protection Officer.
            </label>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            <XCircle className="w-4 h-4 mr-2" />
            Cancel Action
          </Button>
          <Button 
            onClick={handleAcknowledge}
            disabled={!acknowledged}
            className={`flex-1 ${acknowledged ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-300'}`}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Acknowledge & Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}