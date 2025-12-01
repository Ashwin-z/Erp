import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export default function useUserRole() {
  const [role, setRole] = useState('Agency Member'); // Default safe fallback
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const user = await base44.auth.me();
        if (!user || !user.email) {
           setLoading(false);
           return;
        }

        // Check UserRole entity
        // Note: In a real app, we might want to cache this or put it in a context
        try {
           const roles = await base44.entities.UserRole.list();
           // Find the role for this user
           const userRole = roles.find(r => r.user_email === user.email);
           
           if (userRole) {
              setRole(userRole.role);
           } else {
              // Logic for demo: Admin email gets Platform Admin
              if (user.email.includes('admin')) setRole('Platform Admin');
              else if (user.email.includes('agency')) setRole('Agency Admin');
              else setRole('Advertiser');
           }
        } catch (e) {
           console.warn("Could not fetch UserRoles", e);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  return { role, loading, isPlatformAdmin: role === 'Platform Admin', isAgencyAdmin: role === 'Agency Admin' };
}