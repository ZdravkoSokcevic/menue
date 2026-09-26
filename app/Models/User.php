<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    public const ADMIN_ROLE = 'superadmin';
    public const COMPANY_ADMIN_ROLE = 'admin';
    public const AGENT_ROLE = 'agent';
    public const USER_ROLE = 'user'; 

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'username',
        'email',
        // superadmin, admin, agent, user, demo
        'role',
        'company_id',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin() {
        return $this->role === 'superadmin';
    }

    public function isAdminOrDemo() {
        return $this->role === 'superadmin' ||
            $this->role === 'demo';
    }

    public function isNotAdmin() {
        return $this->role !== 'superadmin';
    }

    public function isNotAdminOrDemo() {
        return $this->role !== 'superadmin' &&
            $this->role !== 'demo';
    }

    public function isAgent(): bool {
        return $this->role === 'agent';
    }

    public function isCompanyAdmin(): bool {
        return $this->role === 'admin';
    }

    public function isUser(): bool {
        return $this->role === 'user';
    }

    public function isDemo(): bool {
        return $this->role === 'demo';
    }

    // public function (): HasMany
    // {
    //     return $this->hasMany(Company::class, 'id', 'creator_id');
    // }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'id', 'company_id');
    }

    public function companies(): HasMany
    {
        return $this->hasMany(Company::class, 'creator_id', 'id');
    }

    public static function getFillableFields()
    {
        return (new static)->getFillable();
    }

    public function getActiveCompanyId(): ?int
    {
        // If they have authorization to switch, check their bearer token for an active company context override
        if (($this->isAdmin() || $this->isAgent()) && $this->currentAccessToken()) {
            foreach ($this->currentAccessToken()->abilities as $ability) {
                if (str_starts_with($ability, 'company-context:')) {
                    return (int) str_replace('company-context:', '', $ability);
                }
            }
        }

        // Normal users and Company Admins will ALWAYS hit this line, returning their absolute assigned company
        return $this->company_id; 
    }
}
