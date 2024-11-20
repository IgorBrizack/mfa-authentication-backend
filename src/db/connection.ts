import { DataSource } from "typeorm";
import { UserEntity } from "../entity/user.entity";

import dotenv from "dotenv";

dotenv.config();

const prodDataSource = new DataSource({
  type: "postgres",
  url: "postgresql://mfadb_owner:SYyHs53bpzvR@ep-white-bush-a53l1a91.us-east-2.aws.neon.tech/mfadb",
  synchronize: true,
  logging: true,
  entities: [UserEntity],
  subscribers: [],
  migrations: ["./src/db/migrations/**/*{.ts,.js}"],
  extra: {
    connectionLimit: 10,
    ssl: true,
  },
});

export const AppDataSource = process.env.PROD
  ? prodDataSource
  : new DataSource({
      type: "postgres",
      host: process.env.DB_HOST || "db", // "db" se refere ao container Docker
      port: parseInt(process.env.DB_PORT || "5432"),
      username: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "rootpass",
      database: process.env.DB_NAME || "mydatabase",
      synchronize: true,
      logging: false,
      entities: [UserEntity], // Adicione suas entidades aqui
      subscribers: [],
      migrations: ["./src/db/migrations/**/*{.ts,.js}"],
      extra: {
        connectionLimit: 10,
        ssl: true,
        allowPublicKeyRetrieval: true,
      },
    });
