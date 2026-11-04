// what the backend reveals about an invitation before the form is filled
export interface PublicInvitation {
  firstName: string;
  lastName: string;
  role: string | null;
  companyName: string;
}
