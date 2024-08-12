// src/models/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user'; // Using union types for roles
}

// You can also use enums for more complex scenarios
export enum UserRole {
  Admin = 'admin',
  User = 'user'
}
