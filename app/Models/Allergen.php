<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Log;
use Storage;

class Allergen extends BaseModel
{
    protected $fillable = [
        'name',
        'icon'
    ];

    public function translations(): HasMany
    {
        return $this->HasMany(Translation::class, 'model_id')
            ->where('model', 'category');
    }

    public static function booted()
    {
        static::deleting(function ($allergen) {
            $icon = $allergen->icon;
            if($icon) {
                $disk = config('filesystems.default') == 'local' ? 'public' : 's3';
                $file_exists = Storage::disk($disk)->exists($icon);
                if($file_exists) {
                    try {
                        Storage::disk($disk)->delete($icon);

                    }catch(err) {
                        Log::error('Cannot delete allergen picture');
                    }
                }
            }
        });
    }
}
