<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class AdminUser extends Authenticatable
{
    use Notifiable;

    protected $table = 'admin_users';
    protected $guard = 'admin';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function getAuthPassword()
    {
        return $this->password;
    }

    public function getAuthIdentifier()
    {
        return $this->id;
    }

    public function isAdmin()
    {
        $role = $this->role ?? '';
        \Log::info('Admin role check', [
            'user_id' => $this->id,
            'email' => $this->email,
            'role' => $role,
            'is_admin' => in_array($role, ['admin', 'super_admin'])
        ]);
        
        return in_array($role, ['admin', 'super_admin']);
    }

    public function isSuperAdmin()
    {
        $role = $this->role ?? '';
        \Log::info('Super admin role check', [
            'user_id' => $this->id,
            'email' => $this->email,
            'role' => $role,
            'is_super_admin' => $role === 'super_admin'
        ]);
        
        return $role === 'super_admin';
    }

    public function setPasswordAttribute($value)
    {
        if (!Hash::needsRehash($value)) {
            $this->attributes['password'] = $value;
        } else {
            $this->attributes['password'] = Hash::make($value);
        }
    }
}
