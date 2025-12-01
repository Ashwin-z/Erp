import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, FileText, CheckCircle2, AlertCircle, Search, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import JournalForm from './JournalForm';

export default function JournalManager() {
  const [openNew, setOpenNew] = useState(false);
  const [search, setSearch] = useState('');
  
  const { data: journals, isLoading } = useQuery({
      queryKey: ['journals'],
      queryFn: () => base44.entities.JournalEntry.list('-posting_date', 50)
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 flex-1">
           <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                    placeholder="Search journals..." 
                    className="pl-9" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
           </div>
           <Button variant="outline"><Filter className="w-4 h-4 mr-2"/> Filter</Button>
        </div>
        
        <Dialog open={openNew} onOpenChange={setOpenNew}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" /> New Journal Entry
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Journal Entry</DialogTitle>
                </DialogHeader>
                <JournalForm onSuccess={() => setOpenNew(false)} />
            </DialogContent>
        </Dialog>
      </div>

      <Card>
         <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Entry #</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {journals?.map(journal => (
                    <TableRow key={journal.id}>
                        <TableCell>{journal.posting_date}</TableCell>
                        <TableCell className="font-mono">{journal.entry_number || '-'}</TableCell>
                        <TableCell className="max-w-xs truncate">{journal.narration}</TableCell>
                        <TableCell>
                            <Badge variant="secondary" className="font-normal">
                                {journal.entry_type}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">
                            ${journal.total_debit?.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                            <Badge className={
                                journal.status === 'Posted' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' :
                                journal.status === 'Draft' ? 'bg-slate-100 text-slate-600 hover:bg-slate-100' :
                                'bg-red-100 text-red-700'
                            }>
                                {journal.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                    </TableRow>
                ))}
                {!journals?.length && (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                            No journal entries found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
         </Table>
      </Card>
    </div>
  );
}