<?php

use App\Http\Controllers\LanguageController;
use App\Http\Controllers\OrderController;
use App\Livewire\OrdersPage;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Livewire\HomePage;
use App\Livewire\DetailsPage;
use App\Livewire\CartPage;

Route::view('/admin/login', 'app')->name('login');

Route::get('test', function () {
    return Response::json([ 'message' => 'There you go' ]);
});



Route::get('/', HomePage::class)->name('homepage');

Route::get('/details', DetailsPage::class);
Route::get('/details/{id}/{code}', DetailsPage::class);

// not working with livewire
// Route::get('/shorts/{code}', '\App\Http\Controllers\HomeController@index');
Route::get('/shorts/{code}', HomePage::class);
Route::get('/cart/{code}', CartPage::class);
Route::get('/cart', CartPage::class);

// Route::get('/order/create', [OrderController::class, 'create']);

Route::view('/order/{slug}', OrdersPage::class);

Route::get('/languages', [LanguageController::class, 'getFrontendLanguages']);


Route::view('/{url?}', 'app')
    ->where('url', '^(?!api|shorts|details).*$');
    // ->except([ 'storage' ]);

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


// require __DIR__.'/settings.php';
// require __DIR__ . '/api.php';
// require __DIR__.'/auth.php';
