<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Licence extends Model
{
    protected $fillable = [
        'name',
        'quantity',
        'description',
        'picture',
        'discount',
        'discount_type',
        // type can be basic, premium, enterprise, superadmin, and demo
        'type'
    ];

    // public function companies(): BelongsToMany
    // {
    //     return $this->belongsToMany(Company::class, CompanyLicences::class, 'company_id', 'licence_id');
    // }

    public function companies(): HasMany
    {
        return $this->hasMany(Company::class);
    }
}
