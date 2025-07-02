<?php
	// use Response;
	Route::get('/', function() {
		return Response::json([
			'message' => 'Admin route'
		]);
	});

?>