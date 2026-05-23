<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Portion extends BaseModel
{
    protected $fillable = [
        'menu_id',
        'currency_id',
        'price_id',
        'portion_size',
        'name'
    ];

    public function prices(): BelongsTo
    {
        return $this->belongsTo(Price::class, 'price_id');
    }
}
