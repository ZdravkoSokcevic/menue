<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComboItem extends Model
{
    public $fillable = [
        'combo_id',
        'menu_id',
        'portion_id',
        'quantity'
    ];

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }

    public function combo(): BelongsTo
    {
        return $this->belongsTo(Combo::class);
    }

    public function portion(): BelongsTo
    {
        return $this->belongsTo(Portion::class);
    }
}
