<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->configureRateLimiting();

        $this->routes(function () {
            // Web routes
            Route::middleware('web')
                ->group(base_path('routes/web.php'));

            // API routes
            Route::middleware(['api'])
                ->prefix('api')
                ->group(function () {
                    require base_path('routes/api.php');
                });
        });
    }

    protected function configureRateLimiting()
    {
        \Illuminate\Support\Facades\RateLimiter::for('api', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Support\Facades\RateLimiter::limit(
                'api',
                60,
                \Illuminate\Support\Facades\Cache::store('file')
            );
        });
    }
}
