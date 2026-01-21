import { UserModel } from "../models/UserModel";
import { querySchema } from "../types/validations/Queries/queryListAll";
import {
  TUserCreated,
  userCreatedSchema,
} from "../types/validations/User/createUser";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";

export class UerService {
  constructor() {}
  private userModel = new UserModel();

  async createUser(data: TUserCreated) {
    const validData = userCreatedSchema.parse(data);

    const newUser = await this.userModel.createNewUser(validData);

    return newUser;
  }

  async getById(idUser: string) {
    return await this.userModel.getById(idUser);
  }

  async listAll(query: unknown) {
    const validQuery = querySchema.parse(query);
    return await this.userModel.listAll(validQuery);
  }

  async updateUser(idUser: string, data: unknown) {
    const validData = userCreatedSchema.parse(data);
    const oldUser = await this.userModel.getById(idUser);

    if (!oldUser) {
      throw new AppError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    return await this.userModel.updateUser(idUser, validData);
  }

  async deleteUser(idUser: string) {
    const oldUser = await this.userModel.getById(idUser);

    if (!oldUser) {
      throw new AppError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const deletedUser = this.userModel.deleteUser(idUser);

    return {
      user: deletedUser,
    };
  }
}
