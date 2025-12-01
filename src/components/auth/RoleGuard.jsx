import React from 'react';
import useUserRole from '@/components/hooks/useUserRole';
import { Loader2 } from 'lucide-react';

/**
 * Wrapper component to protect routes or sections based on user roles
 * @param {Array} allowedRoles - List of roles allowed to access the content
 * @param {ReactNode} children - Content to render if access is granted
 * @param {ReactNode} fallback - Content to render if access is denied (optional)
 */
export default function RoleGuard({ allowedRoles = [], children, fallback = null }) {
  const { role, loading } = useUserRole();

  if (loading) {
    return <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>;
  }

  // If no specific roles are required, allow access
  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }

  // Check if user's role is in the allowed list
  // 'Platform Admin' usually has access to everything
  if (role === 'Platform Admin' || allowedRoles.includes(role)) {
    return children;
  }

  return fallback || (
    <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-2">Access Denied</h3>
      <p className="text-slate-500">You do not have permission to view this content.</p>
    </div>
  );
}