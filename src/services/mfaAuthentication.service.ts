import Twilio from "twilio/lib/rest/Twilio";
import { FactorInstance } from "twilio/lib/rest/verify/v2/service/entity/factor";
import { IChallenge } from "../interfaces";
import { NewFactorInstance } from "twilio/lib/rest/verify/v2/service/entity/newFactor";

enum ChallengeStatus {
  APPROVED = "approved",
}

export class MfaAuthenticationService {
  private client: Twilio;

  constructor() {
    this.client = new Twilio(
      process.env.TWILLIO_ACCOUNT_SID,
      process.env.TWILLIO_AUTH_TOKEN
    );
  }

  public async createEntity(userToken: string): Promise<string> {
    const newEntity = await this.client.verify.v2
      .services(process.env.TWILLIO_SERVICE_SID as string)
      .entities.create({
        identity: userToken,
      });

    return newEntity.sid;
  }
  public async generateNewFactor(
    email: string,
    mfaEntitySid: string
  ): Promise<NewFactorInstance> {
    const newFactor = await this.client.verify.v2
      .services(process.env.TWILLIO_SERVICE_SID as string)
      .entities(mfaEntitySid)
      .newFactors.create({
        factorType: "totp",
        friendlyName: `authy-${email}`,
      });

    return newFactor;
  }

  public async updateFactor(
    mfaEntitySid: string,
    mfaFactorSid: string,
    totpCode: string
  ): Promise<FactorInstance> {
    const factor = await this.client.verify.v2
      .services(process.env.TWILLIO_SERVICE_SID as string)
      .entities(mfaEntitySid)
      .factors(mfaFactorSid)
      .update({ authPayload: totpCode });

    return factor;
  }

  public async factorValidationChallenge(
    mfaEntitySid: string,
    mfaFactorSid: string,
    totpCode: string
  ): Promise<IChallenge> {
    const challenge = await this.client.verify.v2
      .services(process.env.TWILLIO_SERVICE_SID as string)
      .entities(mfaEntitySid)
      .challenges.create({
        authPayload: totpCode,
        factorSid: mfaFactorSid,
      });

    return {
      approved: challenge.status === ChallengeStatus.APPROVED,
    };
  }
}
