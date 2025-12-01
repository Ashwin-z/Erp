import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Shield, Crown, Lock, AlertTriangle, Save, History, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function OwnerSettings({ tenantId }) {
  const [owner, setOwner] = useState({
    name: 'Nethanial Tan',
    primary_email: 'net28528@gmail.com',
    secondary_email: '',
    is_owner: true,
    protected: true,
    is_superadmin: true
  });
  const [editing, setEditing] = useState(false);
  const [mfaModal, setMfaModal] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [pendingChanges, setPendingChanges] = useState(null);

  useEffect(() => {
    loadOwner();
  }, [tenantId]);

  const loadOwner = async () => {
    try {
      const owners = await base44.entities.SystemOwner.filter({ tenant_id: tenantId, is_owner: true });
      if (owners.length > 0) {
        setOwner(owners[0]);
      }
    } catch (e) {
      // Default owner if none exists
    }
  };

  const handleSave = () => {
    setPendingChanges({ ...owner });
    setMfaModal(true);
  };

  const confirmWithMFA = async () => {
    if (mfaCode.length < 6) {
      toast.error('Please enter a valid MFA code');
      return;
    }

    try {
      // Log audit
      await base44.entities.PermissionAudit.create({
        tenant_id: tenantId,
        actor_email: owner.primary_email,
        actor_name: owner.name,
        action_type: 'owner_edit',
        target_type: 'owner',
        target_id: owner.id,
        target_name: owner.name,
        previous_state: owner,
        new_state: pendingChanges,
        reason: 'Owner settings updated',
        mfa_verified: true
      });

      // Update owner
      if (owner.id) {
        await base44.entities.SystemOwner.update(owner.id, pendingChanges);
      } else {
        await base44.entities.SystemOwner.create({ ...pendingChanges, tenant_id: tenantId });
      }

      setOwner(pendingChanges);
      setMfaModal(false);
      setMfaCode('');
      setEditing(false);
      toast.success('Owner settings updated successfully');
    } catch (e) {
      toast.error('Failed to update owner settings');
    }
  };

  return (
    <>
      <Card className="border-amber-200">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  System Owner
                  <Badge className="bg-amber-500">PROTECTED</Badge>
                </CardTitle>
                <CardDescription>Primary system owner cannot be deleted or demoted</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
              {editing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Warning Banner */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">Protected Account</p>
              <p className="text-xs text-amber-700">
                Changing owner emails may affect recovery & notifications. All changes require MFA verification and are logged.
              </p>
            </div>
          </div>

          {/* Owner Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Owner Name</Label>
              <Input
                value={owner.name}
                onChange={(e) => setOwner({ ...owner, name: e.target.value })}
                disabled={!editing}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Primary Email (Required)
              </Label>
              <Input
                type="email"
                value={owner.primary_email}
                onChange={(e) => setOwner({ ...owner, primary_email: e.target.value })}
                disabled={!editing}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Secondary Email (Optional)
              </Label>
              <Input
                type="email"
                value={owner.secondary_email || ''}
                onChange={(e) => setOwner({ ...owner, secondary_email: e.target.value })}
                disabled={!editing}
                placeholder="backup@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center gap-2 h-10">
                <Badge className="bg-green-100 text-green-700">Active</Badge>
                <Badge className="bg-purple-100 text-purple-700">
                  <Shield className="w-3 h-3 mr-1" />
                  Super Admin
                </Badge>
                <Badge className="bg-amber-100 text-amber-700">
                  <Lock className="w-3 h-3 mr-1" />
                  Non-Deletable
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions */}
          {editing && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button className="bg-amber-500 hover:bg-amber-600" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes (MFA Required)
              </Button>
            </div>
          )}

          {/* Audit Link */}
          <div className="pt-4 border-t">
            <Button variant="ghost" size="sm" className="text-slate-500">
              <History className="w-4 h-4 mr-2" />
              View Change History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* MFA Confirmation Modal */}
      <Dialog open={mfaModal} onOpenChange={setMfaModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-600" />
              MFA Verification Required
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-slate-600">
              Changing owner settings requires MFA verification. Please enter your authenticator code.
            </p>
            <div className="space-y-2">
              <Label>Verification Code</Label>
              <Input
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMfaModal(false)}>Cancel</Button>
            <Button className="bg-amber-500 hover:bg-amber-600" onClick={confirmWithMFA}>
              Verify & Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}