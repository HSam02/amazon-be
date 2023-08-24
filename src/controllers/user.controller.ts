import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  IChangePasswordSchema,
  ILoginShcema,
  IRegisterShcema,
} from "../validations/user.validation.js";
import { IMessage, sendMail } from "../utils/sendMail.js";
import { getSixDigitCode } from "../utils/getSixDigitCode.js";
import { Role } from "../utils/checkAuth.js";
import { Address, User } from "../database/models/models.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { password, verification, ...newUser } = req.body as IRegisterShcema;

    const verificationData = <jwt.JwtPayload>(
      jwt.verify(verification.token, verification.code)
    );
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

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET || "",
      { expiresIn: "30d" }
    );

    res.json({ user: { ...newUser, id: user.id, role: Role.User }, token });
  } catch (error: any) {
    res.status(415).json({
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as ILoginShcema;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Wrong email or password");
    }

    const isPassRight = await bcrypt.compare(password, user.passwordHash);
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
      }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        defaultAddressId: user.defaultAddressId,
        role: user.id === 1 ? Role.Admin : Role.User,
      },
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

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      defaultAddressId: user.defaultAddressId,
      role: user.id === 1 ? Role.Admin : Role.User,
    });
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

    const token = jwt.sign({ email }, verificationCode, { expiresIn: "5m" });

    res.json(token);
  } catch (error: any) {
    res.status(550).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, password } = req.body as IChangePasswordSchema;

    const user = await User.findByPk(req.user?.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPassRight = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isPassRight) {
      throw new Error("Wrong password");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    user.passwordHash = passwordHash;
    await user.save();

    res.json({
      success: true,
    });
  } catch (error: any) {
    if (error.message === "Wrong password") {
      return res.json({
        success: false,
      });
    }
    res.status(401).json({
      message: error.message,
    });
  }
};

export const setDefaultAddress = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(req.user?.id);
    if (!user) {
      throw new Error("User not found");
    }

    const address = await Address.findByPk(id);
    if (!address || address.userId !== user.id) {
      throw new Error("Address not found");
    }

    user.defaultAddressId = +id;
    await user.save();

    res.json({
      success: true,
    });
  } catch (error: any) {
    res.status(550).json({ success: false, message: error.message });
  }
};
