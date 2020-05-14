@extends('default')

@section('content')
    <div class="main wrapper">
        <div class="container-fluid">
            <div class="product-card-wrapper">
                <div class="product-card-img">
                    <div class="product-img"><img src="{{$product->image}}" alt="Мега-сет XL"></div>

                </div>
                <div class="product-card-info">
                    <h1>{{$product->name}}</h1>
                    <p class="weight-quantity"><span class="product-card-weight">{{$product->volume}}</span></p>
                    <div class="product-card-composition">
                        {{$product->description}}
                    </div>

                    <div class="product-complect">
                        <p class="product-complect-title">{{$product->product_complect_title}}</p>
                        <span class="product-complect-info">{{$product->product_complect_info}}</span>
                    </div>
                    <div class="product-card-price">

                        <div data-ss-cart-name="Мега-сет XL" data-ss-cart-price="1290" data-ss-cart-price_format="1 290" data-ss-cart-url="https://sushi-karate.ru/menu/sets/mega-set-xl" data-ss-cart-picture="https://sushi-karate.ru/preview/349/189/storage/dishes/37_xl.jpg" data-ss-cart-size="2000 гр." data-ss-cart-visible="true" class="product-price ss-cart-37">
                            @if($product->discount_price != null)
                                <div class="price new-price">{{$product->discount_price}} ₽
                                    <div class="old-price">{{$product->price}} ₽</div>
                                </div>
                            @else
                                <div class="price new-price">{{$product->price}} ₽</div>
                            @endif

                                <a href="/add-to-cart/{{$product->id}}">
                                    <button style="" onclick="ssCart(event).setID('37').change(1).save('replace');" class="product-btn">Заказать</button>
                                </a>
                            <div style="display: none;" class="product-quantity-btn">
                                <span onclick="ssCart(event).setID('37').change(-1).save('replace');" class="minus">–</span>
                                <input class="quantity" type="text" value="0" disabled="disabled">
                                <span onclick="ssCart(event).setID('37').change(1).save('replace');" class="plus">+</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection
