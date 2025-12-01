import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Home } from 'lucide-react';

export default function PageHeader({ 
  title, 
  subtitle, 
  icon: Icon, 
  iconColor = 'text-lime-600',
  actions,
  backTo = 'Dashboard',
  showBack = true
}) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        {showBack && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-slate-600"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            {Icon && <Icon className={`w-7 h-7 ${iconColor}`} />}
            {title}
          </h1>
          {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
        </div>
      </div>
      {actions && (
        <div className="flex gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}