<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Allergen extends BaseModel
{
    protected $fillable = [
        'name',
        'icon'
    ];
}
