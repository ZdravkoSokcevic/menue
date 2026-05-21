<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderModification extends BaseModel
{
    protected $table = 'order_modifications';
    protected $fillable = [
        'order_item_id',
        'menu_extras_id',
        'menu_preferences_id'
    ];
    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function extra(): BelongsTo 
    {
        return $this->belongsTo(MenuExtra::class, 'menu_extra_id');
    }

    public function preference() {
        return $this->belongsTo(MenuPreference::class, 'menu_preference_id');
    }
}
