<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class MenuExtra extends BaseModel
{
    public $fillable = [
        'menu_id',
        'extra_id',
        'price_id'
    ];


}
