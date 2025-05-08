<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\AdminUser;
use Illuminate\Support\Facades\Hash;

class UpdateAdminPassword extends Command
{
    protected $signature = 'admin:update-password {email} {password}';
    protected $description = 'Update admin user password with proper bcrypt hash';

    public function handle()
    {
        $email = $this->argument('email');
        $password = $this->argument('password');

        $user = AdminUser::where('email', $email)->first();

        if (!$user) {
            $this->error("Admin user with email {$email} not found");
            return 1;
        }

        $hashedPassword = Hash::make($password);
        $user->password = $hashedPassword;
        $user->save();

        $this->info("Password updated successfully for {$email}");
        $this->info("New password hash: {$hashedPassword}");
        return 0;
    }
}
