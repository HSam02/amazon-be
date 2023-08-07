import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ILoginShcema, IRegisterShcema } from "../validation_schemas/user.js";
import User from "../models/user.js";
import sgMail from "@sendgrid/mail";

export const register = async (req: Request, res: Response) => {
  try {
    const { password, ...newUser } = req.body as IRegisterShcema;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      ...newUser,
      passwordHash,
    });
    delete user["passwordHash"];

    const token = jwt.sign(
      {
        id: user.id,
      },
      "secret",
      { expiresIn: "30d" },
    );

    res.json({ user: newUser, token });
  } catch (error) {
    res.status(415).json(error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as ILoginShcema;
    const userData = await User.findOne({ where: { email } });
    if (!userData) {
      throw new Error("Wrong email or password");
    }

    const { passwordHash, ...user } = userData;
    const isPassRight = await bcrypt.compare(password, passwordHash!);
    if (!isPassRight) {
      throw new Error("Wrong email or password");
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      "secret",
      {
        expiresIn: "30d",
      },
    );

    res.json({
      user,
      token,
    });
  } catch (error: any) {
    res.status(415).json({
      message: error.message,
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const { id } = req.user!;
    if (isNaN(id)) {
      throw new Error("Not authorized");
    }
    const user = await User.findByPk(id, {
      attributes: { exclude: ["passwordHash"] },
    });
    if (!user) {
      throw new Error("User not found");
    }

    res.json(user);
  } catch (error: any) {
    res.status(403).json({
      message: error.message,
    });
  }
};

export const checkEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ where: { email } });
    res.json(!Boolean(user));
  } catch (error: any) {
    res.status(502).json({
      message: error.message,
    });
  }
};

export const verificate = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const msg = {
      to: email,
      from: "samvelhvhnnsn@gmail.com",
      subject: "Verifying",
      text: "Verify your email adress",
      html: "<strong>gfgjh</strong>",
    };
    
    sgMail.setApiKey("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");
    const data = await sgMail.send(msg);
    res.json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};
