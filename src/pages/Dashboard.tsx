import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sidebar } from '@/components/Sidebar';
import { 
  Upload, 
  FileText, 
  AlertTriangle, 
  BarChart3, 
  Clock, 
  CheckCircle,
  ExternalLink,
  Bell
} from 'lucide-react';
import { getUsageStats, getReports, getMonitors } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';
import { UsageStats, Report } from '@/types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user] = useState(getCurrentUser());
  const [stats, setStats] = useState<UsageStats>({ documentsAnalyzed: 0, reportsGenerated: 0, openConflicts: 0 });
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [monitoringEnabled, setMonitoringEnabled] = useState(false);
  const [monitorUrl, setMonitorUrl] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // Load data
    setStats(getUsageStats());
    const reports = getReports();
    setRecentReports(reports.slice(-5).reverse());
    
    const monitors = getMonitors();
    setMonitoringEnabled(monitors.length > 0 && monitors.some(m => m.status === 'active'));
    if (monitors.length > 0) {
      setMonitorUrl(monitors[0].url);
    }
  }, [user, navigate]);

  const handleUploadClick = () => {
    navigate('/upload');
  };

  const handleViewAllReports = () => {
    navigate('/reports');
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/report/${reportId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'needs_review': return 'destructive';
      case 'resolved': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button onClick={handleUploadClick}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Documents
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documents Analyzed</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.documentsAnalyzed}</div>
                <Progress value={(stats.documentsAnalyzed / 100) * 100} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  +{Math.floor(stats.documentsAnalyzed * 0.2)} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.reportsGenerated}</div>
                <Progress value={(stats.reportsGenerated / 50) * 100} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  +{Math.floor(stats.reportsGenerated * 0.15)} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Conflicts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.openConflicts}</div>
                <Progress value={(stats.openConflicts / 20) * 100} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Requires attention
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Upload New Documents</CardTitle>
                <CardDescription>
                  Upload up to 3 documents for conflict analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={handleUploadClick}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drag & drop files here
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    or click to browse files
                  </p>
                  <p className="text-xs text-gray-400">
                    Supports PDF, DOCX, TXT, PPT (Max 3 files)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pathway Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle>External Policy Monitoring</CardTitle>
                <CardDescription>
                  Monitor external documents for changes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Enable Monitoring</label>
                  <Switch 
                    checked={monitoringEnabled}
                    onCheckedChange={setMonitoringEnabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Monitored URL</label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="https://example.com/policy.html"
                      value={monitorUrl}
                      onChange={(e) => setMonitorUrl(e.target.value)}
                    />
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${monitoringEnabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-gray-600">
                    {monitoringEnabled ? 'ACTIVE - Last checked: 5 minutes ago' : 'INACTIVE'}
                  </span>
                </div>
                
                {monitoringEnabled && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800">1 update detected - Analysis triggered</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>Your latest conflict analysis reports</CardDescription>
                </div>
                <Button variant="outline" onClick={handleViewAllReports}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentReports.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No reports generated yet</p>
                  <p className="text-sm text-gray-400 mb-4">Upload documents to get started</p>
                  <Button onClick={handleUploadClick}>
                    Upload Your First Documents
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentReports.map((report) => (
                    <div 
                      key={report.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewReport(report.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">
                            Report #{report.id.slice(-6)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {report.documents.length} documents • {report.totalConflicts} conflicts
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={getStatusColor(report.status)}>
                          {report.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}