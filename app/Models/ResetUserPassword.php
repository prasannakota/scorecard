<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResetUserPassword extends Model
{
    use HasFactory;

    protected $table = 'tbl_user_password_reset';
    protected $primaryKey = 'reset_id';

    public $timestamps = true;

    protected $fillable = [
        'email',
        'token',
        'is_active',
        'is_deleted',
        'created_at',
        'updated_at'
    ];
}
