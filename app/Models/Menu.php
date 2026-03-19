<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Menu extends BaseModel
{
    protected $fillable = [
        'name',
        'picture',
        'description',
        'quantity',
        'name',
        'company_id',
        'category_id'
    ];

    public function category(): HasOne
    {
        return $this->hasOne(Category::class, 'id', 'category_id');
    }
}
