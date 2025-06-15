export type Role = 'admin' | 'customer' | 'lender' | 'agent';

export interface TokenPayload {
  id: string;
  email: string;
  role: Role;
  [key: string]: any;
}
