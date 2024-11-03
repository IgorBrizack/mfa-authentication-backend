export interface IMfaConfig {
  entity_sid: string | null;
  factor_sid: string | null;
  mfa_registered: boolean;
  mfa_enabled: boolean;
}

export interface IUser {
  token: string;
  name: string;
  email: string;
  password: string;
  mfa_authentication: IMfaConfig;
  created_at: Date;
  updated_at: Date;
}

export interface IUserRegularJwt {
  token: string;
  name: string;
  email: string;
  mfa_authentication: IMfaConfig;
}
