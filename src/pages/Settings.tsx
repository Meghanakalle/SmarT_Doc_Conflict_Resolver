import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sidebar } from '@/components/Sidebar';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Download,
  Trash2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';

export default function Settings() {
  const user = getCurrentUser();
  const [notifications, setNotifications] = useState({
    email: true,
    conflicts: true,
    reports: false,
    monitoring: true
  });
  const [analysis, setAnalysis] = useState({
    defaultSensitivity: 'medium',
    autoGenerate: true,
    includeRecommendations: true
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveSettings = () => {
    // In a real app, save to backend
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleExportData = () => {
    const data = {
      user,
      settings: { notifications, analysis },
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smart-doc-checker-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, handle account deletion
      alert('Account deletion would be processed here.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account and application preferences</p>
          </div>

          {showSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Settings saved successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Manage your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input value={user?.name || ''} readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input value={user?.email || ''} readOnly />
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Contact support to update your profile information.
              </p>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about important events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Conflict Alerts</h4>
                    <p className="text-sm text-gray-600">Get notified when conflicts are detected</p>
                  </div>
                  <Switch 
                    checked={notifications.conflicts}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, conflicts: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Report Completion</h4>
                    <p className="text-sm text-gray-600">Notify when analysis reports are ready</p>
                  </div>
                  <Switch 
                    checked={notifications.reports}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, reports: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">External Monitoring</h4>
                    <p className="text-sm text-gray-600">Alerts for external document changes</p>
                  </div>
                  <Switch 
                    checked={notifications.monitoring}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, monitoring: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="w-5 h-5" />
                <span>Analysis Preferences</span>
              </CardTitle>
              <CardDescription>
                Configure default settings for document analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Analysis Sensitivity</label>
                  <Select 
                    value={analysis.defaultSensitivity} 
                    onValueChange={(value) => 
                      setAnalysis({ ...analysis, defaultSensitivity: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Major conflicts only</SelectItem>
                      <SelectItem value="medium">Medium - Balanced detection</SelectItem>
                      <SelectItem value="high">High - All potential conflicts</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    This will be the default sensitivity for new analyses
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-generate Detailed Reports</h4>
                    <p className="text-sm text-gray-600">Automatically create comprehensive reports</p>
                  </div>
                  <Switch 
                    checked={analysis.autoGenerate}
                    onCheckedChange={(checked) => 
                      setAnalysis({ ...analysis, autoGenerate: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Include AI Recommendations</h4>
                    <p className="text-sm text-gray-600">Add suggested solutions to conflict reports</p>
                  </div>
                  <Switch 
                    checked={analysis.includeRecommendations}
                    onCheckedChange={(checked) => 
                      setAnalysis({ ...analysis, includeRecommendations: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data & Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Data & Privacy</span>
              </CardTitle>
              <CardDescription>
                Manage your data and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Export My Data</h4>
                    <p className="text-sm text-gray-600">Download all your data in JSON format</p>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
                
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Your documents are processed locally and not stored on our servers. 
                    Only analysis results and metadata are saved to your account.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span>Danger Zone</span>
              </CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <h4 className="font-medium text-red-800">Delete Account</h4>
                  <p className="text-sm text-red-600">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} className="min-w-[120px]">
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}