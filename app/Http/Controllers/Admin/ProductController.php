<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = Product::all();

        return view( 'admin.product.index', compact('products') );
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $categories = Category::all()->where('id', '!=', '1');

        return view('admin.product.create', compact('categories'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if (isset($_POST['submit']) && !empty($_POST['select']) && !empty($_POST['name']) && !empty($_POST['image_url']) && !empty($_POST['volume']) && !empty($_POST['price']) ){

            $data = [
                'category_id' => $_POST['select'],
                'name'        => $_POST['name'],
                'image'       => $_POST['image_url'],
                'volume'      => $_POST['volume'],
                'price'       => $_POST['price'],
            ];

            if ( isset($_POST['description']) && !empty($_POST['description']) ){
                $data['description'] = $_POST['description'];
            }

            if ( isset($_POST['discount_price']) && !empty($_POST['discount_price']) ){
                if ( $_POST['discount_price'] >= $_POST['price'] ){
                    return back()->withErrors(['Цена со скидкой не может быть больше или равна базовой', 'The Message']);
                }
                $data['discount_price'] = $_POST['discount_price'];
            }

            if ( isset($_POST['product_complect_title']) && !empty($_POST['product_complect_title']) ){
                $data['product_complect_title'] = $_POST['product_complect_title'];
            }

            if ( isset($_POST['product_complect_info']) && !empty($_POST['product_complect_info']) ){
                $data['product_complect_info'] = $_POST['product_complect_info'];
            }

            DB::table('products')->insert($data);

            return redirect()->back()->with('success', 'Товар добавлен');

        } else {

            return back()->withErrors(['Заполнены не все обязательные поля', 'The Message']);

        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        return view('admin.product.edit');
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
