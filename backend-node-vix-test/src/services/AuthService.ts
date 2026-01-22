import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { AppError } from "../errors/AppError";
import { UserModel } from "../models/UserModel";
import { loginSchema, TLogin } from "../types/validations/Login/login";
import {
  TUserCreated,
  userCreatedSchema,
} from "../types/validations/User/createUser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  constructor() {}
  private userModel = new UserModel();

  async register(data: TUserCreated) {
    const validData = userCreatedSchema.parse(data);

    const userExist = await this.userModel.getByEmail(validData.email);

    if (userExist) {
      throw new AppError(
        ERROR_MESSAGE.EMAIL_ALREADY_EXISTS,
        STATUS_CODE.CONFLICT,
      );
    }

    const hashedPassword = await bcrypt.hash(validData.password, 10);

    const newUser = await this.userModel.createNewUser({
      ...validData,
      password: hashedPassword,
    });

    return newUser;
  }

  async login(data: TLogin) {
    const validData = loginSchema.parse(data);

    const user = await this.userModel.getByEmail(validData.email);

    if (!user) {
      throw new AppError(
        ERROR_MESSAGE.INVALID_CREDENTIALS,
        STATUS_CODE.UNAUTHORIZED,
      );
    }

    const passwordMatch = await bcrypt.compare(
      validData.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new AppError(
        ERROR_MESSAGE.INVALID_CREDENTIALS,
        STATUS_CODE.UNAUTHORIZED,
      );
    }

    const token = jwt.sign(
      { sub: user.idUser },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "30m",
      },
    );

    return {
      token,
      user,
    };
  }
}
