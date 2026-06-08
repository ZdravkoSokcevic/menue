<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ingridient extends BaseModel
{
    protected $table = 'ingridients';
    protected $fillable = [
        'name',
        'is_vegan'
    ];
    public function allergens(): BelongsToMany
    {
        return $this->belongsToMany(Allergen::class, 'allergen_ingridients');
    }

    public function translations(): HasMany
    {
        return $this->HasMany(Translation::class, 'model_id')
            ->where('model', 'ingridient');
    }
}
