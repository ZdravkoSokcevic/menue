<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
// use App\Http\Middleware\Authenticate;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            // Register admin and api routes
            Route::middleware('api')->prefix('api')->name('api.')->group(base_path('routes/api.php'));
            // Route::middleware(['api'])
            //     ->prefix('api')
            //     // ->namespace('Api')
            //     ->group(base_path('routes/api.php'));
            Route::middleware([])
                // ->prefix('admin')
                // ->guard('sanctum')
                ->group(base_path('routes/admin.php'));
        }
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class
        ]);

        // DO NOT INCLUDE, MIDDLEWARE INCLUDED MANUALLY
        // $middleware->api(append: [
        //     Authenticate::class
        // ]);
    })
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // dd('here');
        //
    })->create();
