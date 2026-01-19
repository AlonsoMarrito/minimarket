import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; cost: number }) {
    return this.prisma.products.create({ data });
  }

  findAll() {
    return this.prisma.products.findMany();
  }

  findOne(id: number) {
    return this.prisma.products.findUnique({ where: { id } });
  }

  update(id: number, data: { name?: string; cost?: number }) {
    return this.prisma.products.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.products.delete({
      where: { id },
    });
  }
}
