<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuPreference extends BaseModel
{
    public $fillable = [
        'menu_id',
        'extra_id',
        'price_id'
    ];
}
