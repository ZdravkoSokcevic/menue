<?php

use App\Http\Requests\UserCreateRequest;
use App\Models\User;

test('validation for valid data', function () {
    $request = new UserCreateRequest();
    $loggedIn = User::where('role', 'admin')->first();
    dd($loggedIn);
    $data = [
        'name' => 'Test user',
        'fist_name' => 'Test',
        'last_name' => 'User',
        'username' => 'maximini1*',
        'email' => 'maximini@gmail.com',
        'role' => 'superadmin',
        'company_id' => $loggedIn->company_id,
        'password' => 'T3St*11',
    ];

    $request->initialize(
        query: [],
        request: $data
    );

    expect($request->validate($data))->toBeTrue();
});

test('authorization when company admin tries to create superadmin', function () {
    $request = new UserCreateRequest();
    $loggedIn = User::where('role', 'admin')->first();
    $data = [
        'name' => 'Test user',
        'fist_name' => 'Test',
        'last_name' => 'User',
        'username' => 'maximini1*',
        'email' => 'maximini@gmail.com',
        'role' => 'superadmin',
        'company_id' => $loggedIn->company_id,
        'password' => 'T3St*11',
    ];

    $request->setUserResolver(fn () => $loggedIn);

    $request->initialize(
        query: [],
        request: $data
    );

    expect($request->user())->is($loggedIn)->toBeTrue();
    expect($request->input('name'))->toBe('Test user');

    expect($request->authorize())->toBeFalse();

});
