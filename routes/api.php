<?php
	// use Response;
	// /api ROUTES
	// namespace App\Http\Controllers;
	use App\Http\Controllers\CompaniesController;
	use App\Http\Controllers\UsersController;
	// use Route;
		Route::get('/strange', function() {
			return Response::json([
				'message' => 'strange'
			]);
		});
		Route::get('/', function () {
			return Response::json([
				'message' => 'Api routes'
			]);
		});

		Route::post('/login', '\App\Http\Controllers\UsersController@login');

		Route::get('/test_free', function() {
			dd('Middleware free route');
		});

		Route::post('/companies/create', CompaniesController::class . '@store');
		Route::middleware(['auth:sanctum'])->group(function($router) {

			// Companies routes
			Route::post('/companies/edit/:id', 'CompaniesController@edit');
			Route::post('/companies/delete/:id', 'CompaniesController@delete');
			Route::get('/companies/all', 'CompaniesController@all');

			Route::get('/testificate', function() {
				dd('Here in auth');
			});
		});



?>