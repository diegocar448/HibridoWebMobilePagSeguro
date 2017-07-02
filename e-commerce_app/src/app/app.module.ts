import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {ProductListPage} from "../pages/product-list/product-list";

import { HttpModule } from '@angular/http';
import {ProductDetailPage} from "../pages/product-detail/product-detail";

import {LoginPage} from "../pages/login/login";
import {MyCartPage} from "../pages/my-cart/my-cart";
import {CheckoutPage} from "../pages/checkout/checkout";
import { BarwareClient } from '../providers/barware-client/barware-client';
import { Cart } from '../providers/cart/cart';







@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ProductListPage,
    ProductDetailPage,
    LoginPage,
    MyCartPage,
    CheckoutPage,


  ],
  imports: [
    BrowserModule,
        HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ProductListPage,
    ProductDetailPage,
    LoginPage,
    MyCartPage,
    CheckoutPage,





  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarwareClient,
    Cart,
  ]
})
export class AppModule {}
