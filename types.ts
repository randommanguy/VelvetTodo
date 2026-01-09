export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  date?: string; // ISO Date YYYY-MM-DD
  time?: string; // HH:MM 24hr
  priority: Priority;
  isCompleted: boolean;
  createdAt: number;
}

// AI Response Schema Types
export interface AITask {
  title: string;
  description: string;
  priority: string; // Will need mapping to Enum
  date: string | null;
  time: string | null;
}
