<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Room extends Model
{
    protected $table = 'rooms';
    protected $fillable = [
        'name',
        'company_id'
    ];

    public function code(): HasOne
    {
        return $this->hasOne(Code::class, 'room_id', 'id');//->orderBy('codes.updated_at', 'desc');
    }

    public function company(): HasOne
    {
        return $this->hasOne(Company::class, 'id', 'company_id');
    }
}
