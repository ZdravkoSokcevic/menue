<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Http\Traits\Translatable;

class Company extends Model
{
    use Translatable;
    protected $fillable = [
        'name',
        'email',
        'phone',
        'description',
        'location_lat',
        'location_lng'
    ];

    protected $translatable = [
        'name'
    ];

    public static function getFillableFields() {
        return (new static)->getFillable();
    }
}
