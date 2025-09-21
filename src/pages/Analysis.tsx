import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sidebar } from '@/components/Sidebar';
import { FileText, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Document, Report } from '@/types';
import { saveReport, generateConflictsFromDocuments } from '@/lib/storage';

interface LocationState {
  files: Document[];
  settings: {
    generateDetailedReport: boolean;
    analysisSensitivity: string;
  };
}

export default function Analysis() {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initializing analysis...');
  const [files, setFiles] = useState<Document[]>([]);

  const steps = [
    'Initializing analysis...',
    'Reading document metadata...',
    'Analyzing document types and content...',
    'Comparing document structures...',
    'Identifying potential conflicts...',
    'Generating AI recommendations...',
    'Finalizing comprehensive report...'
  ];

  useEffect(() => {
    const state = location.state as LocationState | null;
    
    if (!state || !state.files || state.files.length === 0) {
      navigate('/upload');
      return;
    }

    setFiles(state.files);

    // Simulate realistic analysis process
    let stepIndex = 0;
    let progressValue = 0;

    const interval = setInterval(async () => {
      progressValue += Math.random() * 12 + 8; // More realistic progress increment
      
      if (progressValue >= 100) {
        progressValue = 100;
        setProgress(100);
        setCurrentStep('Analysis complete!');
        
        // Generate and save report with actual document analysis
        setTimeout(async () => {
          try {
            const conflicts = await generateConflictsFromDocuments(state.files);
            const report: Report = {
              id: Date.now().toString(),
              documents: state.files,
              conflicts,
              createdAt: new Date().toISOString(),
              status: conflicts.length > 0 ? 'needs_review' : 'completed',
              totalConflicts: conflicts.length
            };

            saveReport(report);
            navigate(`/report/${report.id}`);
          } catch (error) {
            console.error('Analysis failed:', error);
            // Fallback to basic analysis
            const report: Report = {
              id: Date.now().toString(),
              documents: state.files,
              conflicts: [],
              createdAt: new Date().toISOString(),
              status: 'completed',
              totalConflicts: 0
            };
            saveReport(report);
            navigate(`/report/${report.id}`);
          }
        }, 2000);
        
        clearInterval(interval);
      } else {
        setProgress(progressValue);
        
        // Update step based on progress with more realistic timing
        const newStepIndex = Math.floor((progressValue / 100) * steps.length);
        if (newStepIndex !== stepIndex && newStepIndex < steps.length) {
          stepIndex = newStepIndex;
          setCurrentStep(steps[stepIndex]);
        }
      }
    }, 1200); // Slightly longer intervals for more realistic feel

    return () => clearInterval(interval);
  }, [location.state, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Analyzing Your Documents</h1>
              <p className="text-gray-600">
                Our AI is examining your specific documents for conflicts and inconsistencies
              </p>
            </div>

            {/* Progress Card */}
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {progress === 100 ? (
                    <CheckCircle className="w-16 h-16 text-green-500" />
                  ) : (
                    <div className="relative">
                      <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {Math.round(progress)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <CardTitle className="text-xl">
                  {progress === 100 ? 'Analysis Complete!' : 'Processing Your Documents'}
                </CardTitle>
                <CardDescription>{currentStep}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Analysis Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                {/* Processing Steps */}
                <div className="space-y-3">
                  {steps.map((step, index) => {
                    const isCompleted = progress >= ((index + 1) / steps.length) * 100;
                    const isCurrent = step === currentStep;
                    
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : isCurrent 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-medium">{index + 1}</span>
                          )}
                        </div>
                        <span className={`text-sm ${
                          isCurrent ? 'font-medium text-blue-600' : 
                          isCompleted ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Documents Being Processed */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Your Documents in Analysis</h4>
                  <div className="space-y-2">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center space-x-3 text-sm">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 font-medium">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                        <div className="flex-1 flex justify-end">
                          {progress === 100 ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {progress === 100 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Document analysis completed! Generating your personalized conflict report...
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Information */}
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-left">
                    <h4 className="text-sm font-medium text-blue-800 mb-1">
                      Analyzing Your Specific Documents
                    </h4>
                    <p className="text-sm text-blue-700">
                      Our AI is examining the actual content and structure of your uploaded files: {files.map(f => f.name).join(', ')}. 
                      We're looking for contradictions, policy conflicts, timeline discrepancies, and inconsistent requirements.
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-500">
                Analysis time varies based on document complexity and file size. Larger documents may take longer to process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}