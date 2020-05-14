<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    public $items = null;
    public $totalQty = 0;
    public $totalPrice = 0;

    public function __construct($updateCart)
    {
        if ($updateCart){
            $this->items = $updateCart->items;
            $this->totalQty = $updateCart->totalQty;
            $this->totalPrice = $updateCart->totalPrice;
        }
    }

//    Добавление нового товара в корзину
    public function add($item, $id){
        $storedItem = [ 'item_id' => $item->id, 'qty' => 0, 'price' => $item->price, 'one_item_price' => $item->price, 'img' => $item->image, 'item' => $item ];

        if ( $this->items ) {
            if (array_key_exists($id, $this->items)){
                $storedItem = $this->items[$id];
            }
        }

        $storedItem['item_id'] = $item->id;
        $storedItem['qty']++;

        if ( isset($item->discount_price) && $item->discount_price != null ){
            $storedItem['price'] = $item->discount_price * $storedItem['qty'];
            $this->totalPrice += $item->discount_price;
            $storedItem['one_item_price'] = $item->discount_price;
        } else {
            $storedItem['price'] = $item->price * $storedItem['qty'];
            $this->totalPrice += $item->price;
            $storedItem['one_item_price'] = $item->price;
        }
        $this->items[$id] = $storedItem;
        $this->totalQty++;
    }

    //Добавить товар в корзине
    public function addItem($item, $id){

        $this->items[$id]['qty'] ++;
        $this->items[$id]['price'] += $this->items[$id]['one_item_price'];
        $this->totalPrice += $this->items[$id]['one_item_price'];
        $this->totalQty++;
    }

    //Убрать товар в корзине
    public function removeItem($item, $id){

        if($this->items[$id]['qty'] > 1) {
            $this->items[$id]['qty']--;
            $this->items[$id]['price'] -= $this->items[$id]['one_item_price'];
            $this->totalPrice -= $this->items[$id]['one_item_price'];
            $this->totalQty--;
        }
    }

    //Удалить список товаров
    public function removeItemsList($id){

        if(array_key_exists($id, $this->items)) {
            $this->totalQty -= $this->items[$id]['qty'];
            $this->totalPrice -= $this->items[$id]['price'];
            unset($this->items[$id]);
        }
    }
}
