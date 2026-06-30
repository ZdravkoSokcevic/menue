<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Discount extends Model
{
    public $fillable = [
        'menu_id',
        'portion_id',
        'value',
        'type',
        // Get active times - 
        // 0) null for all the time
        // 1) every day in specific time
        // 2) weekly at specific times
        'active_times',
        // for every day - value daily
        // for weekly, ex- mo,tu,fr
        'times',
        'time_from',
        'time_to',
        'start_at',
        'end_at',
        'is_active',
    ];

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }

    public function portion(): BelongsTo
    {
        return $this->belongsTo(Portion::class);
    }

    public function portions(): BelongsTo
    {
        return $this->belongsTo(Portion::class, 'portion_id');
    }
}
