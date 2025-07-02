<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Http\Traits\Translatable;

class Categories extends Model
{
    use Translatable;
    protected $fillable = [
        'name',
        'email',
        'phone',
        'location'
    ];

    protected $translatable = [
        'name',
    ];
}
