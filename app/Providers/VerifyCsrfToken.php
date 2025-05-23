<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'api/*',
        'api/login',
        'api/test',
        'api/*/*',
        'api/*/*/*'
    ];

    protected function tokensMatch($request)
    {
        if ($request->is('api/*') || $request->is('api/login') || $request->is('api/test')) {
            return true;
        }

        return parent::tokensMatch($request);
    }

    protected function shouldPassThrough($request)
    {
        if ($request->is('api/*') || $request->is('api/login') || $request->is('api/test')) {
            return true;
        }

        return parent::shouldPassThrough($request);
    }
}
