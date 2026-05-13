export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  isAdmin: boolean;
  isActive: boolean;
  partyId: string | null;
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
  isAdmin: boolean;
}
