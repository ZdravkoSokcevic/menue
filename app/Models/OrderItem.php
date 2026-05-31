<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends BaseModel
{
    public $fillable = [
        'order_id',
        'menu_id',
        'portion_id',
        'quantity',
        'status',
        'prep_time',
        'table_id',
        'note'
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }

    public function extras(): BelongsTo
    {
        return $this->belongsTo(MenuExtra::class);
    }

    public function preferences(): BelongsTo
    {
        return $this->belongsTo(MenuPreference::class);
    }

    public function modifications() {
        return $this->hasMany(OrderModification::class);
    }

    public function table(): BelongsTo {
        return $this->belongsTo(Table::class, 'table_id');
    }
}
