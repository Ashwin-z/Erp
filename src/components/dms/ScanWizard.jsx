import React, { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { DMSController } from './DMSController';
import { 
  Upload, FileText, Scan, Loader2, CheckCircle2, 
  Image as ImageIcon, ArrowRight, RefreshCw, X, Link2, Edit3, Folder
} from 'lucide-react';
import { StorageFactory } from './StorageAdapters';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import OCRResultEditor from './OCRResultEditor';

// ScanWizard component
export default function ScanWizard({ onComplete }) {
  const [step, setStep] = useState(1); // 1: Upload, 2: Processing, 3: Edit/Verify, 4: Result
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scanMode, setScanMode] = useState('General');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState('Local');
  const fileInputRef = useRef(null);
  
  const { data: storageConfigs } = useQuery({
     queryKey: ['storageConfigs'],
     queryFn: () => base44.entities.AIStorageConfig.list(),
     initialData: []
  });

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setStep(2);
      processScan(selected); // Auto-start for smoother UX
    }
  };

  const processScan = async (selectedFile) => {
    setProcessing(true);
    setProgress(10);

    try {
      // 1. Upload File
      const uploadRes = await base44.integrations.Core.UploadFile({ file: selectedFile });
      const fileUrl = uploadRes.file_url;
      setProgress(40);

      // 2. AI Extraction using Controller
      const extractionRes = await DMSController.processScanTask({ scan_mode: scanMode }, fileUrl);
      
      setProgress(80);
      
      // Prepare data for editor
      const processedData = {
        ...extractionRes,
        entities: extractionRes, // Simplified mapping
        suggested_filename: DMSController.generateFileName(null, extractionRes),
        suggested_folder: DMSController.generateFolderPath(extractionRes)
      };

      setExtractedData(processedData);
      
      // 3. Create Scan Task Record (Pending)
      await base44.entities.AIScanTask.create({
        scan_mode: scanMode,
        status: 'Pending',
        source_file_url: fileUrl,
        detected_doc_type: processedData.doc_type,
        ocr_confidence_score: 0.95, 
        extracted_data: JSON.stringify(processedData),
        generated_file_name: processedData.suggested_filename,
        target_folder: processedData.suggested_folder
      });

      // Auto-select provider if available
      if (storageConfigs && storageConfigs.length > 0) {
         // Prefer Cloud over Local if configured
         const cloud = storageConfigs.find(c => c.provider !== 'Local');
         if (cloud) setSelectedProvider(cloud.provider);
      }

      setProgress(100);
      
      setTimeout(() => {
        setProcessing(false);
        setStep(3); // Go to Editor
        toast.info("Please verify extracted data");
      }, 500);

    } catch (error) {
      console.error(error);
      toast.error("Scan failed: " + error.message);
      setProcessing(false);
      setStep(1);
    }
  };

  const handleVerificationComplete = async (verifiedData) => {
      try {
          setProcessing(true);
          // Finalize File Asset Creation
          const finalFilename = DMSController.generateFileName(null, verifiedData);
          const finalFolder = DMSController.generateFolderPath(verifiedData);
          
          // Upload to selected provider if not local
          let uploadUrl = extractedData.file_url || previewUrl;
          if (selectedProvider !== 'Local') {
              const config = storageConfigs?.find(c => c.provider === selectedProvider);
              if (config) {
                 const adapter = StorageFactory.getAdapter(selectedProvider, JSON.parse(config.config || '{}'));
                 const uploadRes = await adapter.uploadFile({name: finalFilename, url: uploadUrl}, finalFolder);
                 uploadUrl = uploadRes.url;
              }
          }

          await base44.entities.AIFileAsset.create({
            file_name: finalFilename,
            file_url: uploadUrl,
            storage_provider: selectedProvider,
            storage_path: finalFolder,
            mime_type: file.type,
            size_bytes: file.size,
            ocr_text: verifiedData.ocr_text,
            metadata_json: JSON.stringify(verifiedData)
          });

          // Suggest Mappings
          const mappings = DMSController.suggestMapping(verifiedData, verifiedData.doc_type);
          setResult({ ...verifiedData, mappings });
          
          setProcessing(false);
          setStep(4); // Result & Linking
          toast.success("File Saved to DMS");
          if (onComplete) onComplete();

      } catch(e) {
          toast.error("Save failed: " + e.message);
          setProcessing(false);
      }
  };

  const handleCreateMapping = async (mapping) => {
      toast.info(`Processing ${mapping.doctype}...`);
      try {
         const res = await DMSController.executeWorkflow(mapping);
         if (res.success) {
             toast.success(`${mapping.doctype} created: ${res.id}`);
         } else {
             toast.error("Failed to execute workflow");
         }
      } catch (e) {
          toast.error("Workflow error: " + e.message);
      }
  };

  return (
    <div className="h-full">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <Card className="w-full border-dashed border-2 border-slate-200 bg-slate-50/50 h-full flex flex-col justify-center">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                <Scan className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold">Smart Document Scan</h3>
              <p className="text-sm text-slate-500 max-w-xs">
                Upload Business Cards, Receipts, or Contracts. AI will extract data, auto-name, and file it.
              </p>
              
              <div className="flex gap-2 w-full max-w-xs">
                <Select value={scanMode} onValueChange={setScanMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General Auto-Detect</SelectItem>
                    <SelectItem value="Business Card">Business Card</SelectItem>
                    <SelectItem value="Receipt">Receipt</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col items-center gap-3 w-full">
                 {storageConfigs && storageConfigs.length > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-slate-500">Save to:</span>
                        <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                            <SelectTrigger className="w-32 h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Local">Local</SelectItem>
                                {storageConfigs.map(c => (
                                    <SelectItem key={c.id} value={c.provider}>{c.provider}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                 )}
                 
                 <div className="flex gap-3">
                    <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*,.pdf" 
                    onChange={handleFileSelect}
                    />
                    <Button onClick={() => fileInputRef.current?.click()} className="bg-indigo-600 hover:bg-indigo-700">
                      <Upload className="w-4 h-4 mr-2" /> Upload File
                    </Button>
                    <Button variant="outline">
                      <ImageIcon className="w-4 h-4 mr-2" /> Camera
                    </Button>
                 </div>
                 </div>
                 </CardContent>
                 </Card>
                 )}

                 {step === 2 && (
           <Card className="h-full flex items-center justify-center">
              <div className="text-center p-8 w-full max-w-md">
                <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-indigo-600" />
                <h3 className="font-semibold mb-2">AI Processing...</h3>
                <Progress value={progress} className="w-full h-2 mb-2" />
                <p className="text-xs text-slate-400">OCR Extraction • Entity Recognition • Auto-Naming</p>
              </div>
           </Card>
        )}

        {step === 3 && extractedData && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                <OCRResultEditor 
                    data={extractedData} 
                    onSave={handleVerificationComplete}
                    onCancel={() => setStep(1)}
                />
            </motion.div>
        )}

        {step === 4 && result && (
          <Card className="h-full">
            <CardContent className="p-6 space-y-6 h-full overflow-y-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900">File Saved Successfully</h3>
                <p className="text-sm text-slate-500">Saved to DMS and ready for linking.</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border space-y-2 text-sm">
                  <div className="flex justify-between">
                      <span className="text-slate-500">Filename</span>
                      <span className="font-mono font-medium">{DMSController.generateFileName(null, result)}</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-slate-500">Folder</span>
                      <span className="font-mono text-slate-600">{DMSController.generateFolderPath(result)}</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-slate-500">Storage</span>
                      <Badge variant="outline">{selectedProvider}</Badge>
                  </div>
              </div>

              {/* Auto-Mapping Suggestions */}
              {result.mappings && result.mappings.length > 0 && (
                  <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                          <Link2 className="w-4 h-4" /> Suggested Actions
                      </h4>
                      {result.mappings.map((map, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                              <div>
                                  <p className="text-sm font-medium text-indigo-900">{map.details}</p>
                                  <p className="text-xs text-indigo-600">Action: {map.action}</p>
                              </div>
                              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => handleCreateMapping(map)}>
                                  Execute
                              </Button>
                          </div>
                      ))}
                  </div>
              )}

              <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
                <RefreshCw className="w-4 h-4 mr-2" /> Scan Another Document
              </Button>
            </CardContent>
          </Card>
        )}
      </AnimatePresence>
    </div>
  );
}