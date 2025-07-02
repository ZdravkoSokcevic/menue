<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::view('/admin/login', 'app')->name('login');

Route::get('test', function () {
    return Response::json([ 'message' => 'There you go' ]);
});

Route::view('/{url?}', 'app')
    ->where('url', '^(?!api).*$');

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


// require __DIR__.'/settings.php';
// require __DIR__ . '/api.php';
// require __DIR__.'/auth.php';
