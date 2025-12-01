import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { DMSController } from './DMSController';
import { 
  Folder, FileText, MoreVertical, Download, ExternalLink, 
  Image as ImageIcon, File, Search, Filter, SlidersHorizontal
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import moment from 'moment';
import ThumbnailGrid from './ThumbnailGrid';

export default function FileBrowser({ viewMode = 'grid', filter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
      docType: 'All',
      provider: 'All',
      startDate: '',
      endDate: ''
  });
  
  const { data: files, isLoading } = useQuery({
    queryKey: ['dmsFiles', filter],
    queryFn: () => base44.entities.AIFileAsset.list('-created_date', 100),
    initialData: []
  });

  // Advanced Search Filter
  const filteredFiles = DMSController.searchFiles(files, {
      search: searchTerm,
      ...filters
  });

  const resetFilters = () => {
      setFilters({ docType: 'All', provider: 'All', startDate: '', endDate: '' });
      setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search by name, OCR content, or keywords..." 
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">
                    <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
                    {(filters.docType !== 'All' || filters.provider !== 'All') && (
                        <Badge variant="secondary" className="ml-2 bg-indigo-100 text-indigo-700">Active</Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Advanced Filters</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 py-6">
                    <div className="space-y-2">
                        <Label>Document Type</Label>
                        <Select value={filters.docType} onValueChange={(v) => setFilters({...filters, docType: v})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Types</SelectItem>
                                <SelectItem value="Receipt">Receipt</SelectItem>
                                <SelectItem value="Invoice">Invoice</SelectItem>
                                <SelectItem value="Business Card">Business Card</SelectItem>
                                <SelectItem value="Contract">Contract</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Storage Provider</Label>
                        <Select value={filters.provider} onValueChange={(v) => setFilters({...filters, provider: v})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Providers</SelectItem>
                                <SelectItem value="Local">Local</SelectItem>
                                <SelectItem value="Google Drive">Google Drive</SelectItem>
                                <SelectItem value="Dropbox">Dropbox</SelectItem>
                                <SelectItem value="OneDrive">OneDrive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Date Range</Label>
                        <div className="flex gap-2">
                            <Input type="date" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} />
                            <Input type="date" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} />
                        </div>
                    </div>
                    <Button onClick={resetFilters} variant="ghost" className="w-full text-red-500">
                        Reset Filters
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
      </div>

      {viewMode === 'grid' ? (
        <ThumbnailGrid files={filteredFiles} />
      ) : (
        <div className="grid grid-cols-1 gap-2">
           {filteredFiles.map(file => (
               <div key={file.id} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-slate-50">
                   <div className="flex items-center gap-3">
                       <div className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded">
                            <FileText className="w-4 h-4 text-slate-500" />
                       </div>
                       <div>
                           <p className="text-sm font-medium">{file.file_name}</p>
                           <p className="text-xs text-slate-400">{file.storage_path} • {moment(file.created_date).format('MMM D, YYYY')}</p>
                       </div>
                   </div>
                   <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-xs">{file.storage_provider}</Badge>
                        <span className="text-xs text-slate-400">{(file.size_bytes / 1024).toFixed(0)} KB</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4 text-slate-400" />
                        </Button>
                   </div>
               </div>
           ))}
           {filteredFiles.length === 0 && (
                <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed">
                    <p>No files found matching your filters.</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
}