<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Translation extends Model
{
    protected $fillable = [
        'model_class',
        'model_id',
        'key',
        'fallback',
        'value'
    ];
}
