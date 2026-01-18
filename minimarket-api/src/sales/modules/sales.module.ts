import { Module } from '@nestjs/common';
import { SalesService } from '../services/sales.service';
import { SalesController } from '../controllers/sales.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SalesController],
  providers: [SalesService, PrismaService],
})
export class SalesModule {}
