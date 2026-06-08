<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

abstract class BaseModel extends Model
{
    protected $fillable = [];
    public static function getFillableFields()
    {
        return (new static)->fillable;
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
}


?>