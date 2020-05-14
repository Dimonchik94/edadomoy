@extends('default')

@section('content')
    <div class="main wrapper">
        <div class="container-fluid">

            <h1>{{$category->title}}</h1>

            <div class="category-items">
                @foreach($products as $product)

                    <div data-filter-box="" class="product-card-wrapper">
                        <div data-ss-cart-name="Мега-сет XL" data-ss-cart-price="1290" data-ss-cart-price_format="1 290" data-ss-cart-url="/menu/sets/mega-set-xl" data-ss-cart-picture="/preview/349/189/storage/dishes/37_xl.jpg" data-ss-cart-size="2000 гр." data-ss-cart-visible="true" class="product-card ss-cart-37">

                            <a class="product-photo" href="/shop/products/{{$product->id}}">
                                <img src="{{$product->image}}" alt="Мега-сет XL">
                            </a>
                            <div class="product-text">

                                <p class="product-title"><a href="/shop/products/{{$product->id}}">{{$product->name}}</a></p>
                                <p class="product-info">{{$product->volume}}</p>
                                <div class="composition mCustomScrollbar _mCS_2"><div id="mCSB_2" class="mCustomScrollBox mCS-light mCSB_vertical mCSB_inside" style="max-height: none;" tabindex="0"><div id="mCSB_2_container" class="mCSB_container" style="position:relative; top:0; left:0;" dir="ltr">
                                            {{$product->description}}
                                        </div><div id="mCSB_2_scrollbar_vertical" class="mCSB_scrollTools mCSB_2_scrollbar mCS-light mCSB_scrollTools_vertical" style="display: block;"><div class="mCSB_draggerContainer"><div id="mCSB_2_dragger_vertical" class="mCSB_dragger" style="position: absolute; min-height: 30px; display: block; height: 20px; max-height: 75px; top: 0px;"><div class="mCSB_dragger_bar" style="line-height: 30px;"></div></div><div class="mCSB_draggerRail"></div></div></div></div></div>
                            </div>
                            <div class="product-price">
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
                                    <input type="hidden" value="0" disabled="disabled">
                                    <span class="quantity badge">0</span>
                                    <span onclick="ssCart(event).setID('37').change(1).save('replace');" class="plus">+</span>
                                </div>
                            </div>

                            <div hidden="true">
                                <div data-filter-dataset="tags">
                                    Акция
                                </div>
                                <div data-filter-dataset="products">
                                    Авокадо курица копченая огурец Сыр сливочный тобико Лосось кунжут майонез Лук порей темпура "Снежный" краб-имитация капуста китайская соус "унаги" сыр плавленый
                                </div>
                            </div>
                        </div>
                    </div>

                @endforeach
            </div>
        </div>
    </div>
@endsection
