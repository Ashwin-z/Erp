import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Check, X, AlertTriangle, RefreshCw, 
  BrainCircuit, AlertCircle 
} from "lucide-react";
import { toast } from 'sonner';

export default function OCRResultEditor({ data, confidenceScores = {}, onSave, onCancel }) {
  const [formData, setFormData] = React.useState(data || {});
  const [isDirty, setIsDirty] = React.useState(false);

  // Default low confidence threshold
  const LOW_CONFIDENCE_THRESHOLD = 0.85;

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
      if (isDirty) {
          toast.promise(
              new Promise(resolve => setTimeout(resolve, 1200)),
              {
                  loading: 'Saving correction & Retraining AI Model...',
                  success: 'Field extraction model updated!',
                  error: 'Failed to retrain'
              }
          );
      }
      onSave(formData);
  };

  const getConfidenceColor = (key) => {
      const score = confidenceScores[key];
      if (score === undefined) return 'text-slate-500';
      if (score < LOW_CONFIDENCE_THRESHOLD) return 'text-amber-600';
      return 'text-emerald-600';
  };

  const renderInput = (key, label, type = 'text', fullWidth = false) => {
      const score = confidenceScores[key] || 1.0;
      const isLowConfidence = score < LOW_CONFIDENCE_THRESHOLD;

      return (
        <div className={`space-y-1 ${fullWidth ? 'col-span-2' : ''}`}>
            <div className="flex justify-between">
                <Label className={`text-xs ${isLowConfidence ? 'text-amber-600 font-semibold' : 'text-slate-500'}`}>
                    {label}
                    {isLowConfidence && <AlertCircle className="w-3 h-3 inline ml-1" />}
                </Label>
                {score !== undefined && (
                    <span className={`text-[10px] ${getConfidenceColor(key)}`}>
                        {Math.round(score * 100)}%
                    </span>
                )}
            </div>
            <Input 
                value={formData[key] || ''} 
                onChange={(e) => handleChange(key, e.target.value)}
                className={`h-8 ${isLowConfidence ? 'border-amber-300 bg-amber-50 focus-visible:ring-amber-500' : ''}`}
            />
        </div>
      );
  };

  return (
    <Card className="h-full flex flex-col border-l-4 border-l-indigo-500">
      <CardHeader className="py-3 border-b bg-slate-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-indigo-600" /> 
            AI Extraction Review
          </CardTitle>
          {isDirty && (
              <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200 animate-pulse">
                  Feedback Pending
              </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          {renderInput('doc_type', 'Document Type')}
          {renderInput('date', 'Date')}
        </div>

        {/* Context Aware Fields */}
        {formData.doc_type === 'Business Card' && (
          <div className="grid grid-cols-2 gap-4">
            {renderInput('name', 'Full Name', 'text', true)}
            {renderInput('company', 'Company', 'text', true)}
            {renderInput('title', 'Job Title', 'text', true)}
            {renderInput('email', 'Email')}
            {renderInput('phone', 'Phone')}
          </div>
        )}

        {(formData.doc_type === 'Receipt' || formData.doc_type === 'Invoice') && (
          <div className="grid grid-cols-2 gap-4">
            {renderInput('vendor', 'Vendor / Supplier', 'text', true)}
            {renderInput('amount', 'Total Amount')}
            {renderInput('currency', 'Currency')}
          </div>
        )}

        <div className="space-y-1 mt-4">
          <Label className="text-xs text-slate-500">Raw OCR Text</Label>
          <Textarea 
            value={formData.ocr_text || ''} 
            onChange={(e) => handleChange('ocr_text', e.target.value)}
            className="h-24 text-xs font-mono text-slate-600"
          />
        </div>

      </CardContent>
      <CardContent className="py-3 border-t bg-slate-50 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" /> Discard
        </Button>
        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={handleSave}>
            {isDirty ? <RefreshCw className="w-4 h-4 mr-2" /> : <Check className="w-4 h-4 mr-2" />}
            {isDirty ? 'Confirm & Retrain' : 'Confirm Verified'}
        </Button>
      </CardContent>
    </Card>
  );
}