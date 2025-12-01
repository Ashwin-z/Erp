import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft, ChevronRight, Lock, Eye, EyeOff,
  User, Plus, Calendar, Clock
} from 'lucide-react';
import moment from 'moment';

const categoryColors = {
  work: '#3b82f6',
  personal: '#a855f7',
  project: '#06b6d4',
  ticket: '#ec4899',
  leave: '#f59e0b',
  company: '#22c55e'
};

export default function PersonalCalendarView({ 
  events, 
  onEventClick, 
  onAddEvent,
  sharingSettings,
  onSharingChange
}) {
  const [currentDate, setCurrentDate] = useState(moment());
  const [showPrivate, setShowPrivate] = useState(true);
  const [view, setView] = useState('week');

  const getWeekDays = () => {
    const days = [];
    const start = moment(currentDate).startOf('week');
    for (let i = 0; i < 7; i++) {
      days.push(moment(start).add(i, 'days'));
    }
    return days;
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8am to 8pm

  const getEventsForDayAndHour = (day, hour) => {
    return (events || []).filter(e => {
      const eventStart = moment(e.start_time);
      return eventStart.isSame(day, 'day') && eventStart.hour() === hour;
    });
  };

  const navigate = (dir) => {
    setCurrentDate(moment(currentDate).add(dir, 'week'));
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            My Calendar
            <Badge variant="outline" className="text-xs">
              <Lock className="w-3 h-3 mr-1" />
              Private
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-3">
            {/* Privacy Toggle */}
            <div className="flex items-center gap-2">
              <Switch
                checked={showPrivate}
                onCheckedChange={setShowPrivate}
              />
              <Label className="text-sm">Show Private</Label>
            </div>

            {/* Navigation */}
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(moment())}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigate(1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <Button className="bg-purple-600 hover:bg-purple-700" onClick={onAddEvent}>
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>
        <p className="text-slate-500 text-sm mt-1">
          Week of {moment(currentDate).startOf('week').format('MMM D')} - {moment(currentDate).endOf('week').format('MMM D, YYYY')}
        </p>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-auto">
        <div className="min-w-[800px]">
          {/* Day Headers */}
          <div className="flex border-b bg-slate-50 sticky top-0 z-10">
            <div className="w-16 flex-shrink-0 p-2 border-r" />
            {getWeekDays().map((day, i) => {
              const isToday = day.isSame(moment(), 'day');
              return (
                <div key={i} className={`flex-1 p-2 text-center border-r last:border-r-0 ${isToday ? 'bg-purple-50' : ''}`}>
                  <div className="text-xs text-slate-500">{day.format('ddd')}</div>
                  <div className={`text-lg font-semibold ${isToday ? 'text-purple-600' : ''}`}>{day.format('D')}</div>
                </div>
              );
            })}
          </div>

          {/* Time Slots */}
          <div className="divide-y">
            {hours.map(hour => (
              <div key={hour} className="flex min-h-[60px]">
                <div className="w-16 flex-shrink-0 p-2 border-r text-xs text-slate-500 text-right">
                  {moment().hour(hour).format('h A')}
                </div>
                {getWeekDays().map((day, i) => {
                  const slotEvents = getEventsForDayAndHour(day, hour);
                  const isToday = day.isSame(moment(), 'day');
                  
                  return (
                    <div 
                      key={i} 
                      className={`flex-1 p-1 border-r last:border-r-0 ${isToday ? 'bg-purple-50/30' : ''}`}
                      onClick={() => onAddEvent && onAddEvent(day.hour(hour))}
                    >
                      {slotEvents.map((event, j) => {
                        const isPrivate = event.is_private && !showPrivate;
                        return (
                          <div
                            key={j}
                            className={`text-xs px-2 py-1 rounded mb-1 cursor-pointer ${
                              isPrivate ? 'bg-slate-200 text-slate-500' : ''
                            }`}
                            style={!isPrivate ? { 
                              backgroundColor: categoryColors[event.category] + '20', 
                              color: categoryColors[event.category],
                              borderLeft: `3px solid ${categoryColors[event.category]}`
                            } : {}}
                            onClick={(e) => { e.stopPropagation(); onEventClick && onEventClick(event); }}
                          >
                            <div className="flex items-center gap-1">
                              {event.is_private && <Lock className="w-3 h-3" />}
                              <span className="truncate">{isPrivate ? 'Private Event' : event.title}</span>
                            </div>
                            {!isPrivate && (
                              <div className="text-[10px] opacity-70 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                {moment(event.start_time).format('h:mm A')}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Sharing Summary */}
      <div className="p-3 border-t bg-slate-50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-slate-500">Sharing:</span>
            <Badge variant="outline" className="text-xs">
              <Eye className="w-3 h-3 mr-1" />
              Work Tasks → Team
            </Badge>
            <Badge variant="outline" className="text-xs">
              <EyeOff className="w-3 h-3 mr-1" />
              Personal → Private
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onSharingChange}>
            Manage Sharing
          </Button>
        </div>
      </div>
    </Card>
  );
}