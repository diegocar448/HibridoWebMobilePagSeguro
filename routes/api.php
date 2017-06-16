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
    //rota get chamada 'products' apontar para 'Api\ProductsController' no metodo index
    Route::get('products', 'Api\ProductsController@index');
                    //apontando para product | a action do controller será show criada em app\Http\Api\ProductsController.php
    Route::get('products/{product}', 'Api\ProductsController@show');
});

// Route::get('products', 'Api\ProductsController@index');