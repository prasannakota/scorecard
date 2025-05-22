<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserAuthController;
use Illuminate\Http\Request;

Route::post('/login', [UserAuthController::class, 'login']);

