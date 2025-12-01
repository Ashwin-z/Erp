import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Bell, BellRing, AlertTriangle, Shield, Clock, CheckCircle2, 
  X, Settings, Mail, Smartphone, Zap, Eye, Trash2, Check
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const NOTIFICATION_TYPES = {
  security: { icon: Shield, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  request: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  ai: { icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
  system: { icon: Bell, color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' },
  success: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' }
};

const sampleNotifications = [
  { id: '1', type: 'security', title: 'Suspicious Login Attempt', message: 'Multiple failed login attempts detected from IP 192.168.1.x', timestamp: new Date('2025-01-25T10:30:00'), read: false, critical: true, actionable: true },
  { id: '2', type: 'request', title: 'New Access Request', message: 'Mike Johnson requested access to Finance Module', timestamp: new Date('2025-01-25T09:15:00'), read: false, critical: false, actionable: true },
  { id: '3', type: 'ai', title: 'AI Recommendation', message: 'Detected 3 users with excessive permissions. Review suggested.', timestamp: new Date('2025-01-25T08:00:00'), read: false, critical: false, actionable: true },
  { id: '4', type: 'security', title: 'Permission Escalation', message: 'User john@arkfinex.com granted Super Admin access', timestamp: new Date('2025-01-24T16:30:00'), read: true, critical: true, actionable: false },
  { id: '5', type: 'system', title: 'Scheduled Report Generated', message: 'Weekly Security Report has been generated and sent', timestamp: new Date('2025-01-24T06:00:00'), read: true, critical: false, actionable: false },
  { id: '6', type: 'success', title: 'Backup Completed', message: 'System backup completed successfully', timestamp: new Date('2025-01-23T23:00:00'), read: true, critical: false, actionable: false }
];

const notificationSettings = {
  email: {
    security_critical: true,
    security_warning: true,
    access_requests: true,
    ai_recommendations: false,
    system_updates: false
  },
  push: {
    security_critical: true,
    security_warning: false,
    access_requests: true,
    ai_recommendations: true,
    system_updates: false
  }
};

export default function NotificationCenter({ isOpen, onClose, onNotificationCount }) {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [activeTab, setActiveTab] = useState('all');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(notificationSettings);

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.critical && !n.read).length;

  useEffect(() => {
    if (onNotificationCount) {
      onNotificationCount(unreadCount);
    }
  }, [unreadCount, onNotificationCount]);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  const handleAction = (notification) => {
    markAsRead(notification.id);
    if (notification.type === 'request') {
      toast.success('Opening access request...');
    } else if (notification.type === 'ai') {
      toast.success('Opening AI recommendations...');
    } else if (notification.type === 'security') {
      toast.success('Opening security alert details...');
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'critical') return n.critical;
    return n.type === activeTab;
  });

  const toggleSetting = (channel, setting) => {
    setSettings(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [setting]: !prev[channel][setting]
      }
    }));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge className="bg-red-500">{unreadCount}</Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSettingsOpen(true)}>
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread" className="relative">
                Unread
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="critical" className="relative">
                Critical
                {criticalCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                    {criticalCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <div className="flex justify-between mb-3">
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Check className="w-3 h-3 mr-1" />
                Mark all read
              </Button>
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-red-500">
                <Trash2 className="w-3 h-3 mr-1" />
                Clear all
              </Button>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  filteredNotifications.map(notification => {
                    const config = NOTIFICATION_TYPES[notification.type];
                    const Icon = config.icon;
                    return (
                      <div 
                        key={notification.id}
                        className={`p-3 rounded-lg border ${config.bg} ${config.border} ${!notification.read ? 'ring-2 ring-blue-200' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-white ${config.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{notification.title}</p>
                              {notification.critical && (
                                <Badge className="bg-red-500 text-[10px] px-1">CRITICAL</Badge>
                              )}
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mt-1">{notification.message}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[10px] text-slate-400">
                                {format(notification.timestamp, 'MMM dd, HH:mm')}
                              </span>
                              <div className="flex gap-1">
                                {notification.actionable && (
                                  <Button 
                                    size="sm" 
                                    className="h-6 text-xs bg-lime-500 hover:bg-lime-600"
                                    onClick={() => handleAction(notification)}
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    View
                                  </Button>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-6 w-6 p-0"
                                  onClick={() => deleteNotification(notification.id)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Notification Settings
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Email Notifications */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-4 h-4" />
                <h3 className="font-medium">Email Notifications</h3>
              </div>
              <div className="space-y-3">
                {Object.entries(settings.email).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <span className="text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                    <Switch checked={value} onCheckedChange={() => toggleSetting('email', key)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Push Notifications */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="w-4 h-4" />
                <h3 className="font-medium">In-App Notifications</h3>
              </div>
              <div className="space-y-3">
                {Object.entries(settings.push).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <span className="text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                    <Switch checked={value} onCheckedChange={() => toggleSetting('push', key)} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button className="w-full bg-lime-500 hover:bg-lime-600" onClick={() => {
            setSettingsOpen(false);
            toast.success('Notification settings saved');
          }}>
            Save Settings
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Notification Bell Component for Header
export function NotificationBell({ onClick }) {
  const [unreadCount, setUnreadCount] = useState(3);

  return (
    <Button variant="ghost" size="icon" className="relative" onClick={onClick}>
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </Button>
  );
}