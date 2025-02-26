import { makeAutoObservable } from 'mobx';

import { User, UserType } from '~/types/user';

class Store {
  currentUser: User | null = null;
  selectedUserRole: string | null = null;
  userType: UserType = 'user';
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

  // Set the selected user role
  setSelectedUserRole(role: string) {
    this.selectedUserRole = role;
  }
  // Get the selected user role
  getSelectedUserRole() {
    return this.selectedUserRole;
  }

  clearSelectedUserRole() {
    this.selectedUserRole = null;
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

  setUserType(userType: UserType) {
    this.userType = userType;
  }

  clearUserType() {
    this.userType = 'user';
  }

  setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }
  setError(error: string | null) {
    this.error = error;
  }
}
export const store = new Store();
