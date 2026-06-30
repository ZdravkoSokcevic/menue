<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Combo extends Model
{
    public $fillable = [
        'name',
        'price_id',
        // for manual activation
        'active',
        'active_times',
        'time_from',
        'time_to',
        'start_at',
        'end_at',
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
