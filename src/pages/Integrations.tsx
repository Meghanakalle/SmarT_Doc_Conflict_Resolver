import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sidebar } from '@/components/Sidebar';
import { 
  Link, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Globe,
  Zap
} from 'lucide-react';
import { getMonitors, saveMonitor, updateMonitor, deleteMonitor } from '@/lib/storage';
import { ExternalMonitor } from '@/types';

export default function Integrations() {
  const [monitors, setMonitors] = useState<ExternalMonitor[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMonitor, setNewMonitor] = useState({
    url: '',
    frequency: 'daily' as const
  });
  const [globalMonitoring, setGlobalMonitoring] = useState(true);

  useEffect(() => {
    setMonitors(getMonitors());
  }, []);

  const handleAddMonitor = () => {
    if (!newMonitor.url) return;

    const monitor: ExternalMonitor = {
      id: Date.now().toString(),
      url: newMonitor.url,
      frequency: newMonitor.frequency,
      status: 'active',
      lastChecked: new Date().toISOString()
    };

    saveMonitor(monitor);
    setMonitors(prev => [...prev, monitor]);
    setNewMonitor({ url: '', frequency: 'daily' });
    setShowAddForm(false);
  };

  const handleToggleStatus = (monitorId: string) => {
    const monitor = monitors.find(m => m.id === monitorId);
    if (!monitor) return;

    const updatedMonitor = {
      ...monitor,
      status: monitor.status === 'active' ? 'inactive' as const : 'active' as const
    };

    updateMonitor(monitorId, updatedMonitor);
    setMonitors(prev => prev.map(m => m.id === monitorId ? updatedMonitor : m));
  };

  const handleDeleteMonitor = (monitorId: string) => {
    deleteMonitor(monitorId);
    setMonitors(prev => prev.filter(m => m.id !== monitorId));
  };

  const handleForceCheck = (monitorId: string) => {
    const monitor = monitors.find(m => m.id === monitorId);
    if (!monitor) return;

    const updatedMonitor = {
      ...monitor,
      lastChecked: new Date().toISOString(),
      lastUpdate: Math.random() > 0.7 ? new Date().toISOString() : monitor.lastUpdate
    };

    updateMonitor(monitorId, updatedMonitor);
    setMonitors(prev => prev.map(m => m.id === monitorId ? updatedMonitor : m));
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'default' : 'secondary';
  };

  const getStatusIcon = (status: string) => {
    return status === 'active' ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <AlertCircle className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
              <p className="text-gray-600">Monitor external policies and documents for changes</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Monitor
              </Button>
            </div>
          </div>

          {/* Global Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Global Monitoring Settings</span>
              </CardTitle>
              <CardDescription>
                Configure global settings for external document monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Enable Global Monitoring</h4>
                  <p className="text-sm text-gray-600">
                    Turn on/off all external monitoring activities
                  </p>
                </div>
                <Switch 
                  checked={globalMonitoring}
                  onCheckedChange={setGlobalMonitoring}
                />
              </div>
              
              {globalMonitoring && (
                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    Monitoring is active. Changes detected in external documents will automatically trigger conflict analysis.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Add Monitor Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Monitor</CardTitle>
                <CardDescription>
                  Monitor an external document or policy page for changes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL to Monitor</label>
                  <Input
                    placeholder="https://example.com/policy.html"
                    value={newMonitor.url}
                    onChange={(e) => setNewMonitor({ ...newMonitor, url: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">
                    Enter the full URL of the document or page you want to monitor
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Check Frequency</label>
                  <Select 
                    value={newMonitor.frequency} 
                    onValueChange={(value: 'daily' | 'weekly' | 'custom') => 
                      setNewMonitor({ ...newMonitor, frequency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={handleAddMonitor}>
                    Add Monitor
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Monitors List */}
          <Card>
            <CardHeader>
              <CardTitle>Active Monitors ({monitors.length})</CardTitle>
              <CardDescription>
                Manage your external document monitoring configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {monitors.length === 0 ? (
                <div className="text-center py-12">
                  <Link className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Monitors Configured
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add your first external document monitor to get started with automated change detection
                  </p>
                  <Button onClick={() => setShowAddForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Monitor
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {monitors.map((monitor) => (
                    <div key={monitor.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(monitor.status)}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-900 truncate">
                                  {monitor.url}
                                </h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(monitor.url, '_blank')}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Check frequency: {monitor.frequency}</span>
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Last checked: {new Date(monitor.lastChecked).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {monitor.lastUpdate && (
                            <Alert className="bg-orange-50 border-orange-200">
                              <AlertCircle className="h-4 w-4 text-orange-600" />
                              <AlertDescription className="text-orange-800">
                                Update detected on {new Date(monitor.lastUpdate).toLocaleString()}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge variant={getStatusColor(monitor.status)}>
                            {monitor.status.toUpperCase()}
                          </Badge>
                          
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleForceCheck(monitor.id)}
                              disabled={!globalMonitoring}
                            >
                              <Zap className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(monitor.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMonitor(monitor.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Integration Info */}
          <Card>
            <CardHeader>
              <CardTitle>How External Monitoring Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Automated Detection</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Monitors external documents for content changes</li>
                    <li>• Detects policy updates, new versions, and modifications</li>
                    <li>• Runs checks based on your configured frequency</li>
                    <li>• Sends notifications when changes are detected</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Automatic Analysis</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Triggers conflict analysis when updates are found</li>
                    <li>• Compares new content with your existing documents</li>
                    <li>• Identifies new conflicts and inconsistencies</li>
                    <li>• Generates updated reports automatically</li>
                  </ul>
                </div>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Note:</strong> External monitoring requires the target documents to be publicly accessible. 
                  Private or password-protected documents cannot be monitored.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}