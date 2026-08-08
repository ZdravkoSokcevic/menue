<?php

use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

it('returns a successful response', function () {
    // $this->withoutExceptionHandling(); 
    $response = $this->get('/');

    $response->assertOk();
});


test('guests are redirected to the login page', function () {
    $response = $this->get('/dashboard');
    // dd($response);
    $response->assertRedirect('/login');
    // $response->assertStatus(301);
});

test('authenticated users can visit the dashboard', function () {
    $user = User::where('role', 'superadmin')->first();
    $this->actingAs($user);

    $response = $this->get('/dashboard');
    $response->assertStatus(200);
});