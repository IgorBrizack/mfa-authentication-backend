import { Repository } from "typeorm";
import { AppDataSource } from "../db/connection";
import { IUserCreationAttributes, UserEntity } from "../entity/user.entity";
import { IUser } from "../interfaces";

export class UserRepository {
  private userRepository: Repository<UserEntity>;
  constructor() {
    this.userRepository = AppDataSource.getRepository(UserEntity);
  }

  public async createUser(userData: IUserCreationAttributes): Promise<IUser> {
    const userInstance = this.userRepository.create(userData);

    return await this.userRepository.save(userInstance);
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }
}
