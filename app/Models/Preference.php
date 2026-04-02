<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Preference extends BaseModel
{
    public $fillable = [
        'name',
        'description'  
    ];

    public function menus(): BelongsToMany
    {
        return $this->belongsToMany(Menu::class, 'menu_preferences');
    }
}
