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

		// ORDERS ROUTES
		Route::post('/orders/create', '\App\Http\Controllers\OrderController@create');
		Route::post('/order/edit/:slug', '\App\Http\Controllers\OrderController@edit');

		Route::post('/companies/create', '\App\Http\Controllers\CompaniesController@create');
		Route::post('/companies/edit/{id}', [\App\Http\Controllers\CompaniesController::class , 'edit']);
		Route::middleware(['auth:sanctum'])->group(function($router) {

			// logout
			Route::get('/logout', '\App\Http\Controllers\UsersController@logout');
			
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
			Route::get('/users/me', '\App\Http\Controllers\UsersController@me');

			Route::get('/tables', '\App\Http\Controllers\TablesController@get');
			Route::post('/tables/create', action: '\App\Http\Controllers\TablesController@create');
			Route::post('/tables/edit/{id}', action: '\App\Http\Controllers\TablesController@edit');
			Route::get('/tables/delete/{id}', action: '\App\Http\Controllers\TablesController@delete');
			Route::get('/tables/download_qr/{id}', '\App\Http\Controllers\TablesController@downloadQRCodeImage');

			// Countries
			Route::get('/countries', '\App\Http\Controllers\CountriesController@all');

			// Languages
			Route::get('/languages', '\App\Http\Controllers\LanguageController@all');

			// Allergens
			Route::get('/allergens', '\App\Http\Controllers\AllergensController@all');
			Route::post('/allergens/create', action: '\App\Http\Controllers\AllergensController@create');
			Route::post('/allergens/edit/{id}', action: '\App\Http\Controllers\AllergensController@edit');
			Route::get('/allergens/delete/{id}', action: '\App\Http\Controllers\AllergensController@delete');

			// Ingridients
			Route::get('/ingridients', '\App\Http\Controllers\IngridientsController@all');
			Route::post('/ingridients/create', action: '\App\Http\Controllers\IngridientsController@create');
			Route::post('/ingridients/edit/{id}', action: '\App\Http\Controllers\IngridientsController@edit');
			Route::get('/ingridients/delete/{id}', action: '\App\Http\Controllers\IngridientsController@delete');

			// Extras
			Route::get('/extras', '\App\Http\Controllers\ExtrasController@all');
			Route::post('/extras/create', action: '\App\Http\Controllers\ExtrasController@create');
			Route::post('/extras/edit/{id}', action: '\App\Http\Controllers\ExtrasController@edit');
			Route::get('/extras/delete/{id}', action: '\App\Http\Controllers\ExtrasController@delete');

			// Preferences
			Route::get('/preferences', '\App\Http\Controllers\PreferencesController@all');
			Route::post('/preferences/create', action: '\App\Http\Controllers\PreferencesController@create');
			Route::post('/preferences/edit/{id}', action: '\App\Http\Controllers\PreferencesController@edit');
			Route::get('/preferences/delete/{id}', action: '\App\Http\Controllers\PreferencesController@delete');

			Route::get('/orders', 'App\Http\Controllers\OrderController@get');
			Route::get('/orders/delete/{id}', action: '\App\Http\Controllers\OrderController@delete');
			Route::post('/orders/edit/{id}', action: '\App\Http\Controllers\OrderController@edit');

			Route::post('/translations/menu/{id}', '\App\Http\Controllers\TranslationsController@addOrUpdateMenuTranslations');
			Route::post('/translations/category/{id}', '\App\Http\Controllers\TranslationsController@addOrUpdateCategoryTranslations');
			Route::post('/translations/allergen/{id}', '\App\Http\Controllers\TranslationsController@addOrUpdateAllergenTranslations');
			Route::post('/translations/ingridient/{id}', '\App\Http\Controllers\TranslationsController@addOrUpdateIngridientTranslations');
			Route::post('/translations/extra/{id}', '\App\Http\Controllers\TranslationsController@addOrUpdateExtraTranslations');			
			Route::post('/translations/preference/{id}', '\App\Http\Controllers\TranslationsController@addOrUpdatePreferenceTranslations');


			Route::get('/testificate', function() {
				dd('Here in auth');
			});
		});



?>