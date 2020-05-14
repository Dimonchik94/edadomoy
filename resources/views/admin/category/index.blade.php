@extends('layouts.app')

@section('content')

    <div class="container">
    <a class="btn btn-primary" href="{{ route('admin.categories.create') }}"> Добавить </a>

        @if (\Session::has('success'))
            <div class="alert alert-success">
                <h4>{!! \Session::get('success') !!}</h4>
            </div>
        @endif

     <ul class="nav flex-column" style="margin-top: 20px;">
@foreach( $categories as $category )
    <li class="nav-item" style="background-color: #d5e6ff; display: flex; justify-content: space-between; margin-top: 10px;">
        <a class="nav-link" href="{{route('admin.categories.edit', $category->id)}}">
            {{$category->title}}
        </a>

        <form method="post" action="{{ route('admin.categories.destroy', $category->id) }}">
            @csrf
            @method('DELETE')
            <input class="btn btn-danger" type="submit" value="Удалить категорию">
        </form>

    </li>
@endforeach
    </ul>

    </div>
@endsection

