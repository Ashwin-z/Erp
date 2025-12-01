import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Eye, Edit, Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DataRow({ 
  id,
  title,
  subtitle,
  amount,
  date,
  status,
  statusColor,
  badge,
  badgeColor,
  linkTo,
  linkParams,
  tooltip,
  onView,
  onEdit,
  onDelete,
  children,
  icon: Icon
}) {
  const content = (
    <div className={`flex items-center gap-4 p-4 bg-slate-50 rounded-xl transition-all duration-200 ${linkTo ? 'cursor-pointer hover:bg-slate-100 hover:shadow-md' : ''} group`}>
      {Icon && (
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
          <Icon className="w-5 h-5 text-slate-500" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-900 text-sm truncate">{title}</span>
          {badge && (
            <Badge className={badgeColor || 'bg-slate-100 text-slate-600'}>
              {badge}
            </Badge>
          )}
        </div>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      {amount && (
        <div className="text-right">
          <p className="font-semibold text-slate-900">{amount}</p>
          {date && <p className="text-xs text-slate-400">{date}</p>}
        </div>
      )}

      {status && (
        <Badge className={statusColor || 'bg-slate-100 text-slate-600'}>
          {status}
        </Badge>
      )}

      {children}

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onView && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.preventDefault(); onView(); }}>
                <Eye className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View Details</TooltipContent>
          </Tooltip>
        )}
        {onEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.preventDefault(); onEdit(); }}>
                <Edit className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={(e) => { e.preventDefault(); onDelete(); }}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        )}
        {linkTo && <ChevronRight className="w-4 h-4 text-slate-400" />}
      </div>
    </div>
  );

  const wrappedContent = tooltip ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : content;

  if (linkTo) {
    const url = linkParams 
      ? `${linkTo}?${new URLSearchParams(linkParams).toString()}`
      : linkTo;
    return (
      <Link to={createPageUrl(url)}>
        {wrappedContent}
      </Link>
    );
  }

  return <TooltipProvider>{wrappedContent}</TooltipProvider>;
}