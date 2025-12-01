import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FileText, Upload, Download, Trash2, Folder, Image, File, Loader2, Plus, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

const categoryIcons = {
  contract: FileText,
  specification: File,
  design: Image,
  report: FileText,
  other: Folder
};

const categoryColors = {
  contract: 'bg-blue-100 text-blue-700',
  specification: 'bg-violet-100 text-violet-700',
  design: 'bg-pink-100 text-pink-700',
  report: 'bg-amber-100 text-amber-700',
  other: 'bg-slate-100 text-slate-700'
};

export default function ProjectDocuments({ project }) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', category: 'other', file: null });
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['project-documents', project?.id],
    queryFn: () => base44.entities.ProjectDocument.filter({ project_id: project.id }, '-created_date'),
    enabled: !!project?.id
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      return base44.entities.ProjectDocument.create({
        ...data,
        project_id: project.id,
        uploaded_by: user.email
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-documents', project?.id] });
      toast.success('Document uploaded');
      setUploadOpen(false);
      setFormData({ name: '', description: '', category: 'other', file: null });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ProjectDocument.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-documents', project?.id] });
      toast.success('Document deleted');
    }
  });

  const handleUpload = async () => {
    if (!formData.file || !formData.name) {
      toast.error('Please provide file and name');
      return;
    }
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: formData.file });
      await createMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        file_url,
        file_type: formData.file.type,
        file_size: formData.file.size
      });
    } catch (error) {
      toast.error('Upload failed');
    }
    setUploading(false);
  };

  const groupedDocs = documents.reduce((acc, doc) => {
    const cat = doc.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold flex items-center gap-2">
          <Folder className="w-5 h-5 text-slate-500" />Documents ({documents.length})
        </h3>
        <Button onClick={() => setUploadOpen(true)} size="sm">
          <Upload className="w-4 h-4 mr-2" />Upload
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
      ) : documents.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Folder className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No documents yet</p>
            <Button onClick={() => setUploadOpen(true)} variant="outline" className="mt-3">
              <Upload className="w-4 h-4 mr-2" />Upload First Document
            </Button>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedDocs).map(([category, docs]) => {
          const Icon = categoryIcons[category] || Folder;
          return (
            <Card key={category} className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 capitalize">
                  <Icon className="w-4 h-4" />{category} ({docs.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {docs.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryColors[doc.category]}`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-slate-500">
                          {moment(doc.created_date).format('DD MMM YYYY')} • {(doc.file_size / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon"><ExternalLink className="w-4 h-4" /></Button>
                      </a>
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(doc.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>File</Label>
              <Input type="file" onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })} />
            </div>
            <div className="space-y-2">
              <Label>Document Name</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Project Proposal v1" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="specification">Specification</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
            <Button onClick={handleUpload} disabled={uploading || !formData.file}>
              {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}