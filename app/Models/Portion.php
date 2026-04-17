<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Portion extends BaseModel
{
    protected $fillable = [
        'menu_id',
        'currency_id',
        'price_id',
        'portion_size',
        'name'
    ];
}
