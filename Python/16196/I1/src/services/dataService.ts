// src/services/dataService.ts
import { User } from '../models/user';

export function createUser(userData: Partial<User>): User { // Partial makes all properties in User optional
  const defaultUser: User = {
    id: Math.floor(Math.random() * 10000),
    name: 'Unknown',
    email: 'unknown@example.com',
    role: 'user'
  };
  return { ...defaultUser, ...userData };
}

// Using type guards
export function isAdmin(user: User): user is User & { role: 'admin' } {
  return user.role === 'admin';
}
