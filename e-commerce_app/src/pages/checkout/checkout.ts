import {Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Cart} from "../../providers/cart/cart";
import 'rxjs/add/operator/toPromise';
import {Http, Headers, RequestOptions} from "@angular/http";



declare var PagSeguroDirectPayment;
/**
 * Generated class for the CheckoutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
  //o nosso objeto de cartão de credito
  public creditCard = {
    num: '',
    cvv: '',
    monthExp: '',
    yearExp: '',
    brand: '',          //Bandeira VISA, MASTERCARD etc......
    token:''            //esse token vai la para API é o TOKEN que o PagSeguro criou para o cartão de credito que a gente digitou
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public cart:Cart,
              public http:Http,
              public ref:ChangeDetectorRef
  )
  {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }

    paymentCreditCard(){
        this.getSession(); //pegar a sessão
    }

    getSession(){
        let headers = new Headers();
        headers.set('Authorization', `Bearer ${window.localStorage['token']}`);
        let requestOptions = new RequestOptions({headers});
        this.http.get('http://localhost/laravel54-ionic2-serie/public/api/session', requestOptions)
            .toPromise().then((response) => {     //se tive o sucesso
            PagSeguroDirectPayment.setSessionId(response.json().session_id);  //chamar o JS do PagSeguro , Agente vai pegar a sessão da API que foi gerada la no PagSeguro Atraves das Nossas credenciais
            this.getBrandFromNum(); //depois que pegar a sessão a gente vai pegar a bandeira do cartão
        })
    }

    getBrandFromNum() {
        PagSeguroDirectPayment.getBrand({ //sempre usar o PagSeguroDirectPayment
            cardBin: this.creditCard.num.substring(0,6),   // passar o objeto, chamar o numero e função substring e pega de 0 a 6 os 6 primeiro digitos do cartão
            success: response => {     //se tiver sucesso entre
                this.creditCard.brand = response.brand.name;
                this.ref.detectChanges();        //Nos estamos detectando aqui a mudança do objeto para realmente persistir os dados do objeto
                this.getTokenFromCreditCard();  //depois vamos pegar o TOKEN do cartão
            }
        })
    }

    //agora nos vamos pegar o TOKEN de autorização para o nosso cartão de credito
    getTokenFromCreditCard(){
        PagSeguroDirectPayment.createCardToken({ //Para gente poder gerar o nosso Token
            cardNumber: this.creditCard.num,   // passar as informações do cartão de credito
            brand: this.creditCard.brand,    //passar a bandeira do cartão
            cvv: this.creditCard.cvv,   //passar o codigo de segurança
            expirationMonth: this.creditCard.monthExp,    //passar o mês de expiração
            expirationYear: this.creditCard.yearExp,    //passar o ano de expiração
            success: response => {     //se tiver sucesso nos vamos guardar o TOKEN que foi gerado
                this.creditCard.token = response.card.token; //o TOKEN que a gente precisa mandar para nossa API
                this.ref.detectChanges();        //Vai detectar as mudanças
                this.sendPayment();    //depois a gente vai chamar o sendPayment()
            }
        })
    }

    //Agora que nos temos as informações do PagSeguro podemos gerar a nossa ordem de pagamento
    sendPayment(){
        //pegamos a informação do TOKEN para montarmos no headers
        let headers = new Headers();
        headers.set('Authorization', `Bearer ${window.localStorage['token']}`);
        let requestOptions = new RequestOptions({headers});
        //agora vamos montar a nossas requisição HTTP, sera POST porque estamos criando a nossa venda, + {} as informações q vai no corpo da requisição , + opções da requisição
        this.http.post('http://localhost/laravel54-ionic2-serie/public/api/order', {
            //vamos formular aqui oq a gente vai enviar para a API
            items: this.cart.items,    //a gente vai enviar os itens da venda
            token: this.creditCard.token,    //enviar o TOKEN de autorização do cartão de credito
            hash: PagSeguroDirectPayment.getSenderHash(),   //a gente tem q gerar e enviar um hash que corresponde a esse pagamento que estamos fazendo
            total: this.cart.total //vamos passar o valor total desse carinho
            //NENHUMA INFORMAÇÃO DO CARTÃO DE CREDITO É PASSADO PARA API, TUDO ESTA NO AMBIENTE SEGURO DO PAGSEGURO SO PASSAMOS O TOKEN DE AUTORIZAÇÃO DO CARTÃO
        }, requestOptions)
            .toPromise().then(response => console.log(response));  //quando a gente obtiver um sucesso vamos mostrar esse sucesso no console
    }

}
