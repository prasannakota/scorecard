<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\AdminUser;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class TestAdminAuth extends Command
{
    protected $signature = 'test:admin-auth';
    protected $description = 'Test admin authentication';

    public function handle()
    {
        try {
            // Test database connection
            DB::connection()->getPdo();
            $this->info('Database connection successful');

            // Test admin user
            $user = AdminUser::where('email', 'testadmin@test.com')->first();
            
            if (!$user) {
                $this->info('Creating test admin user');
                $user = AdminUser::create([
                    'email' => 'testadmin@test.com',
                    'password' => Hash::make('test1234'),
                    'role' => 'super_admin'
                ]);
            }

            $this->info('Admin user details:');
            $this->info('Email: ' . $user->email);
            $this->info('Role: ' . $user->role);
            $this->info('Is Admin: ' . ($user->isAdmin() ? 'Yes' : 'No'));
            $this->info('Password Hash: ' . $user->password);

            // Test password verification
            $passwordCheck = Hash::check('test1234', $user->password);
            $this->info('Password check result: ' . ($passwordCheck ? 'Success' : 'Failed'));

        } catch (\Exception $e) {
            $this->error('Error: ' . $e->getMessage());
            $this->error('Trace: ' . $e->getTraceAsString());
        }
    }
}
