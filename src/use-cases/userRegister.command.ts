import { IUserCreationAttributes } from "../entity/user.entity";
import { IUser } from "../interfaces";
import { UserRepository } from "../repository/user.repository";
import bcrypt from "bcrypt";

export class UserRegisterCommand {
  constructor(private userRepository: UserRepository) {}

  public async execute(params: IUserCreationAttributes): Promise<IUser> {
    try {
      await this.verifyRepeatedEmail(params.email);

      const hashedPassword = await this.encryptPassword(params.password);

      const user = await this.createUser({
        ...params,
        password: hashedPassword,
        mfa_authentication: {
          entity_sid: null,
          factor_sid: null,
          mfa_registered: false,
          mfa_enabled: false,
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  private async verifyRepeatedEmail(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (user) throw new Error("User already exists");
  }

  private async encryptPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  private async createUser(userData: IUserCreationAttributes): Promise<IUser> {
    return await this.userRepository.createUser(userData);
  }
}
