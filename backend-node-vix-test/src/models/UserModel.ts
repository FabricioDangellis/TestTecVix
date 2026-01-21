import { prisma } from "../database/client";
import { TQuery } from "../types/validations/Queries/queryListAll";
import { TUserCreated } from "../types/validations/User/createUser";

export class UserModel {
  async createNewUser(data: TUserCreated) {
    return prisma.user.create({ data });
  }

  async getById(idUser: string) {
    return prisma.user.findUnique({
      where: { idUser },
    });
  }

  async totalCount(query: TQuery, idBrandMaster?: number) {
    return prisma.user.count({
      where: {
        deletedAt: null,
        idBrandMaster,
        username: {
          contains: query.search,
        },
      },
    });
  }

  async listAll(query: TQuery, idBrandMaster?: number) {
    const limit = query.limit || 0;
    const skip = query.page ? query.page * limit : query.offset || 0;

    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
        idBrandMaster,
        username: {
          contains: query.search,
        },
      },
      take: limit || undefined,
      skip,
      orderBy: { updatedAt: "desc" },
      select: {
        idUser: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    const totalCount = await this.totalCount(query, idBrandMaster);
    return { totalCount, result: users };
  }

  async updateUser(idUser: string, data: TUserCreated) {
    return prisma.user.update({
      where: { idUser },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async deleteUser(idUser: string) {
    return prisma.user.update({
      where: { idUser },
      data: { updatedAt: new Date(), deletedAt: new Date() },
    });
  }
}
