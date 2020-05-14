<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'HomePageController@index')->name('homepage');

Auth::routes();

Route::get('/admin', 'HomeController@index')->name('admin');

Route::get('register', function () {
    return redirect('login');
});

//> Adminka
$groupData = [
    'namespace'  => 'Admin',
    'prefix'     => 'admin',
    'middleware' => ['auth']
];
Route::group($groupData, function() {
    //Category
    $methods = [ 'index', 'edit', 'store', 'update', 'create', 'destroy'];
    Route::resource('categories', 'CategoryController')
        ->only($methods)
        ->names('admin.categories');
    Route::resource('products', 'ProductController')
        ->only($methods)
        ->names('admin.products');
});

// View shop
$groupDataShop = [
    'namespace'  => 'Shop',
    'prefix'     => 'shop',
];
Route::group( $groupDataShop, function () {
   $methods = [ 'index', 'show' ];
    Route::resource('categories', 'CategoryController')
        ->only($methods)
        ->names('shop.categories');
    Route::resource('products', 'ProductController')
        ->only($methods)
        ->names('shop.products');
});

//Добавление товара в корзину
Route::get( '/add-to-cart/{id}', 'Shop\ProductController@addToCart' )->name('addToCart');

//Route::get('/ajax','Shop\ProductController@test');
//Route::post('/ajax','Shop\ProductController@test');

//Товары в корзине
Route::post('/addItem', 'Shop\ProductController@addItem');
Route::post('/removeItem', 'Shop\ProductController@removeItem');
Route::post('/removeItemsList', 'Shop\ProductController@removeItemsList');
