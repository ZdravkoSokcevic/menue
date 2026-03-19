<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class License extends BaseModel
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
    //     return $this->belongsToMany(Company::class, CompanyLicenses::class, 'company_id', 'license_id');
    // }

    public function companies(): HasMany
    {
        return $this->hasMany(Company::class);
    }
}
