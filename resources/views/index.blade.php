@extends('default')

@section('content')

    <!-- .main - для всех, .wrapper - фон-рисунок -->
    <div class="main wrapper">
        <div class="container-fluid">

            <div class="home-category">
                <h2 class="title">свежая и разнообразная кухня</h2>
                <div class="row category-list">
            @foreach( $categories as $category )
                <div class="col category-list__item">
                    <a class="category-list__link" href="/shop/categories/{{$category->id}}">
                        <h3>{{$category->title}}</h3>
                        <span class="category-list__image">
										<img src="{{$category->image}}" alt="{{$category->title}}">
									</span>
                    </a>
                </div>
            @endforeach
                </div>
            </div>

            <div class="home-advantages">
                <h2 class="title">лучшее качество и сервис</h2>
                <div class="row">
                    <div class="col-12 col-sm-6 col-lg-3 advantage">
                        <img src="storage\advantage\home\adv-warranty.png" alt="Гарантия качества">
                        <h4>Гарантия качества</h4>
                        <p>Исключительно свежие ингредиенты, прошедшие контроль качества</p>
                    </div>
                    <div class="col-12 col-sm-6 col-lg-3 advantage">
                        <img src="storage\advantage\home\adv-delivery.png" alt="Доставляем вовремя">
                        <h4>Доставляем вовремя</h4>
                        <p>Подарим что-то вкусное,
                            <br> если опоздали</p>
                    </div>
                    <div class="col-12 col-sm-6 col-lg-3 advantage">
                        <img src="storage\advantage\home\adv-security.png" alt="Гарантия безопасности">
                        <h4>Гарантия безопасности</h4>
                        <p>Сотрудники имеют медсправки
                            <br>и соблюдают санитарные правила</p>
                    </div>
                    <div class="col-12 col-sm-6 col-lg-3 advantage">
                        <img src="storage\advantage\home\adv-cam.png" alt="Веб-камеры на кухнях">
                        <h4>Веб-камеры на кухнях</h4>
                        <p>Мы следим за порядком на кухне и качеством приготовления вашего заказа</p>
                    </div>
                </div>
                <a class="btn-inverse" href="company.html">Подробнее о компании</a>
            </div>
            <!-- /.home-advantages -->
        </div>

@endsection
