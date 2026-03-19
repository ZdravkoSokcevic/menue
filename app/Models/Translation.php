<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Translation extends BaseModel
{
    protected $fillable = [
        'model_class',
        'model_id',
        'key',
        'fallback',
        'value'
    ];
}
