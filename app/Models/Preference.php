<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Preference extends BaseModel
{
    public $fillable = [
        'name',
        'description'  
    ];

    public function menus(): BelongsToMany
    {
        return $this->belongsToMany(Menu::class, 'menu_preferences');
    }

    public function translations(): HasMany
    {
        return $this->HasMany(Translation::class, 'model_id')
            ->where('model', 'preference');
    }
}
