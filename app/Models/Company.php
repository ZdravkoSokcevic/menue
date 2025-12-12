<?php

namespace App\Models;

use Dotenv\Dotenv;
use Illuminate\Database\Eloquent\Model;
use App\Http\Traits\Translatable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

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
