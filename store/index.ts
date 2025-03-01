import { makeAutoObservable } from 'mobx';

import { User, UserType } from '~/types/user';

class Store {
  currentUser: User | null = null;
  selectedUserRole: string | null = null;
  userType: UserType = 'user';
  isLoading: boolean = false;
  error: string | null = null;
  currentLocation: {
    lat: number;
    long: number;
  } | null = {
    lat: 38.736946,
    long: -9.142685,
  };
  currentShop: {
    name: string;
    lat: number;
    long: number;
  } | null = {
    name: 'Shop Name',
    lat: 38.7223,
    long: -9.1393,
  };

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

  setCurrentShop(shop: { name: string; lat: number; long: number }) {
    this.currentShop = shop;
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
