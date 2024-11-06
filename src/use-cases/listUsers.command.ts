import { IUser } from "../interfaces";
import { UserRepository } from "../repository/user.repository";

export class ListUsersCommand {
  constructor(private userRepository: UserRepository) {}

  public async execute(): Promise<IUser[]> {
    try {
      const users = await this.userRepository.getUsers();
      return users;
    } catch (error) {
      throw error;
    }
  }
}
