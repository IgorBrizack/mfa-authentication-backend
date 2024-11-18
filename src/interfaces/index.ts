import { Request } from "express";
import { UserEntity } from "../entity/user.entity";

export interface IMfaConfig {
  entity_sid: string;
  factor_sid: string;
  mfa_registered: boolean;
}

export interface IMfaApproval {
  mfa_registered: boolean;
  mfa_approved: boolean;
}

export interface IUser extends UserEntity {
  token: string;
  name: string;
  email: string;
  password: string;
  mfa_authentication: IMfaConfig;
  created_at: Date;
  updated_at: Date;
}

export interface IUserJwt {
  token: string;
  name: string;
  email: string;
  mfa_authentication: IMfaApproval;
}

export interface IChallenge {
  approved: boolean;
}

export type RequestEnriched = Request & {
  user?: IUserJwt;
};
