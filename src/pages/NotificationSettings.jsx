import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, MessageSquare, Smartphone, Save, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const ALERT_TYPES = [
  { type: 'WorkflowStatus', label: 'Workflow Status Changes', defaultSeverity: 'Info' },
  { type: 'PaymentConfirmation', label: 'Payment Confirmations', defaultSeverity: 'Info' },
  { type: 'AIInsight', label: 'AI Generated Insights', defaultSeverity: 'Info' },
  { type: 'ComplianceIssue', label: 'Compliance Issues', defaultSeverity: 'Critical' },
  { type: 'SystemAlert', label: 'System Alerts', defaultSeverity: 'Warning' },
];

export default function NotificationSettings() {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/Dashboard');
    }
  };

  const queryClient = useQueryClient();
  const [localSettings, setLocalSettings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await base44.auth.me();
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, []);

  const { data: savedConfigs, isLoading } = useQuery({
    queryKey: ['notificationConfigs'],
    queryFn: async () => {
      if (!currentUser) return [];
      return await base44.entities.NotificationConfig.list({
        user_id: currentUser.id
      });
    },
    enabled: !!currentUser
  });

  useEffect(() => {
    if (currentUser) {
      // Merge saved configs with default types
      const merged = ALERT_TYPES.map(def => {
        const saved = savedConfigs?.find(c => c.alert_type === def.type);
        return {
          id: saved?.id, // If exists, we have an ID
          type: def.type,
          label: def.label,
          email: saved?.channels?.email ?? true,
          sms: saved?.channels?.sms ?? false,
          inApp: saved?.channels?.in_app ?? true,
          severity: saved?.min_severity ?? def.defaultSeverity
        };
      });
      setLocalSettings(merged);
    }
  }, [savedConfigs, currentUser]);

  const saveMutation = useMutation({
    mutationFn: async (newSettings) => {
      const promises = newSettings.map(setting => {
        const payload = {
          user_id: currentUser.id,
          alert_type: setting.type,
          channels: {
            email: setting.email,
            sms: setting.sms,
            in_app: setting.inApp
          },
          min_severity: setting.severity,
          frequency: 'RealTime' // Default
        };

        if (setting.id) {
          return base44.entities.NotificationConfig.update(setting.id, payload);
        } else {
          return base44.entities.NotificationConfig.create(payload);
        }
      });
      return Promise.all(promises);
    },
    onSuccess: () => {
      toast.success("Notification preferences updated successfully");
      queryClient.invalidateQueries(['notificationConfigs']);
    },
    onError: () => {
      toast.error("Failed to update preferences");
    }
  });

  const toggleSetting = (type, channel) => {
    setLocalSettings(localSettings.map(s => 
      s.type === type ? { ...s, [channel]: !s[channel] } : s
    ));
  };

  const changeSeverity = (type, value) => {
    setLocalSettings(localSettings.map(s => 
      s.type === type ? { ...s, severity: value } : s
    ));
  };

  const handleSave = () => {
    if (!currentUser) {
      toast.error("You must be logged in to save settings");
      return;
    }
    saveMutation.mutate(localSettings);
  };

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={handleBack} className="text-slate-400 hover:text-white hover:bg-slate-800">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-400" />
            Notification Center
          </h1>
          <p className="text-slate-400">Configure your multi-channel alert preferences</p>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 max-w-4xl">
        <CardHeader>
          <CardTitle>Alert Configuration</CardTitle>
          <CardDescription>Manage how and when you receive updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 text-sm font-bold text-slate-500 uppercase">
              <div className="col-span-4">Alert Type</div>
              <div className="col-span-2 text-center">Severity</div>
              <div className="col-span-2 text-center flex items-center justify-center gap-2"><Mail className="w-4 h-4" /> Email</div>
              <div className="col-span-2 text-center flex items-center justify-center gap-2"><Smartphone className="w-4 h-4" /> SMS</div>
              <div className="col-span-2 text-center flex items-center justify-center gap-2"><MessageSquare className="w-4 h-4" /> In-App</div>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                Loading preferences...
              </div>
            ) : localSettings.map((setting) => (
              <div key={setting.type} className="grid grid-cols-12 gap-4 items-center p-4 hover:bg-slate-800/30 rounded-lg transition-colors">
                <div className="col-span-4 font-medium text-slate-200">
                  {setting.label}
                </div>
                <div className="col-span-2 text-center flex justify-center">
                  <Select value={setting.severity} onValueChange={(val) => changeSeverity(setting.type, val)}>
                    <SelectTrigger className="h-8 w-[100px] border-0 bg-transparent p-0">
                       <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                      <SelectItem value="Info">
                        <Badge variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/10">Info</Badge>
                      </SelectItem>
                      <SelectItem value="Warning">
                        <Badge variant="outline" className="border-amber-500 text-amber-400 hover:bg-amber-500/10">Warning</Badge>
                      </SelectItem>
                      <SelectItem value="Critical">
                        <Badge variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10">Critical</Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 flex justify-center">
                  <Switch checked={setting.email} onCheckedChange={() => toggleSetting(setting.type, 'email')} />
                </div>
                <div className="col-span-2 flex justify-center">
                  <Switch checked={setting.sms} onCheckedChange={() => toggleSetting(setting.type, 'sms')} />
                </div>
                <div className="col-span-2 flex justify-center">
                  <Switch checked={setting.inApp} onCheckedChange={() => toggleSetting(setting.type, 'inApp')} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Button 
              className="bg-blue-600 hover:bg-blue-700" 
              onClick={handleSave}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saveMutation.isPending ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}