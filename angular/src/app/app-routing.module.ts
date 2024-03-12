import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { Login } from './components/authen/Login.component'
import { Logout } from './components/authen/Logout.component'
import { ResetPassword } from './components/authen/ResetPassword.component'
import { ChangePassword } from './components/authen/ChangePassword.component'
import { Profile } from './components/Profile.component'
import { Default } from './components/Default.component'
import { Home } from './components/Home.component'
import { NotFound } from './components/NotFound.component'
import { UserAccountIndex } from './components/userAccount/Index.component'
import { UserAccountCreate } from './components/userAccount/Create.component'
import { UserAccountDetail } from './components/userAccount/Detail.component'
import { UserAccountEdit } from './components/userAccount/Edit.component'
import { UserAccountDelete } from './components/userAccount/Delete.component'
import { ProductIndex } from './components/product/Index.component'
import { ProductCreate } from './components/product/Create.component'
import { ProductDetail } from './components/product/Detail.component'
import { ProductEdit } from './components/product/Edit.component'
import { ProductDelete } from './components/product/Delete.component'
import { BrandIndex } from './components/brand/Index.component'
import { BrandCreate } from './components/brand/Create.component'
import { BrandDetail } from './components/brand/Detail.component'
import { BrandEdit } from './components/brand/Edit.component'
import { BrandDelete } from './components/brand/Delete.component'
import { OrderHeaderIndex } from './components/orderHeader/Index.component'
import { OrderHeaderCreate } from './components/orderHeader/Create.component'
import { OrderHeaderDetail } from './components/orderHeader/Detail.component'
import { OrderHeaderEdit } from './components/orderHeader/Edit.component'
import { OrderHeaderDelete } from './components/orderHeader/Delete.component'
import { OrderDetailCreate } from './components/orderDetail/Create.component'
import { OrderDetailEdit } from './components/orderDetail/Edit.component'
import { OrderDetailDelete } from './components/orderDetail/Delete.component'

const routes: Routes = [
  { path: '', component: Default },
  { path: 'login', component: Login },
  { path: 'logout', component: Logout },
  { path: 'resetPassword', component: ResetPassword },
  { path: 'changePassword/:token', component: ChangePassword },
  { path: 'home', component: Home },
  { path: 'profile', component: Profile },
  { path: 'userAccount', component: UserAccountIndex },
  { path: 'userAccount/create', component: UserAccountCreate },
  { path: 'userAccount/:id', component: UserAccountDetail },
  { path: 'userAccount/edit/:id', component: UserAccountEdit },
  { path: 'userAccount/delete/:id', component: UserAccountDelete },
  { path: 'product', component: ProductIndex },
  { path: 'product/create', component: ProductCreate },
  { path: 'product/:id', component: ProductDetail },
  { path: 'product/edit/:id', component: ProductEdit },
  { path: 'product/delete/:id', component: ProductDelete },
  { path: 'brand', component: BrandIndex },
  { path: 'brand/create', component: BrandCreate },
  { path: 'brand/:id', component: BrandDetail },
  { path: 'brand/edit/:id', component: BrandEdit },
  { path: 'brand/delete/:id', component: BrandDelete },
  { path: 'orderHeader', component: OrderHeaderIndex },
  { path: 'orderHeader/create', component: OrderHeaderCreate },
  { path: 'orderHeader/:id', component: OrderHeaderDetail },
  { path: 'orderHeader/edit/:id', component: OrderHeaderEdit },
  { path: 'orderHeader/delete/:id', component: OrderHeaderDelete },
  { path: 'orderDetail/create', component: OrderDetailCreate },
  { path: 'orderDetail/edit/:orderId/:no', component: OrderDetailEdit },
  { path: 'orderDetail/delete/:orderId/:no', component: OrderDetailDelete },
  { path: '**', component: NotFound }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }