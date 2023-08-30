import { NextFunction, Request, Response } from "express";
import { Role } from "./setUser";

export default (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== Role.Guest) {
    next();
  } else {
    res.status(403).json({ message: "No Authorized!" });
  }
};
