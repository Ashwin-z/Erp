import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Share2, Users, Building2, Globe, Copy, Trash2, Calendar } from 'lucide-react';

export default function WidgetShareModal({ open, onClose, widget, onSave }) {
  const [visibility, setVisibility] = useState(widget?.visibility || 'private');
  const [sharedWith, setSharedWith] = useState(widget?.shared_with || []);
  const [newEmail, setNewEmail] = useState('');
  const [expiry, setExpiry] = useState('');

  const addUser = () => {
    if (newEmail && !sharedWith.includes(newEmail)) {
      setSharedWith([...sharedWith, newEmail]);
      setNewEmail('');
    }
  };

  const removeUser = (email) => {
    setSharedWith(sharedWith.filter(e => e !== email));
  };

  const handleSave = () => {
    onSave && onSave({
      visibility,
      shared_with: sharedWith,
      share_expiry: expiry || null
    });
    onClose();
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(`https://app.arkschedule.com/widget/${widget?.share_token || 'token'}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-lime-600" />
            Share Widget: {widget?.title}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="visibility" className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="visibility">Visibility</TabsTrigger>
            <TabsTrigger value="users">Specific Users</TabsTrigger>
            <TabsTrigger value="link">Share Link</TabsTrigger>
          </TabsList>

          <TabsContent value="visibility" className="space-y-4">
            {[
              { id: 'private', icon: Lock, label: 'Private', desc: 'Only you can see this' },
              { id: 'shared', icon: Users, label: 'Selected Users', desc: 'Share with specific people' },
              { id: 'team', icon: Users, label: 'My Team', desc: 'Visible to team members' },
              { id: 'department', icon: Building2, label: 'Department', desc: 'Visible to department' },
              { id: 'company', icon: Globe, label: 'Company', desc: 'Visible to everyone' }
            ].map(opt => (
              <div
                key={opt.id}
                onClick={() => setVisibility(opt.id)}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  visibility === opt.id ? 'border-lime-500 bg-lime-50 ring-1 ring-lime-300' : 'hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <opt.icon className={`w-5 h-5 ${visibility === opt.id ? 'text-lime-600' : 'text-slate-400'}`} />
                  <div>
                    <p className="font-medium text-sm">{opt.label}</p>
                    <p className="text-xs text-slate-500">{opt.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter email address"
              />
              <Button onClick={addUser}>Add</Button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {sharedWith.map((email, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-sm">{email}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeUser(email)}>
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                </div>
              ))}
              {sharedWith.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No users added yet</p>
              )}
            </div>
            <div>
              <Label className="text-xs">Expiry Date (Optional)</Label>
              <Input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="mt-1" />
            </div>
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-2">Share Link</p>
              <div className="flex gap-2">
                <Input 
                  value={`https://app.arkschedule.com/widget/${widget?.share_token || 'abc123'}`} 
                  readOnly 
                  className="text-xs"
                />
                <Button variant="outline" onClick={copyShareLink}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Anyone with this link can view this widget (if company policy allows)
            </p>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-lime-500 hover:bg-lime-600" onClick={handleSave}>
            Save Sharing Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}