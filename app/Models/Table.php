<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Table extends BaseModel
{
    protected $table = 'tables';
    protected $fillable = [
        'name',
        'company_id'
    ];

    public function code(): HasOne
    {
        return $this->hasOne(Code::class, 'table_id', 'id');//->orderBy('codes.updated_at', 'desc');
    }

    public function company(): HasOne
    {
        return $this->hasOne(Company::class, 'id', 'company_id');
    }
}
