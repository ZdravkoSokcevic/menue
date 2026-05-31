<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Http\Traits\Translatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends BaseModel
{
    use Translatable;
    protected $fillable = [
        'slug',
        'waiter_id',
        'order_received_at',
        'order_processed_at',
        'prep_time',
        // 0 - ordered / unprocessed
        // 1 - ordered / processed
        // 2 - processed / finished
        // 3 - paid
        'status',
        'table_id',
        'created_at',
        'updated_at',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function waiter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'waiter_id', 'id');
    }

    public function table(): BelongsTo {
        return $this->belongsTo(Table::class, 'table_id');
    }

    


}
