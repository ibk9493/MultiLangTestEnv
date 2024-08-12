// src/services/dataService.ts
import { User } from '../models/user';
import logger from '../utils/logger';

export function createUser(userData: Partial<User>): User { // Partial makes all properties in User optional
  logger.debug(`Creating user with data: ${JSON.stringify(userData)}`);
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
  logger.debug(`Checking if user ${user.id} is admin`);
  return user.role === 'admin';
}
