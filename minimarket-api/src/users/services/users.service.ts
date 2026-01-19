import {
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Role } from '../../auth/roles.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.employeed.findMany({
      select: {
        id: true,
        type: true,
      },
    });
  }

  async findOne(id: number, user: any) {
    if (user.type === Role.SELLER && user.id !== id) {
      throw new ForbiddenException();
    }

    return this.prisma.employeed.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
      },
    });
  }

  async create(data: { type: string; password: string }) {
    const hashed = await bcrypt.hash(data.password, 10);

    return this.prisma.employeed.create({
      data: {
        type: data.type,
        password: hashed,
      },
      select: {
        id: true,
        type: true,
      },
    });
  }

  async update(
    id: number,
    data: { type?: string; password?: string },
  ) {
    const updateData: any = {};

    if (data.type) updateData.type = data.type;
    if (data.password) {
      updateData.password = await bcrypt.hash(
        data.password,
        10,
      );
    }

    return this.prisma.employeed.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        type: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.employeed.delete({
      where: { id },
    });
  }
}
