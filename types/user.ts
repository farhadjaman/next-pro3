export interface UserRole {
  id: string;
  title: string;
  role: string;
}

export type UserType = 'user' | 'super';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  onActiveDuty: boolean;
  backgroundLocationTracking: boolean;
  userRole: string[];
  jobsCompleted: number;
  jobsCompletedWTD: number;
  totalSetOfRepairs: number;
  totalSetOfRepairsWTD: number;
  successRate: string;
  responseRate: string;
};
