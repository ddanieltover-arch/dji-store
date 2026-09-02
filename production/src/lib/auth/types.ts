export type UserRole = 'customer' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
}

export interface SessionRecord {
  id: string;
  userId: string;
  expiresAt: Date;
}
