export class CreateVerificationCenterDto {
  centerType!: string;
  code!: string;
  name!: string;
  stateCode?: string;
  city?: string;
  addressLine?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}
