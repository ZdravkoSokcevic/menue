<?php

namespace App\Http\Controllers;

use Request;

abstract class Controller
{
    // Here's guard for all routes in app,
    // includes api and admin resources
    // Only allowed routes without authentication are home and login
}
