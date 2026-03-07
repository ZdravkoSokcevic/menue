<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyLicences extends Model
{
    protected $fillable = [
        'company_id',
        'licence_id',
        'valid_until'
    ];
}
