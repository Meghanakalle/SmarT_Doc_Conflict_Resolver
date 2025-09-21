import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sidebar } from '@/components/Sidebar';
import { 
  Upload as UploadIcon, 
  FileText, 
  X, 
  AlertCircle,
  File,
  FileImage,
  FileSpreadsheet
} from 'lucide-react';
import { Document } from '@/types';

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<Document[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [generateDetailedReport, setGenerateDetailedReport] = useState(true);
  const [analysisSensitivity, setAnalysisSensitivity] = useState('medium');
  const [error, setError] = useState('');

  const supportedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (type.includes('word') || type.includes('document')) return <FileText className="w-5 h-5 text-blue-500" />;
    if (type.includes('presentation') || type.includes('powerpoint')) return <FileImage className="w-5 h-5 text-orange-500" />;
    if (type.includes('text')) return <File className="w-5 h-5 text-gray-500" />;
    return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    setError('');
    
    if (files.length + newFiles.length > 3) {
      setError('Maximum 3 files allowed. Please remove some files first.');
      return;
    }

    const validFiles: Document[] = [];
    const invalidFiles: string[] = [];

    newFiles.forEach((file) => {
      if (supportedTypes.includes(file.type)) {
        const document: Document = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString()
        };
        validFiles.push(document);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      setError(`Unsupported file types: ${invalidFiles.join(', ')}. Please upload PDF, DOCX, TXT, or PPT files.`);
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setError('');
  };

  const handleAnalyze = () => {
    if (files.length === 0) {
      setError('Please upload at least one document to analyze.');
      return;
    }

    // Navigate to analysis page with files data
    navigate('/analysis', { 
      state: { 
        files, 
        settings: { 
          generateDetailedReport, 
          analysisSensitivity 
        } 
      } 
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upload Documents</h1>
            <p className="text-gray-600">Upload your documents for intelligent conflict analysis</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle>Select Documents</CardTitle>
              <CardDescription>
                Upload up to 3 documents (PDF, DOCX, TXT, PPT) for analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drag & drop files here
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse files
                </p>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>Supported formats: PDF, DOCX, TXT, PPT</p>
                  <p>Maximum 3 files • Up to 10MB each</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc,.txt,.ppt,.pptx"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Files */}
          {files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Files ({files.length}/3)</CardTitle>
                <CardDescription>
                  Review your uploaded documents before analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)} • Uploaded {new Date(file.uploadedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Settings</CardTitle>
              <CardDescription>
                Configure how the analysis should be performed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="detailed-report"
                  checked={generateDetailedReport}
                  onCheckedChange={(checked) => setGenerateDetailedReport(checked as boolean)}
                />
                <label htmlFor="detailed-report" className="text-sm font-medium">
                  Generate detailed report with recommendations
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Analysis Sensitivity</label>
                <Select value={analysisSensitivity} onValueChange={setAnalysisSensitivity}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Major conflicts only</SelectItem>
                    <SelectItem value="medium">Medium - Balanced detection</SelectItem>
                    <SelectItem value="high">High - All potential conflicts</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Higher sensitivity may detect more conflicts but could include false positives
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
            <Button 
              onClick={handleAnalyze}
              disabled={files.length === 0}
              className="min-w-[150px]"
            >
              <FileText className="w-4 h-4 mr-2" />
              Analyze Documents
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}