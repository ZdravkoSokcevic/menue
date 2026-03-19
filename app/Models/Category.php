<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Http\Traits\Translatable;

class Category extends BaseModel
{
    use Translatable;
    protected $fillable = [
        'name',
        'picture',
        'parent_id',
        'company_id',
        'is_default',
    ];

    protected $translatable = [
        'name',
    ];
}
