<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CountryCurrency extends Model
{
    public $fillable = [
        'country_id',
        'currency_id'
    ];

    public function country(): HasMany
    {
        return $this->hasMany(\App\Models\Country::class, 'id', 'country_id');
    }

    public function currency(): HasMany
    {
        return $this->hasMany(\App\Models\Currency::class, 'id', 'country_id');
    }


}
