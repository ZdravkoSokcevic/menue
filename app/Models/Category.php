<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Http\Traits\Translatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Log;
use Storage;

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

    public static function booted()
    {
        static::deleting(function ($category) {
            $picture = $category->picture;
            if($picture) {
                $disk = config('filesystems.default') == 'local' ? 'public' : 's3';
                $file_exists = Storage::disk($disk)->exists($picture);
                if($file_exists) {
                    try {
                        Storage::disk($disk)->delete($picture);

                    }catch(err) {
                        Log::error('Cannot delete category picture');
                    }
                }
            }
        });
    }
}
