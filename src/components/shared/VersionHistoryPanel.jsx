import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, RotateCcw, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function VersionHistoryPanel({ resourceId }) {
  const versions = [
    { id: 'v3', version: '3.0', author: 'Sarah Chen', time: 'Today, 10:42 AM', changes: 'Updated approval logic', current: true },
    { id: 'v2', version: '2.1', author: 'Mike Ross', time: 'Yesterday', changes: 'Fixed timeout issue', current: false },
    { id: 'v1', version: '1.0', author: 'System', time: 'Nov 20, 2024', changes: 'Initial creation', current: false },
  ];

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-bold text-slate-300 flex items-center gap-2">
          <History className="w-4 h-4" /> Version History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[200px]">
          <div className="divide-y divide-slate-800">
            {versions.map(ver => (
              <div key={ver.id} className={`p-3 hover:bg-slate-800/30 transition-colors ${ver.current ? 'bg-blue-500/5' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-slate-600 text-slate-400 text-[10px] h-5">
                      v{ver.version}
                    </Badge>
                    {ver.current && <Badge className="bg-blue-500/20 text-blue-400 text-[10px] h-5">Current</Badge>}
                  </div>
                  {!ver.current && (
                    <Button size="sm" variant="ghost" className="h-5 w-5 p-0 text-slate-500 hover:text-white" title="Restore">
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-medium truncate">{ver.changes}</p>
                <p className="text-[10px] text-slate-500 mt-1">by {ver.author} • {ver.time}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}