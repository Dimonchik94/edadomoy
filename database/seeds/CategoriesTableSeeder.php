<?php

use Illuminate\Database\Seeder;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            'parent_id' => 0,
            'image' => null,
            'slug' => 'bez-kategorii',
            'title' => 'Без категории'
        ];

        DB::table('categories')->insert($data);
    }
}
