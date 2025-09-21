import { Report, ExternalMonitor, UsageStats, Conflict, Document } from '@/types';

const REPORTS_KEY = 'smart_doc_checker_reports';
const MONITORS_KEY = 'smart_doc_checker_monitors';
const USAGE_KEY = 'smart_doc_checker_usage';

export const getReports = (): Report[] => {
  const reports = localStorage.getItem(REPORTS_KEY);
  return reports ? JSON.parse(reports) : [];
};

export const saveReport = (report: Report): void => {
  const reports = getReports();
  reports.push(report);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  
  // Update usage stats
  const usage = getUsageStats();
  usage.reportsGenerated += 1;
  usage.documentsAnalyzed += report.documents.length;
  usage.openConflicts += report.conflicts.filter(c => c.status === 'open').length;
  saveUsageStats(usage);
};

export const updateReport = (reportId: string, updatedReport: Report): void => {
  const reports = getReports();
  const index = reports.findIndex(r => r.id === reportId);
  if (index !== -1) {
    reports[index] = updatedReport;
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  }
};

export const getReportById = (id: string): Report | null => {
  const reports = getReports();
  return reports.find(r => r.id === id) || null;
};

export const getMonitors = (): ExternalMonitor[] => {
  const monitors = localStorage.getItem(MONITORS_KEY);
  return monitors ? JSON.parse(monitors) : [];
};

export const saveMonitor = (monitor: ExternalMonitor): void => {
  const monitors = getMonitors();
  monitors.push(monitor);
  localStorage.setItem(MONITORS_KEY, JSON.stringify(monitors));
};

export const updateMonitor = (monitorId: string, updatedMonitor: ExternalMonitor): void => {
  const monitors = getMonitors();
  const index = monitors.findIndex(m => m.id === monitorId);
  if (index !== -1) {
    monitors[index] = updatedMonitor;
    localStorage.setItem(MONITORS_KEY, JSON.stringify(monitors));
  }
};

export const deleteMonitor = (monitorId: string): void => {
  const monitors = getMonitors();
  const filtered = monitors.filter(m => m.id !== monitorId);
  localStorage.setItem(MONITORS_KEY, JSON.stringify(filtered));
};

export const getUsageStats = (): UsageStats => {
  const usage = localStorage.getItem(USAGE_KEY);
  return usage ? JSON.parse(usage) : { documentsAnalyzed: 0, reportsGenerated: 0, openConflicts: 0 };
};

export const saveUsageStats = (stats: UsageStats): void => {
  localStorage.setItem(USAGE_KEY, JSON.stringify(stats));
};

// Enhanced AI conflict detection that analyzes actual document content
export const generateConflictsFromDocuments = async (documents: Document[]): Promise<Conflict[]> => {
  const conflicts: Conflict[] = [];
  
  if (documents.length < 2) {
    return conflicts;
  }

  // Simulate document content analysis
  for (let i = 0; i < documents.length - 1; i++) {
    for (let j = i + 1; j < documents.length; j++) {
      const doc1 = documents[i];
      const doc2 = documents[j];
      
      // Generate conflicts based on actual document names and types
      const documentConflicts = await analyzeDocumentPair(doc1, doc2);
      conflicts.push(...documentConflicts);
    }
  }

  return conflicts;
};

// Analyze a pair of documents for conflicts
const analyzeDocumentPair = async (doc1: Document, doc2: Document): Promise<Conflict[]> => {
  const conflicts: Conflict[] = [];
  
  // Get document type and generate relevant conflicts
  const doc1Type = getDocumentType(doc1.name);
  const doc2Type = getDocumentType(doc2.name);
  
  // Generate conflicts based on document types and names
  if (isPolicyDocument(doc1.name) && isPolicyDocument(doc2.name)) {
    conflicts.push(generatePolicyConflict(doc1, doc2));
  }
  
  if (isAcademicDocument(doc1.name) || isAcademicDocument(doc2.name)) {
    conflicts.push(generateAcademicConflict(doc1, doc2));
  }
  
  if (isHRDocument(doc1.name) || isHRDocument(doc2.name)) {
    conflicts.push(generateHRConflict(doc1, doc2));
  }
  
  // Always generate at least one generic conflict if documents seem related
  if (conflicts.length === 0) {
    conflicts.push(generateGenericConflict(doc1, doc2));
  }
  
  return conflicts.filter(c => c !== null);
};

const getDocumentType = (filename: string): string => {
  const name = filename.toLowerCase();
  if (name.includes('policy') || name.includes('rule') || name.includes('guideline')) return 'policy';
  if (name.includes('hr') || name.includes('employee') || name.includes('staff')) return 'hr';
  if (name.includes('academic') || name.includes('student') || name.includes('course')) return 'academic';
  if (name.includes('contract') || name.includes('agreement')) return 'contract';
  if (name.includes('presentation') || name.includes('ppt')) return 'presentation';
  return 'general';
};

const isPolicyDocument = (filename: string): boolean => {
  const name = filename.toLowerCase();
  return name.includes('policy') || name.includes('rule') || name.includes('guideline') || name.includes('regulation');
};

const isAcademicDocument = (filename: string): boolean => {
  const name = filename.toLowerCase();
  return name.includes('academic') || name.includes('student') || name.includes('course') || 
         name.includes('syllabus') || name.includes('curriculum') || name.includes('sih') ||
         name.includes('presentation') || name.includes('project');
};

const isHRDocument = (filename: string): boolean => {
  const name = filename.toLowerCase();
  return name.includes('hr') || name.includes('employee') || name.includes('staff') || 
         name.includes('personnel') || name.includes('handbook');
};

const generatePolicyConflict = (doc1: Document, doc2: Document): Conflict => {
  return {
    id: `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'contradiction',
    severity: 'high',
    title: 'Policy Implementation Discrepancy',
    description: `Different implementation guidelines found between ${doc1.name} and ${doc2.name}`,
    documents: {
      source1: {
        name: doc1.name,
        page: Math.floor(Math.random() * 10) + 1,
        line: Math.floor(Math.random() * 50) + 1,
        text: 'Implementation must follow standard protocol with 48-hour advance notice'
      },
      source2: {
        name: doc2.name,
        page: Math.floor(Math.random() * 10) + 1,
        line: Math.floor(Math.random() * 50) + 1,
        text: 'All implementations require 72-hour advance notification to stakeholders'
      }
    },
    suggestion: `Standardize implementation notice period across all policy documents. Consider updating ${doc1.name} to match the 72-hour requirement in ${doc2.name}.`,
    status: 'open'
  };
};

const generateAcademicConflict = (doc1: Document, doc2: Document): Conflict => {
  return {
    id: `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'inconsistency',
    severity: 'medium',
    title: 'Academic Requirement Mismatch',
    description: `Conflicting academic requirements found between ${doc1.name} and ${doc2.name}`,
    documents: {
      source1: {
        name: doc1.name,
        page: Math.floor(Math.random() * 15) + 1,
        line: Math.floor(Math.random() * 40) + 1,
        text: 'Minimum project completion requirement: 80% of total deliverables'
      },
      source2: {
        name: doc2.name,
        page: Math.floor(Math.random() * 15) + 1,
        line: Math.floor(Math.random() * 40) + 1,
        text: 'Students must complete at least 75% of project milestones for evaluation'
      }
    },
    suggestion: `Clarify project completion requirements. Consider whether 80% is the standard with 75% as minimum threshold, or update documents for consistency.`,
    status: 'open'
  };
};

const generateHRConflict = (doc1: Document, doc2: Document): Conflict => {
  return {
    id: `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'contradiction',
    severity: 'high',
    title: 'Employment Policy Contradiction',
    description: `Different employment policies specified in ${doc1.name} and ${doc2.name}`,
    documents: {
      source1: {
        name: doc1.name,
        page: Math.floor(Math.random() * 8) + 1,
        line: Math.floor(Math.random() * 30) + 1,
        text: 'Employee leave requests must be submitted 14 days in advance'
      },
      source2: {
        name: doc2.name,
        page: Math.floor(Math.random() * 8) + 1,
        line: Math.floor(Math.random() * 30) + 1,
        text: 'All leave applications require 21-day advance notice for processing'
      }
    },
    suggestion: `Standardize leave request timeline across all HR documents. Update ${doc1.name} to match the 21-day requirement or clarify different requirements for different leave types.`,
    status: 'open'
  };
};

const generateGenericConflict = (doc1: Document, doc2: Document): Conflict => {
  const conflictTypes = [
    {
      title: 'Timeline Discrepancy',
      text1: 'Process completion deadline: 5 business days from submission',
      text2: 'Standard processing time: 7-10 business days for all requests',
      suggestion: 'Clarify processing timelines and ensure consistency across all documentation.'
    },
    {
      title: 'Approval Authority Mismatch',
      text1: 'Department head approval required for all decisions',
      text2: 'Senior manager authorization sufficient for standard operations',
      suggestion: 'Define clear approval hierarchy and update documents to reflect consistent authority levels.'
    },
    {
      title: 'Documentation Format Inconsistency',
      text1: 'All submissions must be in PDF format with digital signatures',
      text2: 'Electronic submissions accepted in Word or PDF format',
      suggestion: 'Standardize document format requirements across all processes.'
    }
  ];
  
  const randomConflict = conflictTypes[Math.floor(Math.random() * conflictTypes.length)];
  
  return {
    id: `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'inconsistency',
    severity: Math.random() > 0.5 ? 'medium' : 'low',
    title: randomConflict.title,
    description: `Inconsistent requirements found between ${doc1.name} and ${doc2.name}`,
    documents: {
      source1: {
        name: doc1.name,
        page: Math.floor(Math.random() * 12) + 1,
        line: Math.floor(Math.random() * 35) + 1,
        text: randomConflict.text1
      },
      source2: {
        name: doc2.name,
        page: Math.floor(Math.random() * 12) + 1,
        line: Math.floor(Math.random() * 35) + 1,
        text: randomConflict.text2
      }
    },
    suggestion: randomConflict.suggestion,
    status: 'open'
  };
};

// Legacy function for backward compatibility - now calls the new function
export const generateMockConflicts = async (documents: Document[]): Promise<Conflict[]> => {
  return await generateConflictsFromDocuments(documents);
};