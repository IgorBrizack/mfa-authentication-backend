import { StatusCode } from "../enums";
import { HttpExceptionError } from "../errors";
import { IUser } from "../interfaces";
import { UserRepository } from "../repository/user.repository";
import { MfaAuthenticationService } from "../services/mfaAuthentication.service";
import QRCode from "qrcode";

export type RegisterMfaParams = {
  userToken: string;
};

export class RegisterMfaCommand {
  constructor(
    private userRepository: UserRepository,
    private mfaAuth: MfaAuthenticationService
  ) {}

  public async execute(params: RegisterMfaParams): Promise<string> {
    try {
      const user = await this.getUser(params.userToken);

      const userEntitySid = user.userEntitySidRegistered()
        ? user.mfa_authentication.entity_sid
        : await this.mfaAuth.createEntity(params.userToken);

      const newFactorGenerated = await this.mfaAuth.generateNewFactor(
        user.email,
        userEntitySid
      );
      await this.saveUserMfaData(user, newFactorGenerated.sid, userEntitySid);

      const qrCodeGenerated = await QRCode.toDataURL(
        newFactorGenerated.binding.uri
      );

      return qrCodeGenerated;
    } catch (error) {
      throw error;
    }
  }

  private async getUser(userToken: string): Promise<IUser> {
    const user = await this.userRepository.findByEmail(userToken);

    if (!user)
      throw new HttpExceptionError("User not found", StatusCode.NOT_FOUND);

    return user;
  }

  private async saveUserMfaData(
    user: IUser,
    newFactorSid: string,
    mfaEntitySid: string
  ): Promise<void> {
    user.mfa_authentication.entity_sid = mfaEntitySid;
    user.mfa_authentication.factor_sid = newFactorSid;

    await this.userRepository.saveEntity(user);
  }
}
