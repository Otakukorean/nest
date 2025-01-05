import { ROLES, AGENTS } from '@prisma/client';
export interface UserType {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: ROLES;
  userAgent: AGENTS;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
