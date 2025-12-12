<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Http\Traits\Translatable;

class Category extends Model
{
    use Translatable;
    protected $fillable = [
        'name',
        'picture',
        'parent_id'
    ];

    protected $translatable = [
        'name',
    ];
}
