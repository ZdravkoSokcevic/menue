<?php

namespace App\Http\Controllers\Admin;

class AdminController extends \App\Controllers\Controller
{
    public function home()
    {
        return response()->json(['place' => 'Home']);
    }

}