<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Session;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $product = Product::find($id);

        return view('product', compact('product'));
    }

    //Добавить товар в корзину
    public function addToCart(Request $request, $id){
        $product = Product::find($id);
        $updateCart = Session::has('cart') ? Session::get('cart') : null;
        $cart = new Cart($updateCart);
        $cart->add($product, $product->id);

        $request->session()->put('cart', $cart);
        return redirect()->back();
    }

    //Добавление существующего товара в корзине
    static public function addItem(Request $request){

        if($request->ajax()) {
            $id = $request['id'];
            $product = Product::find($id);
            $updateCart = Session::get('cart');
            $cart = new Cart($updateCart);
            $cart->addItem($product, $product->id);

            Session::put('cart', $cart);
        }
    }

    //Убрать товар
    static public function removeItem(Request $request){

        if($request->ajax()) {
            $id = $request['id'];
            $product = Product::find($id);
            $updateCart = Session::get('cart');
            $cart = new Cart($updateCart);
            $cart->removeItem($product, $product->id);

            Session::put('cart', $cart);
        }
    }

    //Удалить список товаров
    static public function removeItemsList(Request $request){

        if($request->ajax()) {
            $updateCart = Session::get('cart');
            $cart = new Cart($updateCart);
            $cart->removeItemsList($request['id']);
            Session::put('cart', $cart);
        }
    }

//    public function test(Request $request){
//            if($request->ajax()){
//                    return \Response::json($request['id']);
//            }
//
//    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
