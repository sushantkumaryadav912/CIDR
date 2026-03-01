'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bell, Shield, User, Key } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6" data-testid="settings-page">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Settings</h1>
        <p className="text-slate-400">Manage your security dashboard preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <Input placeholder="Admin User" defaultValue="Admin User" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <Input type="email" placeholder="admin@company.com" defaultValue="admin@company.com" />
            </div>
            <Button data-testid="save-profile-button">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure alert notifications</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">Email Notifications</p>
                <p className="text-xs text-slate-500">Receive alerts via email</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">Slack Notifications</p>
                <p className="text-xs text-slate-500">Send alerts to Slack</p>
              </div>
              <input type="checkbox" className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">Critical Alerts Only</p>
                <p className="text-xs text-slate-500">Only notify for critical severity</p>
              </div>
              <input type="checkbox" className="h-4 w-4" />
            </div>
            <Button data-testid="save-notifications-button">Save Preferences</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage security preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">Two-Factor Authentication</p>
                <p className="text-xs text-slate-500">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">Session Timeout</p>
                <p className="text-xs text-slate-500">Auto logout after inactivity</p>
              </div>
              <select className="h-8 rounded-md border border-slate-700 bg-slate-900 px-2 text-sm text-slate-100">
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>Never</option>
              </select>
            </div>
            <Button data-testid="save-security-button">Save Settings</Button>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Key className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage API access keys</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">API Key</label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value="sk-••••••••••••••••••••••••"
                  disabled
                  className="flex-1"
                />
                <Button variant="outline">Reveal</Button>
              </div>
            </div>
            <div className="pt-2">
              <Button variant="outline" className="w-full" data-testid="generate-api-key-button">
                Generate New Key
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
