import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'
import { AccountsModule } from 'src/accounts/accounts.module'
import { CurrenciesModule } from 'src/currencies/currencies.module'
import { MoneyTransfersModule } from 'src/money-transfers/money-transfers.module'
import { ProductsModule } from 'src/products/products.module'
import { PurchaseElementsModule } from 'src/purchase-elements/purchase-elements.module'
import { PurchasesModule } from 'src/purchases/purchases.module'
import { StoresModule } from 'src/stores/stores.module'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { LeumiModule } from './leumi/leumi.module'
import { PrismaModule } from './prisma.module'
import routes from './routes'
import { TasksModule } from './tasks/tasks.module'
import { UsersModule } from './users/users.module'

// insert new imports here

@Module({
  imports: [
    PrismaModule,
    RouterModule.register(routes),
    AuthModule,
    UsersModule,
    TasksModule,
    CurrenciesModule,
    ProductsModule,
    AccountsModule,
    PurchasesModule,
    StoresModule,
    PurchaseElementsModule,
    LeumiModule,
    MoneyTransfersModule,
    // insert new modules here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
