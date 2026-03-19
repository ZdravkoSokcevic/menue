<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Currency extends BaseModel
{
    public $fillable = [
        'name',
        'code',
        'symbol',
        'country_id'
    ];

    public function countries(): BelongsToMany
    {
        return $this->belongsToMany( \App\Models\Country::class, \App\Models\CountryCurrency::class);
    }
}
