<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Ingridient extends BaseModel
{
    protected $fillable = [
        'name',
        'is_vegan'
    ];
    public function allergens(): BelongsToMany
    {
        return $this->belongsToMany(Allergen::class, 'allergen_ingridients');
    }
}
