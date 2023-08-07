import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { ILoginShcema, IRegisterShcema } from "../validation_schemas/user.js";
import { IMessage, sendMail } from "../utils/sendMail.js";
import { getSixDigitCode } from "../utils/getSixDigitCode.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { password, verification, ...newUser } = req.body as IRegisterShcema;

    const verificationData = <jwt.JwtPayload>jwt.verify(verification.token, verification.code);
    if (verificationData.email !== newUser.email) {
      return res.status(401).json({
        message: "Email not verified",
      });
    }

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
      process.env.JWT_SECRET || "",
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
      process.env.JWT_SECRET || "",
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

export const verify = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const verificationCode = getSixDigitCode();

    const msg: IMessage = {
      to: email,
      subject: "Verify your email adress",
      text: "Verify your email adress",
      html: `<p>Verification code: <strong>${verificationCode}</strong></p>`,
    };

    await sendMail(msg);

    const token = jwt.sign({ email }, verificationCode, { expiresIn: "5min" });

    res.json(token);
  } catch (error: any) {
    res.status(550).json({ success: false, message: error.message });
  }
};
