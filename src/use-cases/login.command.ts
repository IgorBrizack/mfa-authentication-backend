import { IUserCreationAttributes, UserEntity } from "../entity/user.entity";
import { StatusCode } from "../enums";
import { HttpExceptionError } from "../errors";
import { IUser, IUserJwt } from "../interfaces";
import { UserRepository } from "../repository/user.repository";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export type LoginCommandParams = {
  email: string;
  password: string;
};
export class LoginCommand {
  constructor(private userRepository: UserRepository) {}

  public async execute(params: IUserCreationAttributes): Promise<string> {
    try {
      const user = await this.getUser(params.email);

      await this.validatePassword(params.password, user);

      const JWT = this.generateJwt(user);

      return JWT;
    } catch (error) {
      throw error;
    }
  }

  private async getUser(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(email);

    if (!user)
      throw new HttpExceptionError("User not found", StatusCode.NOT_FOUND);

    return user;
  }

  private async validatePassword(password: string, user: IUser): Promise<void> {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new HttpExceptionError("Invalid password", StatusCode.UNAUTHORIZED);
  }

  private generateJwt(user: IUser): string {
    const data = user.getUserRegularJwt();

    const options = {
      expiresIn: "24h",
    };

    const token = jwt.sign(data, process.env.JWT_SECRET as string, options);

    return token;
  }
}
