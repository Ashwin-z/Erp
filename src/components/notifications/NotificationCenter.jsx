import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Bell, Eye, CheckCircle2, XCircle, Receipt, FileText, 
  DollarSign, AlertTriangle, Check, Loader2 
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

const notificationIcons = {
  quote_viewed: { icon: Eye, color: 'text-blue-500', bg: 'bg-blue-100' },
  quote_accepted: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-100' },
  quote_rejected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100' },
  invoice_paid: { icon: DollarSign, color: 'text-green-500', bg: 'bg-green-100' },
  invoice_overdue: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-100' }
};

export default function NotificationCenter() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['salesNotifications'],
    queryFn: () => base44.entities.SalesNotification.list('-created_date', 20),
    refetchInterval: 10000 // Poll every 10 seconds
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id) => base44.entities.SalesNotification.update(id, { is_read: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['salesNotifications'] })
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const unread = notifications.filter(n => !n.is_read);
      await Promise.all(unread.map(n => 
        base44.entities.SalesNotification.update(n.id, { is_read: true })
      ));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesNotifications'] });
      toast.success('All notifications marked as read');
    }
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Show toast for new notifications
  useEffect(() => {
    const latestUnread = notifications.find(n => !n.is_read);
    if (latestUnread) {
      const timeDiff = moment().diff(moment(latestUnread.created_date), 'seconds');
      if (timeDiff < 15) {
        const iconConfig = notificationIcons[latestUnread.type] || notificationIcons.quote_viewed;
        toast(latestUnread.title, {
          description: latestUnread.message,
          icon: <iconConfig.icon className={`w-5 h-5 ${iconConfig.color}`} />
        });
      }
    }
  }, [notifications]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
            >
              {markAllAsReadMutation.isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Mark all read
                </>
              )}
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        
        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const iconConfig = notificationIcons[notification.type] || notificationIcons.quote_viewed;
              const Icon = iconConfig.icon;
              
              return (
                <div
                  key={notification.id}
                  className={`px-3 py-3 border-b last:border-0 cursor-pointer hover:bg-slate-50 transition-colors ${
                    !notification.is_read ? 'bg-blue-50/50' : ''
                  }`}
                  onClick={() => {
                    if (!notification.is_read) {
                      markAsReadMutation.mutate(notification.id);
                    }
                  }}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-full ${iconConfig.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${iconConfig.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{notification.title}</span>
                        {!notification.is_read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{notification.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">
                          {moment(notification.created_date).fromNow()}
                        </span>
                        {notification.amount > 0 && (
                          <Badge variant="outline" className="text-xs py-0">
                            ${notification.amount.toLocaleString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}