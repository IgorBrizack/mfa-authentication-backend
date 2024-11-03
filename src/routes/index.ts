import { Router, Request, Response } from "express";
import { Validation } from "../validations";
import { UserRepository } from "../repository/user.repository";
import { HttpExceptionError } from "../errors";
import { LoginCommand, UserRegisterCommand } from "../use-cases";

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
        if (error instanceof HttpExceptionError) {
          res.status(error.statusCode).send({ error: error.message });
        }
        res.status(500);
      }
    });

    router.post("/login", async (req: Request, res: Response) => {
      const { body } = req;
      try {
        new Validation().validateUserLogin(body);

        const command = new LoginCommand(this.userRepository);
        const result = await command.execute(body);

        res.status(200).send(result);
      } catch (error) {
        if (error instanceof HttpExceptionError) {
          res.status(error.statusCode).send({ error: error.message });
        }
        res.status(500);
      }
    });

    return router;
  }
}
