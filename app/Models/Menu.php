<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends BaseModel
{
    protected $fillable = [
        'name',
        'picture',
        'description',
        'quantity',
        'name',
        'company_id',

    ];
}
