<?php

namespace App\Models;

use Dotenv\Dotenv;
use Illuminate\Database\Eloquent\Model;
use App\Http\Traits\Translatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use \App\Models\License;
use App\Models\CompanyLicenses;

class Company extends BaseModel
{
    use Translatable;
    protected $fillable = [
        'name',
        'email',
        'phone',
        'logo',
        'description',
        'location_lat',
        'location_lng',
        'street',
        'website',
        'language_id',
        'currency_id',
        'country_id',
        'license_id',
        'license_expire',
        // creator_id is id of agent who makes company
        'creator_id'
    ];

    protected $translatable = [
        // 'name'
    ];

    public function currency(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Currency::class, 'currency_id', 'id');
    }

    public function language(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Language::class, 'language_id', 'id');
    }

    public function license(): BelongsTo
    {
        return $this->belongsTo(License::class);
    }

    // creator_id is id of agent who makes company
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id', 'id');
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id', 'id')->where('users.role', User::ADMIN_ROLE);
    }

    public function menu(): HasMany
    {
        return $this->hasMany(Menu::class);
    }

    public static function getFillableFields() {
        return (new static)->getFillable();
    }

    // review this method
    public function createAdmin(array $data): bool | User
    {
        $email = $this->email;
        $name = isset($data['first_name']) && isset($data['last_name']) ? $data['first_name'] . $data['last_name'] : $this->name . ' ' . 'Admin';
        $first_name = (
            count($data) &&
            array_key_exists('first_name', $data) &&
            !empty($data['first_name'])
        ) 
            ? $data['first_name']
            : $this->name;
        $last_name = (
            count($data) &&
            array_key_exists('last_name', $data) &&
            !empty($data['last_name'])
        ) 
            ? $data['last_name']
            : $this->name;
        $password = (isset($data) && array_key_exists('password', $data) && !empty($data['password'])) ? $data['password'] : config('app.default_pass');


        $user = new User();
        $user->email = $email;
        $user->name = $this->name . ' ' . 'Admin';
        $user->password = Hash::make($password);
        $user->first_name = $first_name;
        $user->last_name = $last_name;
        $user->username = strtolower($this->name . '_' . 'admin');
        $user->role = User::ADMIN_ROLE;
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
