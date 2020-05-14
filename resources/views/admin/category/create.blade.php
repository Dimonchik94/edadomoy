@extends('layouts.app')

@section('content')

<div class="container">
    <h2>Добавление категории</h2>

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

<form method="POST" action="{{ route('admin.categories.store') }}">
@csrf
    <div class="form-group">
        <span>Ссылка на картинку (\images\...)</span>
        <input type="text" class="form-control" name="image_url" placeholder="Ссылка на картинку">
    </div>
    <div class="form-group">
        <input type="text" class="form-control" name="title" placeholder="Название категории">
    </div>

    <button type="submit" name="submit" class="btn btn-primary"> Добавить </button>
</form>
</div>

@endsection
