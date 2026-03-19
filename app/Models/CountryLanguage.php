<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CountryLanguage extends BaseModel
{
    public $fillable = [
        'country_id',
        'language_id'
    ];

    public function country(): HasMany
    {
        return $this->hasMany(\App\Models\Country::class);
    }

    public function language(): HasMany
    {
        return $this->hasMany(\App\Models\Language::class);
    }
}
