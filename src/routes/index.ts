// src/routes/app.router.ts
import { Router, Request, Response } from "express";
import { Validation } from "../validations";
import { UserRegisterCommand } from "../use-cases/userRegister.command";
import { UserRepository } from "../repository/user.repository";

export class AppRouter {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public getRouter(): Router {
    const router = Router();

    router.get("/health-check", (req: Request, res: Response) => {
      res.send({ success: true });
    });

    router.post("/users", async (req: Request, res: Response) => {
      const { body } = req;
      try {
        new Validation().validateUserCreation(body);

        const command = new UserRegisterCommand(this.userRepository);
        const result = await command.execute(body);

        res.status(200).send(result);
      } catch (error) {
        res.status(500).send(error);
      }
    });

    return router;
  }
}
