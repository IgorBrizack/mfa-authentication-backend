// src/app.ts
import express, { Application } from "express";
import "reflect-metadata";
import { AppDataSource } from "./db/connection";
import { AppRouter } from "./routes";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

class AppServer {
  public app: Application;
  private port: number | string;
  private appRouter: AppRouter;
  private corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  };

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.appRouter = new AppRouter();

    this.initializeMiddlewares();
    this.initializeDatabase();
    this.initializeRoutes();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(cors(this.corsOptions));
  }

  private initializeDatabase(): void {
    AppDataSource.initialize()
      .then(() => {
        console.log("DataSource inicializado.");
      })
      .catch((error) => {
        console.error("Erro ao inicializar o DataSource:", error);
      });
  }

  private initializeRoutes(): void {
    this.app.use("/", this.appRouter.getRouter());
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Servidor rodando na porta ${this.port}`);
    });
  }
}

const server = new AppServer();
server.listen();
