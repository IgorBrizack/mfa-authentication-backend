import { FactorInstance } from "twilio/lib/rest/verify/v2/service/entity/factor";
import { HttpExceptionError } from "../errors";
import { IUser } from "../interfaces";
import { UserRepository } from "../repository/user.repository";
import { MfaAuthenticationService } from "../services/mfaAuthentication.service";
import * as jwt from "jsonwebtoken";
import { StatusCode } from "../enums";
import dotenv from "dotenv";

dotenv.config();

interface ValidateMfaRegisterParams {
  userToken: string;
  totpCode: string;
}

enum FactorStatus {
  VERIFIED = "verified",
  UNVERIFIED = "unverified",
}

export class ValidateMfaRegisterCommand {
  constructor(
    private userRepository: UserRepository,
    private mfaAuthService: MfaAuthenticationService
  ) {}

  public async execute(params: ValidateMfaRegisterParams): Promise<string> {
    try {
      const user = await this.getUser(params.userToken);

      const factorUpdated = await this.mfaAuthService.updateFactor(
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
      throw new HttpExceptionError(
        "Invalid TOTP code",
        StatusCode.UNAUTHORIZED
      );
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
