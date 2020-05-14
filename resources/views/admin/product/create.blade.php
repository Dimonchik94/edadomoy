@extends('layouts.app')

@section('content')

<div class="container">
    <h2>Добавление товара</h2>

    @if($errors->any())
        <div class="alert alert-danger" role="alert">
            <h4>{{$errors->first()}}</h4>
        </div>
    @endif

    @if (\Session::has('success'))
        <div class="alert alert-success">
            <h4>{!! \Session::get('success') !!}</h4>
        </div>
    @endif

<form method="POST" action="{{ route('admin.products.store') }}">
@csrf
    <div class="form-group">
        <span>Выбор категории</span>
        <label for="select" class="text-danger">*</label>
        <select name="select" class="browser-default custom-select">
            @foreach( $categories as $category )
            <option value="{{$category->id}}">{{$category->title}}</option>
            @endforeach
        </select>
    </div>
    <div class="form-group">
        <span>Название</span>
        <label for="name" class="text-danger">*</label>
        <input type="text" class="form-control" name="name" placeholder="Название">
    </div>
    <div class="form-group">
        <span>Ссылка на картинку (\images\...)</span>
        <label for="image_url" class="text-danger">*</label>
        <input type="text" class="form-control" name="image_url" placeholder="Ссылка на картинку">
    </div>
    <div class="form-group">
        <span>Объем</span>
        <label for="volume" class="text-danger">*</label>
        <input type="text" class="form-control" name="volume" placeholder="Объем">
    </div>
    <div class="form-group">
        <textarea class="form-control" name="description" placeholder="Описание"></textarea>
    </div>
    <div class="form-group">
        <span>Цена</span>
        <label for="price" class="text-danger">*</label>
        <input type="number" class="form-control" name="price" placeholder="Цена">
    </div>
    <div class="form-group">
        <input type="number" class="form-control" name="discount_price" placeholder="Цена со скидкой">
    </div>
    <div class="form-group">
        <label for="product_complect_title">По умолчанию - (В комплект входит:)</label>
        <input type="text" class="form-control" name="product_complect_title" placeholder="Заголовок состава комплекта">
    </div>
    <div class="form-group">
        <label for="product_complect_info">По умолчанию - (Нет)</label>
        <input type="text" class="form-control" name="product_complect_info" placeholder="Состав комплекта">
    </div>

    <button type="submit" name="submit" class="btn btn-primary"> Добавить </button>
</form>
</div>

@endsection
