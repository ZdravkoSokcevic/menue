<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Country extends BaseModel
{
    public $fillable = [
        'common_name',
        'name',
        'flag',
        'flag_png',
        'flag_svg',
        'language_id',
        'currency_id',
        'region',
        'tld',
        'frequent'
    ];

    // We take first currency as main one
    public function currency(): BelongsTo
    {
        return $this->belongsTo( \App\Models\Currency::class);
    }

    public function currencies():BelongsToMany
    {
        return $this->belongsToMany( \App\Models\Currency::class,\App\Models\CountryCurrency::class);
    } 

    public function language(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Language::class);
    }

    public function languages(): BelongsToMany
    {
        return $this->belongsToMany(\App\Models\Language::class, \App\Models\CountryLanguage::class);
    }


    
}
