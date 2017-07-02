import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import{Http, Headers, RequestOptions} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {Cart} from "../../providers/cart/cart";
import {ProductListPage} from "../product-list/product-list";


/**
 * Generated class for the ProductDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-product-detail',
    templateUrl: 'product-detail.html',
})
export class ProductDetailPage {
    public product = null;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public http: Http,
        public cart: Cart
    )

    {}
    

    ionViewDidLoad() {
        //Agora vamos passar o TOKEN no Header da requisição http (Headers() é uma classe do Angular
        let headers = new Headers();
        headers.set('Authorization', `Bearer ${window.localStorage['token']}`);
        let requestOptions = new RequestOptions({headers});
        //adicinando a crase para fazer interpolação da variável id colocando-o na url
        //this.http.get(`http://localhost:8000/api/products/${this.navParams.get('id')}`, requestOptions)
        this.http.get(`http://localhost/laravel54-ionic2-serie/public/api/products/${this.navParams.get('id')}`, requestOptions)
            .toPromise().then((response)=>{
            //caso a tenha sucesso adicione a variavel product[];
            this.product=response.json();
        })
    }


    //criar metodo que vai adicionar produto ao carrinho
    addToCart(){
        this.cart.addItem(this.product);
        //redirecionar passando o ProductListPage
        this.navCtrl.setRoot(ProductListPage);
    }

}
