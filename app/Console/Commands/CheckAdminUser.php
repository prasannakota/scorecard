<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\AdminUser;

class CheckAdminUser extends Command
{
    protected $signature = 'check:admin-user';
    protected $description = 'Check admin user details';

    public function handle()
    {
        $admin = AdminUser::where('email', 'admin@test.com')->first();
        
        if (!$admin) {
            $this->error('Admin user not found in database');
            return;
        }

        $this->info('Admin user details:');
        $this->line('Email: ' . $admin->email);
        $this->line('Role: ' . $admin->role);
        $this->line('Is Admin: ' . ($admin->isAdmin() ? 'Yes' : 'No'));
        $this->line('Is Super Admin: ' . ($admin->isSuperAdmin() ? 'Yes' : 'No'));
        $this->line('Password Hash: ' . $admin->password);
    }
}
