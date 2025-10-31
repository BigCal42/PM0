import { signOut } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { Button } from './Button';
import { useApp } from '@/contexts/AppContext';

export function UserMenu() {
  const { user } = useAuth();
  const { config } = useApp();
  const toast = useToast();

  // Don't show in demo mode
  if (config.useDemoData || !user) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      window.location.href = '/login';
    } catch (error) {
      toast.error('Failed to sign out', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600">
        {user.name || user.email}
      </span>
      <Button variant="secondary" onClick={handleSignOut}>
        Sign Out
      </Button>
    </div>
  );
}

