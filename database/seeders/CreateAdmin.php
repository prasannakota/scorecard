<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AdminUser;
use Illuminate\Support\Facades\Hash;

class CreateAdminSeeder extends Seeder
{
    public function run()
    {
        AdminUser::create([
            'name' => 'Admin User',
            'email' => 'admin@kens.com',
            'password' => Hash::make('kspl@1234'),
            'role' => 'admin'
        ]);
    }
}
