import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  History, GitBranch, RotateCcw, Eye, Download, Trash2, Tag, Clock
} from 'lucide-react';
import { toast } from 'sonner';

const versions = [
  { id: 'v3', version: '3.0', name: 'Current Version', date: '2024-11-27 14:30', author: 'Sarah Chen', changes: 'Added AI insights section', isCurrent: true },
  { id: 'v2', version: '2.1', name: 'Previous', date: '2024-11-25 10:15', author: 'Mike Wong', changes: 'Updated KPI widgets', isCurrent: false },
  { id: 'v1', version: '1.0', name: 'Initial', date: '2024-11-20 09:00', author: 'Sarah Chen', changes: 'Initial template creation', isCurrent: false }
];

export default function ReportVersioning({ templateId, onRestore }) {
  const [showTagModal, setShowTagModal] = useState(false);
  const [tagName, setTagName] = useState('');

  const restoreVersion = (version) => {
    onRestore?.(version);
    toast.success(`Restored to version ${version.version}`);
  };

  const createTag = () => {
    if (tagName) {
      toast.success(`Tag "${tagName}" created`);
      setTagName('');
      setShowTagModal(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-400" />
          Version History
        </h3>
        <Button size="sm" variant="outline" className="border-slate-600" onClick={() => setShowTagModal(true)}>
          <Tag className="w-4 h-4 mr-1" />
          Create Tag
        </Button>
      </div>

      {showTagModal && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-3 flex gap-2">
            <Input
              placeholder="Tag name (e.g., v3.0-stable)"
              className="bg-slate-700 border-slate-600"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
            />
            <Button size="sm" onClick={createTag}>Create</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowTagModal(false)}>Cancel</Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {versions.map((v, idx) => (
          <Card key={v.id} className={`border ${v.isCurrent ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${v.isCurrent ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                    <GitBranch className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">v{v.version}</span>
                      {v.isCurrent && <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">Current</Badge>}
                    </div>
                    <p className="text-slate-500 text-xs">{v.changes}</p>
                    <p className="text-slate-600 text-xs flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {v.date} by {v.author}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Eye className="w-3 h-3 text-slate-400" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Download className="w-3 h-3 text-slate-400" />
                  </Button>
                  {!v.isCurrent && (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => restoreVersion(v)}>
                      <RotateCcw className="w-3 h-3 text-cyan-400" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}