<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class License extends Model
{
    protected $fillable = [
        'name',
        'quantity',
        'description',
        'picture',
        'discount',
        'discount_type',
        'type'
    ];
}
