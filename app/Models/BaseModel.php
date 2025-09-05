<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

abstract class BaseModel extends Model
{
    protected $fillable = [];
    public static function getFillable()
    {
        return (new static)->fillable;
    }
}


?>