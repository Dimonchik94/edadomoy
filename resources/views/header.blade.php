<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <title>Круглосуточная доставка японской кухни - Sushi Ninja</title>
    <meta content="Круглосуточная бесплатная доставка суши и роллов на дом." name="description">
    <meta name="viewport" content="width=device-width">
    <meta name="format-detection" content="telephone=no">


    <meta name="csrf-token" content="{{ csrf_token() }}">
{{--    <meta name="csrf-token" content="3dc55e1b0b1ba4398b644a213d597bb7">--}}

    <link rel="icon" href="\favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="\assets\site\css\app.css">
    <link href="\assets\site\css\noty.min.css" rel="stylesheet">
    <link href="\assets\site\css\themes\bootstrap-v4.css" rel="stylesheet">
    <link rel="stylesheet" href="\assets\site\css\custom.css">
    <link rel="stylesheet" href="\css\cart-css.css">
</head>
<body>



{{--<button class="plus-item" onclick="getMessage()">+</button>--}}


<header>
    <div class="container-fluid">
        <div class="header">
            <div class="logo-box">
                <a href="/" title="Sushi Ninja"><img src="\assets\site\decor\logo.png" alt="Sushi Ninja"></a>
                <h2><span style="font-family: Pacifico; font-size: 24px;">Sushi Ninja</span></h2>
            </div>

            <div class="promo-wrapper">
                <div class="promo-title">
                    Доставим за 80 минут или ролл в подарок</div>
                <div class="promo-delivery"><span>Доставка от 1490 руб</span></div>
                <div class="delivery-popup">
                    <p class="popup-title">Минимальный заказ - 1490 рублей!</p>

                    <ul class="delivery-popup-text">
                        <li>Доставка заказа осуществляется бесплатно и насколько это возможно - максимально быстро.</li>
                        <li>В стоимость минимального заказа учитываются абсолютно все позиции из нашего меню.</li>
                        <li>Для доставки заказа используются качественные термосумки, которые обеспечивают сохранение необходимой температуры изготовленных блюд.</li>
                    </ul>

                    <p><small>Служба доставки работает круглосуточно.</small></p>
                    <p><small>Доставка заказа в течение 40-80 минут.</small></p>
                    <div class="close"></div>
                </div>
                <div class="promo-time"><span>Работаем 24/7</span></div>
                <div id="promo-time-text" class="time-popup">
                    <p class="popup-title">Мы работаем круглосуточно!</p>
                    <ul class="delivery-popup-text">
                        <li>На наших кухнях работает несколько смен мастеров, что повышает эффективность в целом. Наши клиенты всегда получают заказ вовремя.</li>
                        <li>Десятки курьеров как на личных, так и на фирменных автомобилях. В случае чего, они всегда вас оповестят или уточнят место доставки.</li>
                    </ul>
                    <div class="close"></div>
                </div>
            </div>
        </div>
    </div>
</header>
<div class="nav">
    <div class="container-fluid">
        <ul>
            <li><a href="/menu">Меню</a></li>
            <li><a href="deals.html">Акции</a></li>
            <li><a href="delivery.html">Доставка и оплата</a></li>
            <li><a href="company.html">О компании</a></li>
            <li><a href="contacts.html">Контакты</a></li>
            <li id="ss-cart-load-mini-static"></li>
            <li id="ss-cart-el-mini-static">
                <div class="order-popup-parent">
                    <a href="#" class="order-nav">
                        @if(Session::get('cart'))
                        {{Session::get('cart')->totalPrice}} ₽
                        @else
                        0 ₽
                        @endif
                    </a>
                </div>
            </li>
            <li id="cart-info">
                @if(Session::get('cart'))
                <ul id="cart-products-list">
                    @foreach(Session::get('cart')->items as $item)
                    <li class="cart-product-item">
                        <button type="submit" class="minus-item" value="{{$item['item_id']}}">-</button>
                        <img class="product-img-min" src="{{$item['img']}}">

{{--                        <form class="plus-item-button" action="#">--}}
{{--                            @csrf--}}
{{--                            <button type="submit" class="plus-item" value="{{$item['item_id']}}">+</button>--}}
{{--                        </form>--}}
                        <button type="submit" class="plus-item" value="{{$item['item_id']}}">+</button>
                        <p>
                            <input class="one-item-price" type="hidden" value="{{$item['one_item_price']}}">
                            <span>{{$item['one_item_price']}} ₽</span>
                            <span class="qty">{{$item['qty']}}</span>
                        </p>
                        <a class="remove-items-list">
                            <input class="item_id" type="hidden" value="{{$item['item_id']}}">
                            <img class="remove-img" src="\images\cart\remove.png">
                        </a>
                    </li>
                    @endforeach
                </ul>
                    <button id="pay-btn">Перейти к оплате</button>
                @endif
            </li>
        </ul>
        <div id="ss-cart-load-mini-list"></div>
        <div class="drop-menu">
            <div class="drop-btn"><img src="\assets\site\icon\menu.png" alt="Menu"></div>
            <div class="drop-menu-list">
                <ul id="drop">
                    <li><a href="/menu">Меню</a></li>
                    <li><a href="deals.html">Акции</a></li>
                    <li><a href="delivery.html">Доставка и оплата</a></li>
                    <li><a href="company.html">О компании</a></li>
                    <li><a href="contacts.html">Контакты</a></li>
                </ul>
                <div class="close"></div>
            </div>
            <div class="order-drop-parent">
                <a class="order-nav" href="#"></a>
                <div id="ss-cart-load-mobile-mini-static1"></div>
            </div>
        </div>
    </div>
</div>

