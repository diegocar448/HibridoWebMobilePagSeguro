<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PagSeguroController extends Controller
{
    //vamos retornar sessão gerada pelo PagSeguro, essa sessão vai permitir que a gente faça algumas requisições la no Ionic e a requisição para o cartão que a gente precisa
    public function getSessionId(){
        //pegar as credenciais do PagSeguro da sua conta
        $credentials = \PagSeguroConfig::getAccountCredentials();
        //retornar um JSON e o Ionic vai seaarelizar
        return[
            //chamando o metodo getSession passando as nossas credenciais, ele vai fazer uma requisiçao la para o ambiente do PagSeguro
           'session_id' =>  \PagSeguroSessionService::getSession($credentials)
        ];
    }

    //Nos acessar a requisição para receber as informações necessarias
    public function order(Request $request){
        $items = $request->get('items');    //pegar os items que a gente recebeu na requisição
        $hash = $request->get('hash');    //a gente vai precisar do hash
        $total = $request->get('total');    //pegar tbm o total
        $token = $request->get('token');    //E o TOKEN de autorização do cartão

        //A primeira coisa que vamos fazer é criar um objeto de uma classe que vai fazer esse pagamento direto la no PagSeguro
        $directPaymentRequest = new \PagSeguroDirectPaymentRequest();  //Vamos criar um objeto do pagamento direto que a gente vai fazer a requisição la para o PagSeguro
        $directPaymentRequest->setPaymentMode('DEFAULT');  //Nos vamos acessar esse objeto, falar o modo de pagamento vai ser o padrão
        $directPaymentRequest->setPaymentMethod('CREDIT_CARD');   //Vamos passar para o directPaymentRequest qual que vai ser o metodo de pagamento exemplo CREDIT_CARD
        $directPaymentRequest->setCurrency('BRL');    //E o tipo da moeda que a gente vai trabalhar no pagamento

        //NOS VAMOS PEGAR CADA ITEM QUE RECEBEMOS E ADICIONAR ESSE ITEM NO directPaymentRequest
        foreach ($items as $key => $item){
            //Vamos chamar novamente o nosso objeto e vamos ter o metodo addItem (podemos trabalhar com alguns parametros)
            $directPaymentRequest->addItem("00$key",$item['name'],1,$item['value']);    //Vamos identificar o nosso item 00+Key (e a chave de nosso array) + descrição (nome do produto)+ quantidade....
        }

        $directPaymentRequest->setSender(
            'João Comprador',
            'joao@sandbox.pagseguro.com.br',
            '11',
            '56173440',
            'CPF',
            '156.009.442-76'
        );

        //Depois vamos pegar novamente nosso objeto e vamos atribuir ao nosso hash  e passar o nosso hash
        $directPaymentRequest->setSenderHash($hash);

        //Agora nos vamos definir a prestação dessa venda do usuário, vai pagar o total não vai dividir
        $installments = new \PagSeguroDirectPaymentInstallment([
            'quantity' => 1, //numero de parcelas
            'value'    =>$total
        ]);

        //Qual será o metodo da entrega, vai gerar um codigo para o SEDEX
        $sedexCode = \PagSeguroShippingType::getCodeByType('SEDEX');
        //Pegamos o código gerado pelo SEDEX e armazenamos
        $directPaymentRequest->setShippingType($sedexCode);
        //Colocamos o endereço do nosso cliente
        $directPaymentRequest->setShippingAddress(
            '01452002',
            'Av. Brig. Faria Lima',
            '1384',
            'apto. 114',
            'Jardim Paulistano',
            'São Paulo',
            'SP',
            'BRA'
        );
        //Colocamos o endereço para cobrança
        $billingAddress = new \PagSeguroBilling(
            array(
                'postalCode' => '01452002',
                'street' => 'Av. Brig. Faria Lima',
                'number' => '1384',
                'complement' => 'apto. 114',
                'district' => 'Jardim Paulistano',
                'city' => 'São Paulo',
                'state' => 'SP',
                'country' => 'BRA'
            )
        );

        //Agora vamos definir o checkout com o nosso cartão de credito passando o array com todas informações necessarias segundo a documentação do PagSeguro
        $creditCardData = new \PagSeguroCreditCardCheckout([
            'token' => $token,
            'installment' => $installments,//as prestações poderia ter mais de 1
            'billing' => $billingAddress,   //A nossa cobrança no caso o endereço da cobrança
            'holder' =>  new \PagSeguroCreditCardHolder([   //Holder vai ter algumas informações de nosso cliente
                'name' => 'João Comprador',  //Nome do cliente
                'birthDate' => '01/01/1979',
                'areaCode'  => '11', //Telefone do cliente
                'number'    => '23457897',
                'documents' => [    //O CPF
                    'type' => 'CPF',
                    'value'=> '156.009.442-76'
                ]
            ])
        ]);

        //Agora nos vamos de novo acessar o nosso $directPaymentRequest e vamos atribuir o nosso cartão de credito
        $directPaymentRequest->setCreditCard($creditCardData);

        //Agora vamos fazer o pagamento, vamos criar try catch para erros que possam existir
        try{
            $credetials = \PagSeguroConfig::getAccountCredentials(); //Primeiro vamos pegar as nossas credenciais do PagSeguro

            $response = $directPaymentRequest->register($credetials); //Vamos gerar a nossa resposta que pode ser de sucesso ou não e registrar o nosso pagamento
            dd($response);// vamos usar o Helper dump or die dd e ver toda request que estiver sendo retornada
        }catch(\PagSeguroServiceException $e){  //Nos temos uma Exception q e do PagSeguro
            return[     //retornar um array com a mensagem do erro
                'message' => $e->getMessage(),
                'success' => false //caso seja sem sucesso
            ];
        }


    }
}
