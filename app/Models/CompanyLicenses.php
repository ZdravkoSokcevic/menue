<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyLicenses extends BaseModel
{
    protected $fillable = [
        'company_id',
        'license_id',
        'valid_until'
    ];
}
