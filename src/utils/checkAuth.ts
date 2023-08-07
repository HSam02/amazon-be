import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export enum Role {
  Guest = "guest",
  User = "user",
  Admin = "admin",
}

declare module "express" {
  interface Request {
    user?: {
      id: number;
      role: Role;
    };
  }
}

export default (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace(/Bearer /, "");
    if (!token) {
      throw new Error();
    }

    const { id } = <jwt.JwtPayload>jwt.verify(token, process.env.SECRET_KEY || "secret");
    req.user = {
      id,
      role: id === 1 ? Role.Admin : Role.User,
    };
  } catch (error) {
    req.user = {
      id: NaN,
      role: Role.Guest,
    };
  } finally {
    next();
  }
};
