/**
 * User Settings - Preferences and configuration
 */

import { useState } from 'react';
import { Settings, X, Save, Bell, Eye, Database } from 'lucide-react';
import { Button } from './Button';

export interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  notifications: {
    enabled: boolean;
    email: boolean;
    push: boolean;
    frequency: 'realtime' | 'hourly' | 'daily';
  };
  dashboard: {
    refreshInterval: number; // in seconds
    defaultView: 'executive' | 'finance' | 'workforce' | 'operations';
    showTrends: boolean;
    compactMode: boolean;
  };
  data: {
    autoExport: boolean;
    exportFormat: 'csv' | 'excel' | 'json';
    cacheEnabled: boolean;
  };
}

interface UserSettingsProps {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
}

export function UserSettings({ preferences, onSave }: UserSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localPrefs, setLocalPrefs] = useState(preferences);

  const handleSave = () => {
    onSave(localPrefs);
    setIsOpen(false);
  };

  const updatePreference = (path: string, value: any) => {
    const keys = path.split('.');
    setLocalPrefs(prev => {
      const newPrefs = { ...prev };
      let current: any = newPrefs;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newPrefs;
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-dark-text-muted hover:text-dark-text transition-colors"
        title="Settings"
      >
        <Settings className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-card border border-dark-border rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-border">
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-dark-text-muted hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Notifications Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Bell className="w-5 h-5" />
                  <h3>Notifications</h3>
                </div>
                <div className="space-y-3 pl-7">
                  <label className="flex items-center justify-between">
                    <span className="text-dark-text-muted">Enable Notifications</span>
                    <input
                      type="checkbox"
                      checked={localPrefs.notifications.enabled}
                      onChange={(e) =>
                        updatePreference('notifications.enabled', e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-dark-text-muted">Email Notifications</span>
                    <input
                      type="checkbox"
                      checked={localPrefs.notifications.email}
                      onChange={(e) =>
                        updatePreference('notifications.email', e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-dark-text-muted">Push Notifications</span>
                    <input
                      type="checkbox"
                      checked={localPrefs.notifications.push}
                      onChange={(e) =>
                        updatePreference('notifications.push', e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-dark-text-muted">Frequency</span>
                    <select
                      value={localPrefs.notifications.frequency}
                      onChange={(e) =>
                        updatePreference('notifications.frequency', e.target.value)
                      }
                      className="bg-dark-bg text-white border border-dark-border rounded px-3 py-1.5 text-sm"
                    >
                      <option value="realtime">Real-time</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                    </select>
                  </label>
                </div>
              </div>

              {/* Dashboard Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Eye className="w-5 h-5" />
                  <h3>Dashboard</h3>
                </div>
                <div className="space-y-3 pl-7">
                  <label className="flex items-center justify-between">
                    <span className="text-dark-text-muted">Refresh Interval (seconds)</span>
                    <input
                      type="number"
                      min="10"
                      max="300"
                      value={localPrefs.dashboard.refreshInterval}
                      onChange={(e) =>
                        updatePreference(
                          'dashboard.refreshInterval',
                          parseInt(e.target.value)
                        )
                      }
                      className="w-20 bg-dark-bg text-white border border-dark-border rounded px-3 py-1.5 text-sm"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-dark-text-muted">Default View</span>
                    <select
                      value={localPrefs.dashboard.defaultView}
                      onChange={(e) =>
                        updatePreference('dashboard.defaultView', e.target.value)
                      }
                      className="bg-dark-bg text-white border border-dark-border rounded px-3 py-1.5 text-sm"
                    >
                      <option value="executive">Executive</option>
                      <option value="finance">Finance</option>
                      <option value="workforce">Workforce</option>
                      <option value="operations">Operations</option>
                    </select>
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-dark-text-muted">Show Trends</span>
                    <input
                      type="checkbox"
                      checked={localPrefs.dashboard.showTrends}
                      onChange={(e) =>
                        updatePreference('dashboard.showTrends', e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-dark-text-muted">Compact Mode</span>
                    <input
                      type="checkbox"
                      checked={localPrefs.dashboard.compactMode}
                      onChange={(e) =>
                        updatePreference('dashboard.compactMode', e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                  </label>
                </div>
              </div>

              {/* Data Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Database className="w-5 h-5" />
                  <h3>Data</h3>
                </div>
                <div className="space-y-3 pl-7">
                  <label className="flex items-center justify-between">
                    <span className="text-dark-text-muted">Auto Export</span>
                    <input
                      type="checkbox"
                      checked={localPrefs.data.autoExport}
                      onChange={(e) =>
                        updatePreference('data.autoExport', e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-dark-text-muted">Export Format</span>
                    <select
                      value={localPrefs.data.exportFormat}
                      onChange={(e) =>
                        updatePreference('data.exportFormat', e.target.value)
                      }
                      className="bg-dark-bg text-white border border-dark-border rounded px-3 py-1.5 text-sm"
                    >
                      <option value="csv">CSV</option>
                      <option value="excel">Excel</option>
                      <option value="json">JSON</option>
                    </select>
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-dark-text-muted">Enable Cache</span>
                    <input
                      type="checkbox"
                      checked={localPrefs.data.cacheEnabled}
                      onChange={(e) =>
                        updatePreference('data.cacheEnabled', e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-dark-border flex items-center justify-end gap-3">
              <Button onClick={() => setIsOpen(false)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Hook for managing user preferences
 */
export function useUserPreferences() {
  const defaultPreferences: UserPreferences = {
    theme: 'dark',
    notifications: {
      enabled: true,
      email: true,
      push: false,
      frequency: 'hourly',
    },
    dashboard: {
      refreshInterval: 60,
      defaultView: 'executive',
      showTrends: true,
      compactMode: false,
    },
    data: {
      autoExport: false,
      exportFormat: 'excel',
      cacheEnabled: true,
    },
  };

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : defaultPreferences;
  });

  const savePreferences = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  };

  return { preferences, savePreferences };
}

