<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
                'name' => 'Admin',
                'email' => 'Admin@mail.ru',
                'password' => bcrypt('qweqweqwe'),
                'role' => 'admin'
        ];

        DB::table('users')->insert($data);
    }
}
