import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Http} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {ProductListPage} from "../product-list/product-list";

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

    public user = {
        email: '',
        password: ''
    };

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public http:Http
   ){ }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  login(){
    //fazer uma requisição POST
      this.http.post('http://localhost:8000/api/login',this.user)
          .toPromise().then((response) =>{
          window.localStorage['token'] = response.json().token;
          this.navCtrl.setRoot(ProductListPage)
      });
  }
}
