import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import{Http, Headers, RequestOptions} from "@angular/http";
import 'rxjs/add/operator/toPromise';

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
        public http: Http
    )

    {
    }

    ionViewDidLoad() {
        let headers = new Headers();
        headers.set('Authorization', `Bearer ${window.localStorage['token']}`);
        let requestOptions = new RequestOptions({headers});
        //adicinando a crase para fazer interpolação da variável id colocando-o na url
        //this.http.get(`http://localhost:8000/api/products/${this.navParams.get('id')}`)
        this.http.get(`http://127.0.0.1:8000/api/products/${this.navParams.get('id')}`, requestOptions)
            .toPromise().then((response)=>{
            //caso a tenha sucesso adicione a variavel product[];
            this.product=response.json();
        })
    }
}
