import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sidebar } from '@/components/Sidebar';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Target,
  Activity
} from 'lucide-react';
import { getReports, getUsageStats } from '@/lib/storage';
import { Report, UsageStats } from '@/types';

export default function Analytics() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<UsageStats>({ documentsAnalyzed: 0, reportsGenerated: 0, openConflicts: 0 });

  useEffect(() => {
    const allReports = getReports();
    setReports(allReports);
    setStats(getUsageStats());
  }, []);

  const getConflictTrends = () => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const recentReports = reports.filter(r => new Date(r.createdAt) >= last30Days);
    const totalConflicts = recentReports.reduce((sum, r) => sum + r.totalConflicts, 0);
    const avgConflictsPerReport = recentReports.length > 0 ? totalConflicts / recentReports.length : 0;
    
    return {
      totalReports: recentReports.length,
      totalConflicts,
      avgConflictsPerReport: Math.round(avgConflictsPerReport * 10) / 10
    };
  };

  const getSeverityBreakdown = () => {
    const allConflicts = reports.flatMap(r => r.conflicts);
    return {
      high: allConflicts.filter(c => c.severity === 'high').length,
      medium: allConflicts.filter(c => c.severity === 'medium').length,
      low: allConflicts.filter(c => c.severity === 'low').length,
      total: allConflicts.length
    };
  };

  const getResolutionStats = () => {
    const allConflicts = reports.flatMap(r => r.conflicts);
    return {
      resolved: allConflicts.filter(c => c.status === 'resolved').length,
      open: allConflicts.filter(c => c.status === 'open').length,
      ignored: allConflicts.filter(c => c.status === 'ignored').length,
      total: allConflicts.length
    };
  };

  const getDocumentTypeStats = () => {
    const allDocs = reports.flatMap(r => r.documents);
    const typeCount: Record<string, number> = {};
    
    allDocs.forEach(doc => {
      const extension = doc.name.split('.').pop()?.toLowerCase() || 'unknown';
      typeCount[extension] = (typeCount[extension] || 0) + 1;
    });
    
    return Object.entries(typeCount)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  };

  const trends = getConflictTrends();
  const severity = getSeverityBreakdown();
  const resolution = getResolutionStats();
  const docTypes = getDocumentTypeStats();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Insights and trends from your document analysis</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.documentsAnalyzed}</div>
                <p className="text-xs text-muted-foreground">
                  Processed to date
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.reportsGenerated}</div>
                <p className="text-xs text-muted-foreground">
                  Analysis reports created
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conflicts Found</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{severity.total}</div>
                <p className="text-xs text-muted-foreground">
                  Total conflicts detected
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {resolution.total > 0 ? Math.round((resolution.resolved / resolution.total) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Conflicts resolved
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conflict Severity Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Conflict Severity Distribution</CardTitle>
                <CardDescription>Breakdown of conflicts by severity level</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium">High Severity</span>
                    </div>
                    <span className="text-sm text-gray-600">{severity.high}</span>
                  </div>
                  <Progress 
                    value={severity.total > 0 ? (severity.high / severity.total) * 100 : 0} 
                    className="h-2"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium">Medium Severity</span>
                    </div>
                    <span className="text-sm text-gray-600">{severity.medium}</span>
                  </div>
                  <Progress 
                    value={severity.total > 0 ? (severity.medium / severity.total) * 100 : 0} 
                    className="h-2"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium">Low Severity</span>
                    </div>
                    <span className="text-sm text-gray-600">{severity.low}</span>
                  </div>
                  <Progress 
                    value={severity.total > 0 ? (severity.low / severity.total) * 100 : 0} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Resolution Status */}
            <Card>
              <CardHeader>
                <CardTitle>Conflict Resolution Status</CardTitle>
                <CardDescription>Current status of all detected conflicts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Resolved</span>
                    </div>
                    <span className="text-sm text-gray-600">{resolution.resolved}</span>
                  </div>
                  <Progress 
                    value={resolution.total > 0 ? (resolution.resolved / resolution.total) * 100 : 0} 
                    className="h-2"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium">Open</span>
                    </div>
                    <span className="text-sm text-gray-600">{resolution.open}</span>
                  </div>
                  <Progress 
                    value={resolution.total > 0 ? (resolution.open / resolution.total) * 100 : 0} 
                    className="h-2"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">Ignored</span>
                    </div>
                    <span className="text-sm text-gray-600">{resolution.ignored}</span>
                  </div>
                  <Progress 
                    value={resolution.total > 0 ? (resolution.ignored / resolution.total) * 100 : 0} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>30-Day Trends</span>
                </CardTitle>
                <CardDescription>Analysis activity over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{trends.totalReports}</div>
                    <p className="text-xs text-gray-600">Reports Generated</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{trends.totalConflicts}</div>
                    <p className="text-xs text-gray-600">Conflicts Found</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{trends.avgConflictsPerReport}</div>
                    <p className="text-xs text-gray-600">Avg per Report</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Activity className="w-4 h-4" />
                    <span>Analysis frequency is trending upward</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Types */}
            <Card>
              <CardHeader>
                <CardTitle>Document Types Analyzed</CardTitle>
                <CardDescription>Breakdown by file format</CardDescription>
              </CardHeader>
              <CardContent>
                {docTypes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No documents analyzed yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {docTypes.slice(0, 5).map((item, index) => (
                      <div key={item.type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-green-500' :
                            index === 2 ? 'bg-orange-500' :
                            index === 3 ? 'bg-purple-500' : 'bg-gray-500'
                          }`}></div>
                          <span className="text-sm font-medium uppercase">{item.type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{item.count}</span>
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                index === 0 ? 'bg-blue-500' :
                                index === 1 ? 'bg-green-500' :
                                index === 2 ? 'bg-orange-500' :
                                index === 3 ? 'bg-purple-500' : 'bg-gray-500'
                              }`}
                              style={{ 
                                width: `${(item.count / Math.max(...docTypes.map(d => d.count))) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Usage Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Summary</CardTitle>
              <CardDescription>Your Smart Doc Checker usage overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{stats.documentsAnalyzed}</div>
                  <p className="text-sm text-blue-700">Documents Processed</p>
                  <p className="text-xs text-blue-600 mt-1">Billing metric</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{stats.reportsGenerated}</div>
                  <p className="text-sm text-green-700">Reports Generated</p>
                  <p className="text-xs text-green-600 mt-1">Billing metric</p>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">{stats.openConflicts}</div>
                  <p className="text-sm text-orange-700">Open Conflicts</p>
                  <p className="text-xs text-orange-600 mt-1">Needs attention</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}