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
			Route::post('/menu/edit/{id}', '\App\Http\Controllers\MenuController@edit');
			Route::get('/menu/delete/{id}', '\App\Http\Controllers\MenuController@delete');

			// Categories routes
			Route::get('/categories', '\App\Http\Controllers\CategoriesController@get');
			Route::post('/categories/create', '\App\Http\Controllers\CategoriesController@insert');
			Route::post('/categories/edit/{id}', '\App\Http\Controllers\CategoriesController@edit');
			Route::get('/categories/delete/{id}', '\App\Http\Controllers\CategoriesController@delete');

			// Licenses rotes
			Route::get('/licenses', '\App\Http\Controllers\LicensesController@get');
			Route::post('/licenses/create', '\App\Http\Controllers\LicensesController@insert');
			Route::post('/licenses/edit/{id}', '\App\Http\Controllers\LicensesController@edit');
			Route::get('/licenses/delete/{id}', '\App\Http\Controllers\LicensesController@delete');

			// Users Licenses
			Route::get('/users', '\App\Http\Controllers\UsersController@all');
			Route::post('/users/create', action: '\App\Http\Controllers\UsersController@create');
			Route::post('/users/edit/{id}', action: '\App\Http\Controllers\UsersController@edit');
			Route::get('/users/delete/{id}', action: '\App\Http\Controllers\UsersController@delete');


			Route::get('/testificate', function() {
				dd('Here in auth');
			});
		});



?>