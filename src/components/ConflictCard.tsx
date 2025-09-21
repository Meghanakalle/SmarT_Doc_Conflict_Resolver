import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Conflict } from '@/types';
import { AlertTriangle, CheckCircle, XCircle, FileText } from 'lucide-react';
import { useState } from 'react';

interface ConflictCardProps {
  conflict: Conflict;
  onStatusChange: (conflictId: string, status: Conflict['status'], notes?: string) => void;
}

export function ConflictCard({ conflict, onStatusChange }: ConflictCardProps) {
  const [notes, setNotes] = useState(conflict.notes || '');
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityColor = (severity: Conflict['severity']) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
    }
  };

  const getTypeIcon = (type: Conflict['type']) => {
    switch (type) {
      case 'contradiction': return <AlertTriangle className="w-4 h-4" />;
      case 'overlap': return <FileText className="w-4 h-4" />;
      case 'inconsistency': return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Conflict['status']) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'resolved': return 'default';
      case 'ignored': return 'secondary';
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getTypeIcon(conflict.type)}
            <CardTitle className="text-lg">{conflict.title}</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Badge variant={getSeverityColor(conflict.severity)}>
              {conflict.severity.toUpperCase()}
            </Badge>
            <Badge variant={getStatusColor(conflict.status)}>
              {conflict.status.toUpperCase()}
            </Badge>
          </div>
        </div>
        <CardDescription>{conflict.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </Button>
        
        {isExpanded && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                <h4 className="font-semibold text-sm text-red-800 mb-2">Source 1</h4>
                <p className="text-sm text-gray-600 mb-1">
                  {conflict.documents.source1.name}
                  {conflict.documents.source1.page && ` (Page ${conflict.documents.source1.page})`}
                  {conflict.documents.source1.line && `, Line ${conflict.documents.source1.line}`}
                </p>
                <p className="text-sm italic">"{conflict.documents.source1.text}"</p>
              </div>
              
              <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <h4 className="font-semibold text-sm text-orange-800 mb-2">Source 2</h4>
                <p className="text-sm text-gray-600 mb-1">
                  {conflict.documents.source2.name}
                  {conflict.documents.source2.page && ` (Page ${conflict.documents.source2.page})`}
                  {conflict.documents.source2.line && `, Line ${conflict.documents.source2.line}`}
                </p>
                <p className="text-sm italic">"{conflict.documents.source2.text}"</p>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-sm text-blue-800 mb-2">AI Recommendation</h4>
              <p className="text-sm">{conflict.suggestion}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes about this conflict..."
                className="min-h-[80px]"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="default"
                onClick={() => onStatusChange(conflict.id, 'resolved', notes)}
                className="flex items-center space-x-1"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark Resolved</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange(conflict.id, 'ignored', notes)}
              >
                Ignore
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onStatusChange(conflict.id, 'open', notes)}
              >
                Reopen
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}