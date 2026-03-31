<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Extra extends BaseModel
{
    public $fillable = [
        'name',
        'description'
    ];
    public function menus(): BelongsToMany
    {
        return $this->belongsToMany(Menu::class, 'menu_extras');
    }

    public function price(): BelongsTo {
        return $this->belongsTo(Price::class);
    }

    public function ingridients(): BelongsToMany 
    {
        return $this->belongsToMany(Ingridient::class);
    }
}
