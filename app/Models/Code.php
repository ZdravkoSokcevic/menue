<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Code extends BaseModel
{
    protected $table = 'codes';
    protected $fillable = [
        'code',
        'qr_code',
        'table_id'
    ];

    public function table(): BelongsTo
    {
        return $this->belongsTo(Table::class);
    }
}
