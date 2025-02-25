import { makeAutoObservable } from 'mobx';

class Store {
  currentUser: User | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // Computed value to check if a user is authenticated
  get isAuthenticated() {
    return !!this.currentUser;
  }

  // Set the current user with the provided user data
  setUser(userData: User) {
    this.currentUser = userData;
  }

  // Clear the user data (logout)
  clearUser() {
    this.currentUser = null;
  }

  updateUser(updates: Partial<User>) {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updates };
    }
  }
}

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  onActiveDuty: boolean;
  backgroundLocationTracking: boolean;
  userType: 'user' | 'super';
  userRole: string[];
  jobsCompleted: number;
  jobsCompletedWTD: number;
  totalSetOfRepairs: number;
  totalSetOfRepairsWTD: number;
  successRate: string;
  responseRate: string;
};
export const store = new Store();
