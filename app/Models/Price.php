<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Price extends BaseModel
{
    public $table = 'prices';

    protected $fillable = [
        'name',
        'price',
        'currency_id',
        // // 1 - for menus, 2 - for extras
        // 'type'
    ];
}
