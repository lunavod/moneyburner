import { AuthModule } from './auth/auth.module'
import { CurrenciesModule } from './currencies/currencies.module'
import { MoneyTransfersModule } from './money-transfers/money-transfers.module'
import { ProductsModule } from './products/products.module'
import { PurchaseElementsModule } from './purchase-elements/purchase-elements.module'
import { PurchasesModule } from './purchases/purchases.module'
import { StoresModule } from './stores/stores.module'
import { UsersModule } from './users/users.module'
import { Router } from './utils/router'

const r = new Router()

r.resource('auth', AuthModule)
r.resource('users', UsersModule)
r.resource('currencies', CurrenciesModule)
r.resource('stores', StoresModule)
r.resource('products', ProductsModule)
r.resource('purchases', PurchasesModule)
r.resource('purchase-elements', PurchaseElementsModule)
r.resource('money-transfers', MoneyTransfersModule)

const routes = r.routes
export default routes
