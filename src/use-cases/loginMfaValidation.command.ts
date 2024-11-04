import { StatusCode } from "../enums";
import { HttpExceptionError } from "../errors";
import { IUser } from "../interfaces";
import { UserRepository } from "../repository/user.repository";
import { MfaAuthenticationService } from "../services/mfaAuthentication.service";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export type LoginMfaValidationParams = {
  userToken: string;
  totpCode: string;
};

export class LoginMfaValidationCommand {
  constructor(
    private userRepository: UserRepository,
    private mfaAuth: MfaAuthenticationService
  ) {}

  public async execute(params: LoginMfaValidationParams): Promise<string> {
    try {
      const user = await this.getUser(params.userToken);

      const challenge = await this.mfaAuth.factorValidationChallenge(
        user.getUserEntitySid(),
        user.getUserFactorSid(),
        params.totpCode
      );

      if (!challenge.approved) {
        throw new HttpExceptionError("Challenge failed", StatusCode.FORBIDDEN);
      }

      const token = this.generateJwt(user);

      return token;
    } catch (error) {
      throw error;
    }
  }

  private async getUser(userToken: string): Promise<IUser> {
    const user = await this.userRepository.findByToken(userToken);

    if (!user) throw new HttpExceptionError("User not found", 404);

    return user;
  }

  private generateJwt(user: IUser): string {
    const data = user.getUserApprovedMfaJwt();

    const options = {
      expiresIn: "24h",
    };

    const token = jwt.sign(data, process.env.JWT_SECRET as string, options);

    return token;
  }
}
