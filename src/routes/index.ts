import { Router, Request, Response } from "express";
import { Validation } from "../validations";
import { UserRepository } from "../repository/user.repository";
import { HttpExceptionError } from "../errors";
import {
  ListUsersCommand,
  LoginCommand,
  LoginMfaValidationCommand,
  RegisterMfaCommand,
  UserRegisterCommand,
  ValidateMfaRegisterCommand,
} from "../use-cases";
import { MfaAuthenticationService } from "../services/mfaAuthentication.service";
import { verifyMfaMiddleware } from "../middlewares";

export class AppRouter {
  private userRepository: UserRepository;
  private mfaAuthService: MfaAuthenticationService;

  constructor() {
    this.userRepository = new UserRepository();
    this.mfaAuthService = new MfaAuthenticationService();
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

    router.post(
      "/register-mfa/:userToken",
      async (req: Request, res: Response) => {
        const { params } = req;
        try {
          const command = new RegisterMfaCommand(
            this.userRepository,
            this.mfaAuthService
          );

          const commandParams = {
            userToken: params.userToken,
          };

          const result = await command.execute(commandParams);

          res.status(201).send(result);
        } catch (error) {
          if (error instanceof HttpExceptionError) {
            res.status(error.statusCode).send({ error: error.message });
          }
          res.status(500);
        }
      }
    );

    router.post(
      "/register-mfa-validation/:userToken",
      async (req: Request, res: Response) => {
        const { params, body } = req;
        try {
          const command = new ValidateMfaRegisterCommand(
            this.userRepository,
            this.mfaAuthService
          );

          const commandParams = {
            userToken: params.userToken,
            totpCode: body.totpCode,
          };

          const result = await command.execute(commandParams);

          res.status(200).send(result);
        } catch (error) {
          if (error instanceof HttpExceptionError) {
            res.status(error.statusCode).send({ error: error.message });
          }
          res.status(500);
        }
      }
    );

    router.post(
      "/mfa-authentication/:userToken",
      async (req: Request, res: Response) => {
        const { params, body } = req;
        try {
          const command = new LoginMfaValidationCommand(
            this.userRepository,
            this.mfaAuthService
          );

          const commandParams = {
            userToken: params.userToken,
            totpCode: body.totpCode,
          };

          const result = await command.execute(commandParams);

          res.status(200).send(result);
        } catch (error) {
          if (error instanceof HttpExceptionError) {
            res.status(error.statusCode).send({ error: error.message });
          }
          res.status(500);
        }
      }
    );

    router.get(
      "/users",
      verifyMfaMiddleware,
      async (req: Request, res: Response) => {
        try {
          const command = new ListUsersCommand(this.userRepository);

          const result = await command.execute();

          res.status(200).send(result);
        } catch (error) {
          if (error instanceof HttpExceptionError) {
            res.status(error.statusCode).send({ error: error.message });
          }
          res.status(500);
        }
      }
    );

    return router;
  }
}
