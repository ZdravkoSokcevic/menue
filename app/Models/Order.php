<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Http\Traits\Translatable;

class Order extends Model
{
    use Translatable;
    protected $fillable = [
        'menu_id',
        'table_id',
        'quantity',
        'special_occasion'
    ];
}
