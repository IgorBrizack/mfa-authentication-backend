import { Sequelize, DataTypes, Model } from "sequelize";
import { IMfaConfig } from "../interfaces";

export interface UserAttributes {
  user_token: string;
  user_name: string;
  password: string;
  mfa_config: IMfaConfig;
  created_at: Date;
  updated_at: Date;
}

export interface UserCreationAttributes {
  user_name: string;
  password: string;
}

export class UserEntity extends Model<UserAttributes, UserCreationAttributes> {
  user_token!: string;
  user_name!: string;
  password!: string;
  mfa_config!: IMfaConfig;
  created_at!: Date;
  updated_at!: Date;
}

module.exports = (sequelize: Sequelize) => {
  return UserEntity.init(
    {
      user_token: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
        allowNull: false,
      },
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      mfa_config: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      underscored: true,
      tableName: "users",
      modelName: "user",
    }
  );
};
