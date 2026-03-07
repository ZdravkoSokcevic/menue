<?php

namespace App\Models;

use Dotenv\Dotenv;
use Illuminate\Database\Eloquent\Model;
use App\Http\Traits\Translatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use \App\Models\Licence;
use App\Models\CompanyLicences;

class Company extends Model
{
    use Translatable;
    protected $fillable = [
        'name',
        'email',
        'phone',
        'description',
        'location_lat',
        'location_lng',
        'language_id',
        'currency_id',
        'country_id',
        'licence_id',
        'licence_expire',
        // creator_id is id of agent who makes company
        'creator_id'
    ];

    protected $translatable = [
        'name'
    ];

    public function currency(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Currency::class, 'id', 'currency_id');
    }

    public function language(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Language::class, 'language_id', 'id');
    }

    public function licence(): BelongsTo
    {
        return $this->belongsTo(Licence::class);
    }

    // creator_id is id of agent who makes company
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id', 'id');
    }

    public static function getFillableFields() {
        return (new static)->getFillable();
    }

    // review this method
    public function createAdmin(): bool | User
    {
        $email = $this->email;
        $name = $this->name . ' ' . 'Admin';
        $password = config('app.default_pass');


        $user = new User();
        $user->email = $email;
        $user->name = $this->name . ' ' . 'Admin';
        $user->password = Hash::make($password);
        $user->first_name = $this->name;
        $user->last_name = ' ' . 'Admin';
        $user->username = strtolower($this->name . '_' . 'admin');
        $user->role = 'admin';
        $user->company_id = $this->id;
        try {
            $user->save();
            return $user;
        }catch(\Illuminate\Database\QueryException $e) {
            Log::error($e->getMessage());
            return false;
        } catch(\Exception $e) {
            return false;
        }
    }
}
