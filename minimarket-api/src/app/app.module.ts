import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/users/modules/users.module';
import { ProductsModule } from 'src/products/modules/products.module';
import { SalesModule } from 'src/sales/modules/sales.module';
import { AuthModule } from 'src/auth/modules/auth.module';

@Module({
  imports: [UsersModule, ProductsModule, SalesModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
