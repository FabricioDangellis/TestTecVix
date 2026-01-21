import { Response } from "express";
import { UserService } from "../services/UserService";
import { CustomRequest } from "../types/custom";
import { STATUS_CODE } from "../constants/statusCode";

export class UserController {
  constructor() {}
  private userService = new UserService();

  async createNewUser(req: CustomRequest<unknown>, res: Response) {
    const result = await this.userService.createUser(req.body);
    res.status(STATUS_CODE.CREATED).json(result);
  }

  async getById(req: CustomRequest<unknown>, res: Response) {
    const { idUser } = req.params;
    const result = await this.userService.getById(String(idUser));
    res.status(STATUS_CODE.OK).json(result);
  }

  async listAll(req: CustomRequest<unknown>, res: Response) {
    const result = await this.userService.listAll(req.query);
    res.status(STATUS_CODE.OK).json(result);
  }

  async updateUser(req: CustomRequest<unknown>, res: Response) {
    const { idUser } = req.params;
    const result = await this.userService.updateUser(String(idUser), req.body);
    res.status(STATUS_CODE.OK).json(result);
  }

  async deleteUser(req: CustomRequest<unknown>, res: Response) {
    const { idUser } = req.params;
    const result = await this.userService.deleteUser(String(idUser));
    res.status(STATUS_CODE.OK).json(result);
  }
}
