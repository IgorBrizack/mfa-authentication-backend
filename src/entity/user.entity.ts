import { validate, validateSync } from "class-validator";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IMfaConfig } from "../interfaces";

export interface IUserCreationAttributes {
  email: string;
  name: string;
  password: string;
  mfa_authentication: IMfaConfig;
}
@Entity("users")
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  token!: string;

  @Column({ type: "varchar", length: 255 })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "json" })
  mfa_authentication!: any;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  constructor() {
    super();
  }

  static createInstance(data: IUserCreationAttributes): UserEntity {
    const userInstance = new this();

    userInstance.email = data.email;
    userInstance.name = data.name;
    userInstance.password = data.password;
    userInstance.mfa_authentication = data.mfa_authentication;
    const errors = validateSync(userInstance);

    if (errors.length > 0) {
      throw new Error("Invalid user data");
    }

    return userInstance;
  }
}
