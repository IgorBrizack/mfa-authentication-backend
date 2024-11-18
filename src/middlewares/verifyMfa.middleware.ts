import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { StatusCode } from "../enums";
import { IUserJwt, RequestEnriched } from "../interfaces";
import { HttpExceptionError } from "../errors";

export const verifyMfaMiddleware = (
  req: RequestEnriched,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"] as string; // Assume que o token é passado no header "Authorization"

  if (!token) {
    res.status(401).send({ error: "Token not provided" });
  }

  try {
    const secretKey = process.env.JWT_SECRET || "your_secret_key";

    const decoded = jwt.verify(token, secretKey) as IUserJwt;

    if (!decoded.mfa_authentication.mfa_approved) {
      throw new HttpExceptionError(
        "User not authorized",
        StatusCode.UNAUTHORIZED
      );
    }

    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).send({ error: "Token has expired" });
    } else if (error instanceof HttpExceptionError) {
      res.status(error.statusCode).send({ error: error.message });
    } else {
      res.status(500).send({ error: "Failed to authenticate token" });
    }
  }
};
