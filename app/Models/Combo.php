<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Combo extends BaseModel
{
    public $fillable = [
        'name',
        'price_id',
        // for manual activation
        'active',
        'active_times',
        'times',
        'time_from',
        'time_to',
        'start_at',
        'end_at',
        'quantity'
    ];

    public $relations = [
        'price',
        'items',
        'items.menu',
        'items.portion',
        'items.portion.prices',
        'items.menu',
        'items.menu.category', 
        'items.menu.extras', 
        'items.menu.extras.prices', 
        'items.menu.preferences', 
        'items.menu.ingridients', 
        'items.menu.portions.prices',
        'items.menu.translations',
        'items.menu.translations.language'
    ];

    public $timestamps = true;

    public function price(): BelongsTo
    {
        return $this->belongsTo(Price::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(ComboItem::class);
    }
}
