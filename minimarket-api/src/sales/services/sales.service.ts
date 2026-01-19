import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  create(data: {
    products: string;
    prices: string;
    total: number;
    saler: number;
  }) {
    return this.prisma.sale.create({
      data,
    });
  }

  findAll() {
    return this.prisma.sale.findMany();
  }

  findOne(id: number) {
    return this.prisma.sale.findUnique({
      where: { id },
    });
  }

  update(
    id: number,
    data: {
      products?: string;
      prices?: string;
      total?: number;
    },
  ) {
    return this.prisma.sale.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.sale.delete({
      where: { id },
    });
  }
}
