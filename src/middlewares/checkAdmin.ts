import { NextFunction, Request, Response } from "express";
import { Role } from "./checkAuth.js";

export default (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === Role.Admin) {
    next();
  } else {
    res.status(403).json({ message: "No Access!" });
  }
};
