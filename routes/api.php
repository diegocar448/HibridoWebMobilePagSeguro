<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});





Route::group(['middleware'=>'cors'], function (){
    //login por ser externo não precisa de TOKEN que será a pagina de login
    Route::post('login', 'Api\AuthenticateController@authenticate');

    Route::group(['middleware' => 'jwt.auth'], function(){
        //rota para retorna a sessão pode ter um nome qualquer no caso session, passando o PagSeguro com o nosso metodo getSessionId()
        Route::get('session','Api\PagSeguroController@getSessionId');
        //nossa rota de order
        Route::post('order','Api\PagSeguroController@order');
        //rota get chamada 'products' apontar para 'Api\ProductsController' no metodo index
        Route::get('products', 'Api\ProductsController@index');
        //apontando para product | a action do controller será show criada em app\Http\Api\ProductsController.php
        Route::get('products/{product}', 'Api\ProductsController@show');
    });
});



// Route::get('products', 'Api\ProductsController@index');