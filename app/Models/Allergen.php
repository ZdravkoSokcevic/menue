<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Allergen extends BaseModel
{
    protected $fillable = [
        'name',
        'icon'
    ];

    public function translations(): HasMany
    {
        return $this->HasMany(Translation::class, 'model_id')
            ->where('model', 'category');
    }
}
