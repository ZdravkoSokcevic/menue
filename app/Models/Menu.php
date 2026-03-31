<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
        'category_id',
        'prep_time',
    ];

    public function category(): HasOne
    {
        return $this->hasOne(Category::class, 'id', 'category_id');
    }

    public function portions(): BelongsToMany
    {
        return $this->belongsToMany(Price::class, 'portion')
            ->withPivot('name');
    }

    public function extras(): BelongsToMany
    {
        return $this->belongsToMany(Extra::class, 'menu_extras')
            ->withPivot('id', 'price_id');
    }

    public function preferences(): BelongsToMany
    {
        return $this->belongsToMany(Preference::class, 'menu_preferences')
            ->withPivot('id');
    }

    public function ingridients(): BelongsToMany
    {
        return $this->belongsToMany(Ingridient::class);
    }
}
