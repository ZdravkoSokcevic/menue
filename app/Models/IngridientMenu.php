<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IngridientMenu extends BaseModel
{
    protected $table = 'ingridient_menus';
    protected $fillable = [
        'menu_id',
        'ingridient_id'  
    ];
}
