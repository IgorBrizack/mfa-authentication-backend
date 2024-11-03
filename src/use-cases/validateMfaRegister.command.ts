import { FactorInstance } from "twilio/lib/rest/verify/v2/service/entity/factor";
import { HttpExceptionError } from "../errors";
import { IUser } from "../interfaces";
import { UserRepository } from "../repository/user.repository";
import { MfaAuthenticationService } from "../services/mfaAuthentication.service";
import * as jwt from "jsonwebtoken";

interface RegisterMfaParams {
  token: string;
  totpCode: string;
}

enum FactorStatus {
  VERIFIED = "verified",
  UNVERIFIED = "unverified",
}

export class RegisterMfaCommand {
  constructor(
    private userRepository: UserRepository,
    private mfaAuth: MfaAuthenticationService
  ) {}

  public async execute(params: RegisterMfaParams): Promise<string> {
    try {
      const user = await this.getUser(params.token);

      const factorUpdated = await this.mfaAuth.updateFactor(
        user.getUserEntitySid(),
        user.getUserFactorSid(),
        params.totpCode
      );

      this.guardAgainstUnverifiedFactor(factorUpdated);

      await this.saveUserMfaRegistered(user);

      return this.generateJwt(user);
    } catch (error) {
      throw error;
    }
  }

  private async getUser(userToken: string): Promise<IUser> {
    const user = await this.userRepository.findByToken(userToken);

    if (!user) throw new HttpExceptionError("User not found", 404);

    return user;
  }

  private guardAgainstUnverifiedFactor(factor: FactorInstance): void {
    if (factor.status !== FactorStatus.VERIFIED) {
      throw new HttpExceptionError("Invalid TOTP code", 401);
    }
  }

  private async saveUserMfaRegistered(user: IUser): Promise<void> {
    user.setMfaRegistered();
    await this.userRepository.saveEntity(user);
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
