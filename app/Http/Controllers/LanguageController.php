<?php

namespace App\Http\Controllers;

use Illuminate\Support\Collection;
use Illuminate\Http\Request;
use App\Models\Language;
use App\Models\Country;

class LanguageController extends Controller
{
    public function all(): Collection
    {
        return Country::with('language', 'currency')
            ->orderBy('mandatory', 'desc')
            ->orderBy('frequent', 'desc')
            ->orderBy('common_name', 'asc')
            ->get();
    }

    public function getFrontendLanguages(): Collection
    {
        return Country::with('language', 'currency')
            ->orderBy('mandatory', 'desc')
            ->orderBy('frequent', 'desc')
            ->orderBy('common_name', 'asc')
            ->get();
    }
}
