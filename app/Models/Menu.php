<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
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
