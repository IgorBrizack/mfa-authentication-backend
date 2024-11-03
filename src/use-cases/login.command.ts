import { IUserCreationAttributes, UserEntity } from "../entity/user.entity";
import { BaseError } from "../errors";
import { IUser, IUserRegularJwt } from "../interfaces";
import { UserRepository } from "../repository/user.repository";
import bcrypt from "bcrypt";

export type LoginCommandParams = {
  email: string;
  password: string;
};
export class LoginCommand {
  constructor(private userRepository: UserRepository) {}

  public async execute(
    params: IUserCreationAttributes
  ): Promise<IUserRegularJwt> {
    try {
      const user = await this.getUser(params.email);

      await this.validatePassword(params.password, user);

      const JWT: IUserRegularJwt = user.getUserRegularJwt();

      return JWT;
    } catch (error) {
      throw error;
    }
  }

  private async getUser(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new BaseError("User not found", 404);

    return user;
  }

  private async validatePassword(password: string, user: IUser): Promise<void> {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BaseError("Invalid password", 401);
  }
}
