<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Http\Traits\Translatable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends BaseModel
{
    use Translatable;
    protected $fillable = [
        'name',
        'picture',
        'parent_id',
        'company_id',
        'is_default',
    ];

    protected $translatable = [
        'name',
    ];

    public function translations(): HasMany
    {
        return $this->HasMany(Translation::class, 'model_id')
            ->where('model', 'category');
    }
}
