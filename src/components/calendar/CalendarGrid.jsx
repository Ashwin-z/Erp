import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Video, MapPin, Users, Clock, ChevronLeft, ChevronRight,
  MoreHorizontal, Plus
} from 'lucide-react';
import moment from 'moment';

const platformIcons = {
  zoom: '🎥',
  teams: '👥',
  google_meet: '📹',
  webex: '🖥️',
  phone: '📞',
  in_person: '🏢'
};

export default function CalendarGrid({ 
  view, 
  currentDate, 
  events, 
  onDateChange, 
  onEventClick,
  onSlotClick 
}) {
  const today = moment();
  const startOfView = moment(currentDate).startOf(view === 'month' ? 'month' : 'week');
  const endOfView = moment(currentDate).endOf(view === 'month' ? 'month' : 'week');

  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7am to 9pm
  const days = [];
  
  if (view === 'month') {
    let day = moment(startOfView).startOf('week');
    while (day.isBefore(moment(endOfView).endOf('week'))) {
      days.push(day.clone());
      day.add(1, 'day');
    }
  } else if (view === 'week') {
    for (let i = 0; i < 7; i++) {
      days.push(moment(startOfView).add(i, 'days'));
    }
  } else {
    days.push(moment(currentDate));
  }

  const getEventsForDay = (day) => {
    return events.filter(event => 
      moment(event.start_time).isSame(day, 'day')
    ).sort((a, b) => moment(a.start_time).diff(moment(b.start_time)));
  };

  const getEventsForHour = (day, hour) => {
    return events.filter(event => {
      const start = moment(event.start_time);
      return start.isSame(day, 'day') && start.hour() === hour;
    });
  };

  // Month View
  if (view === 'month') {
    return (
      <div className="bg-white rounded-xl border overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-slate-50 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-slate-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const dayEvents = getEventsForDay(day);
            const isToday = day.isSame(today, 'day');
            const isCurrentMonth = day.isSame(currentDate, 'month');

            return (
              <div
                key={i}
                className={`min-h-[120px] border-b border-r p-2 cursor-pointer hover:bg-slate-50 transition-colors
                  ${!isCurrentMonth ? 'bg-slate-50/50' : ''}
                  ${isToday ? 'bg-lime-50' : ''}`}
                onClick={() => onSlotClick(day.toDate())}
              >
                <div className={`text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full
                  ${isToday ? 'bg-lime-500 text-white' : isCurrentMonth ? 'text-slate-900' : 'text-slate-400'}`}>
                  {day.format('D')}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <motion.div
                      key={event.id}
                      whileHover={{ scale: 1.02 }}
                      className="text-xs p-1 rounded truncate cursor-pointer"
                      style={{ backgroundColor: event.color || '#3b82f6', color: 'white' }}
                      onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                    >
                      {moment(event.start_time).format('HH:mm')} {event.title}
                    </motion.div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-slate-500 pl-1">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Week/Day View
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      {/* Header */}
      <div className="grid" style={{ gridTemplateColumns: `60px repeat(${days.length}, 1fr)` }}>
        <div className="p-3 border-b border-r bg-slate-50" />
        {days.map((day, i) => {
          const isToday = day.isSame(today, 'day');
          return (
            <div 
              key={i} 
              className={`p-3 text-center border-b border-r ${isToday ? 'bg-lime-50' : 'bg-slate-50'}`}
            >
              <div className="text-xs text-slate-500">{day.format('ddd')}</div>
              <div className={`text-lg font-semibold ${isToday ? 'text-lime-600' : ''}`}>
                {day.format('D')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time Grid */}
      <div className="overflow-y-auto max-h-[600px]">
        {hours.map(hour => (
          <div 
            key={hour} 
            className="grid"
            style={{ gridTemplateColumns: `60px repeat(${days.length}, 1fr)` }}
          >
            <div className="p-2 text-xs text-slate-400 text-right pr-3 border-r">
              {hour}:00
            </div>
            {days.map((day, dayIdx) => {
              const hourEvents = getEventsForHour(day, hour);
              return (
                <div 
                  key={dayIdx}
                  className="min-h-[60px] border-b border-r p-1 hover:bg-slate-50 cursor-pointer relative"
                  onClick={() => onSlotClick(day.hour(hour).toDate())}
                >
                  {hourEvents.map(event => {
                    const duration = moment(event.end_time).diff(moment(event.start_time), 'minutes');
                    const height = Math.max(40, (duration / 60) * 60);
                    return (
                      <motion.div
                        key={event.id}
                        whileHover={{ scale: 1.02 }}
                        className="absolute left-1 right-1 rounded-lg p-2 text-white text-xs overflow-hidden cursor-pointer shadow-sm"
                        style={{ 
                          backgroundColor: event.color || '#3b82f6',
                          height: `${height}px`,
                          zIndex: 10
                        }}
                        onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="flex items-center gap-1 mt-1 opacity-80">
                          <Clock className="w-3 h-3" />
                          {moment(event.start_time).format('HH:mm')}
                          {event.meeting_platform && (
                            <span className="ml-1">{platformIcons[event.meeting_platform]}</span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}