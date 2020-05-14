<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class HomePageController extends Controller
{
    public function index(){

        $categories = Category::all()->where('id', '!=', '1');

        return view('index', compact('categories'));
    }
}
