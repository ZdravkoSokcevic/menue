<?php

namespace App\Models;
use App\Builders\BaseEloquentBuilder;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

abstract class BaseModel extends Model
{
    protected $fillable = [];
    public static function getFillableFields()
    {
        return (new static)->fillable;
    }

    /**
     * Override the default Eloquent builder.
     * All models extending MyBaseModel will inherit this builder.
     */
    public function newEloquentBuilder($query): BaseEloquentBuilder
    {
        return new BaseEloquentBuilder($query);
    }

    public static function transformTranslations($data)
    {
        $rawArrayCollection = collect($data->toArray());

        $updatedCollection = $rawArrayCollection->map(function ($item) {
            $grouped = [];
            foreach($item['translations'] as  $translation) {
                if(!isset($translation['language']))
                    continue;
                // dd(($translation->toArray()));
                $code = $translation['language']['code'];

                if (!isset($grouped[$code])) {
                    $grouped[$code] = [
                        'countries' => $translation['language']['countries'],
                        'name' => null,
                        'description' => null,
                    ];
                }

                $grouped[$code][$translation['key']] = $translation['value'];

            }

            $item['translations'] = $grouped;
            return $item;
            });

        return $updatedCollection;
    }

    // TRANSFORM TRANSLATIONS FOR EVERY SINGLE MODEL (OR ->get())
    public function toArray()
    {
        $translations = $this->translations;
        $data = parent::toArray($this);
        if(isset($translations)) {
            // dd($translations);
            $grouped = [];
            foreach($translations as  $translation) {
                if(!isset($translation['language']))
                    continue;
                $code = $translation['language']['code'];
                // dd($translation);

                if (!isset($grouped[$code])) {
                    $grouped[$code] = [
                        'countries' => $translation['language']['countries'],
                        'name' => null,
                        'description' => null,
                    ];
                }

                $grouped[$code][$translation['key']] = $translation['value'];
            }
            // dd('here');
            $data['translations'] = $grouped;
        }
        // $this->setAttribute('translations', $grouped);
        return $data;

    }

    public function matchActiveDatesAndTimes($query) {
        $this->with($this->relations);
        // Match discount times
        // and active dates
        $today = Carbon::now()->startOfDay();
        $now = Carbon::parse($today);
        
        $this->where(function ($q) use ($today) {
            $q->where('start_at', '<=', $today);
            $q->orWhereNull('start_at');
        });
        $this->where(function ($q) use ($today) {
            $q->where('end_at', '>=', $today);
            $q->orWhereNull('end_at');
        });

        // Match active days of week
        $this->where(function ($query) {
            $query->where('active_times', '!=', 2)
            ->orWhere(function ($q) {
                $weekMap = [
                    0 => 'su',
                    1 => 'mo',
                    2 => 'tu',
                    3 => 'we',
                    4 => 'th',
                    5 => 'fr',
                    6 => 'sa',
                ];
                $dayOfWeek = Carbon::now()->dayOfWeek;
                $weekDay = $weekMap[$dayOfWeek];
                $q->where('active_times', 2);
                $q->where(function ($q) use ($weekDay) {
                    $q->whereNull('times')
                        ->orWhereRaw('FIND_IN_SET(?, times)', [$weekDay]);
                });
            });
        });

        // Discount times
        $this->where(function ($query) {
            // match discounts time
            $query->where(function ($q) {
                $q->whereNull('time_from')
                    ->whereNull('time_to');
            })
            ->orWhere(function ($q) {
                $q->whereNull('time_from')
                    ->whereNotNull('time_to')
                    ->whereRaw('CURRENT_TIME() <= time_to');
            })
            ->orWhere(function ($q) {
                $q->whereNotNull('time_from')
                    ->whereNull('time_to')
                    ->whereRaw('CURRENT_TIME() >= time_from');
            })
            ->orWhere(function ($q) {
                $q->where(function ($q) {
                    $q->where('time_from', '<=', 'time_to')
                    ->whereRaw("CURRENT_TIME() BETWEEN time_from AND time_to");
                });
            })
            ->orWhere(function ($q) {
                $q->whereNotNull('time_from')
                    ->whereNotNUll('time_to')
                    ->whereColumn('time_from', '>', 'time_to')
                    ->where(function ($q) {
                        $q->whereRaw('CURRENT_TIME() >= time_from')
                        ->orWhereRaw('CURRENT_TIME() <= time_to');
                    });
            });

        });

        return $this;
    }
}


?>