<?php

namespace App\Http\Controllers;

use App\Models\Country;
use Illuminate\Http\Request;

class CountriesController extends Controller
{
    public function all()
    {
        return Country::with(['currencies', 'languages', 'currency', 'language'])->orderByDesc('frequent')->get();
    }
}
