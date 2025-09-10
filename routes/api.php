<?php
	// use Response;
	// /api ROUTES
	// namespace App\Http\Controllers;
	// use App\Http\Controllers\CompaniesController;
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

		Route::post('/companies/create', '\App\Http\Controllers\CompaniesController@create');
		Route::post('/companies/edit/{id}', [\App\Http\Controllers\CompaniesController::class , 'edit']);
		Route::middleware(['auth:sanctum'])->group(function($router) {
			
			// Companies routes
			Route::get('/companies/delete/{id}', '\App\Http\Controllers\CompaniesController@delete');
			Route::get('/companies/all', '\App\Http\Controllers\CompaniesController@all');
			
			Route::get('/menu', '\App\Http\Controllers\MenuController@get');
			Route::post('/menu/create', '\App\Http\Controllers\MenuController@insert');

			Route::get('/testificate', function() {
				dd('Here in auth');
			});
		});



?>