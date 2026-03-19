<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Language extends BaseModel
{
    public $fillable = [
        'name',
        'code',
        'country_id'
    ];

   public function countries(): BelongsToMany
    {
        return $this->belongsToMany( \App\Models\Country::class, \App\Models\CountryLanguage::class, 'language_id', 'country_id');
    }


}
