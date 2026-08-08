<?php

it('returns a successful response', function () {
    $this->withoutExceptionHandling(); 
    $response = $this->get('/');

    $response->assertStatus(200);
});
