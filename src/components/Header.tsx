import { Link } from 'react-router-dom';
import { UserMenu } from './UserMenu';
import { NotificationCenter, useNotifications } from './NotificationCenter';
import { UserSettings, useUserPreferences } from './UserSettings';
import { useEffect } from 'react';

export function Header() {
  const { notifications, addNotification, markAsRead, dismiss, clearAll } = useNotifications();
  const { preferences, savePreferences } = useUserPreferences();

  // Example: Add sample notifications on mount
  useEffect(() => {
    // Simulate receiving notifications
    const timer = setTimeout(() => {
      addNotification({
        type: 'warning',
        title: 'Budget Alert',
        message: 'Emergency Department is 12% over budget for Q1',
        action: {
          label: 'View Details',
          onClick: () => console.log('Navigate to budget details'),
        },
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="bg-dark-card border-b border-dark-border backdrop-blur-xl bg-opacity-80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-400 transition-all">
          PM0
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/discovery"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:scale-105 transform"
          >
            + New Project
          </Link>
          <Link
            to="/projects"
            className="text-dark-text-muted hover:text-dark-text transition-colors"
          >
            Projects
          </Link>
          <Link
            to="/executive"
            className="text-dark-text-muted hover:text-dark-text transition-colors"
          >
            Executive
          </Link>
          <Link
            to="/finance"
            className="text-dark-text-muted hover:text-dark-text transition-colors"
          >
            Finance
          </Link>
          <Link
            to="/workforce"
            className="text-dark-text-muted hover:text-dark-text transition-colors"
          >
            Workforce
          </Link>
          <div className="flex items-center gap-3 ml-4 pl-4 border-l border-dark-border">
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onDismiss={dismiss}
              onClearAll={clearAll}
            />
            <UserSettings preferences={preferences} onSave={savePreferences} />
            <UserMenu />
          </div>
        </nav>
      </div>
    </header>
  );
}

