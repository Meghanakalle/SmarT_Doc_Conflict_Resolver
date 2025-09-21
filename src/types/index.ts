export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  content?: string;
}

export interface Conflict {
  id: string;
  type: 'contradiction' | 'overlap' | 'inconsistency';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  documents: {
    source1: {
      name: string;
      page?: number;
      line?: number;
      text: string;
    };
    source2: {
      name: string;
      page?: number;
      line?: number;
      text: string;
    };
  };
  suggestion: string;
  status: 'open' | 'resolved' | 'ignored';
  notes?: string;
}

export interface Report {
  id: string;
  documents: Document[];
  conflicts: Conflict[];
  createdAt: string;
  status: 'completed' | 'needs_review' | 'resolved';
  totalConflicts: number;
}

export interface ExternalMonitor {
  id: string;
  url: string;
  frequency: 'daily' | 'weekly' | 'custom';
  status: 'active' | 'inactive';
  lastChecked: string;
  lastUpdate?: string;
}

export interface UsageStats {
  documentsAnalyzed: number;
  reportsGenerated: number;
  openConflicts: number;
}