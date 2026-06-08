<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Translation extends BaseModel
{
    // TODO: add created_at and updated_at to every model fillable property
    protected $fillable = [
        'model_class',
        'model_id',
        'key',
        'fallback',
        'value',
        'language_id',
        'created_at',
        'updated_at',
    ];

    public $timestamps = true;

    public function language()
    {
        // TODO: Load only frequent countries
        return $this->belongsTo(Language::class, 'language_id');
    }
}
