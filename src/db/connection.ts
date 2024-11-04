import { DataSource } from "typeorm";
import { UserEntity } from "../entity/user.entity";

import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "db", // "db" se refere ao container Docker
  port: parseInt(process.env.DB_PORT || "3306"),
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
    ssl: false,
    allowPublicKeyRetrieval: true,
  },
});
