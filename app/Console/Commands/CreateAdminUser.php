<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\AdminUser;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    protected $signature = 'admin:create';
    protected $description = 'Create a new admin user';

    public function handle()
    {
        $email = 'admin1@test.com';
        $password = 'kspl@1234';
        $name = 'Admin User';
        $role = 'super_admin';

        $admin = AdminUser::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => $role
        ]);

        if ($admin) {
            $this->info('Admin user created successfully!');
            $this->line('Email: ' . $email);
            $this->line('Password: ' . $password);
            $this->line('Role: ' . $role);
        } else {
            $this->error('Failed to create admin user');
        }
    }
}
