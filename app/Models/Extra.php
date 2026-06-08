<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Extra extends BaseModel
{
    public $fillable = [
        'name',
        'description'
    ];
    public function menus(): BelongsToMany
    {
        return $this->belongsToMany(Menu::class, 'menu_extras');
    }

    public function prices(): BelongsToMany {
        return $this->belongsToMany(Price::class, 'menu_extras', 'price_id');
    }

    public function ingridients(): BelongsToMany 
    {
        return $this->belongsToMany(Ingridient::class);
    }

    public function translations(): HasMany
    {
        return $this->HasMany(Translation::class, 'model_id')
            ->where('model', 'extra');
    }
}
