<?php

namespace App\Models;

use DB;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Http\Request;
use Log;

class Menu extends BaseModel
{
    protected $fillable = [
        'name',
        'picture',
        'description',
        'quantity',
        'name',
        'is_liquid',
        'company_id',
        'category_id',
        'prep_time',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function category(): HasOne
    {
        return $this->hasOne(Category::class, 'id', 'category_id');
    }

    public function portions(): BelongsToMany
    {
        return $this->belongsToMany(Price::class, 'portions')
            ->withPivot('name')
            ->withPivot('portion_size');
    }

    public function extras(): BelongsToMany
    {
        return $this->belongsToMany(Extra::class, 'menu_extras')
            ->withPivot('id', 'price_id');
    }

    public function preferences(): BelongsToMany
    {
        return $this->belongsToMany(Preference::class, 'menu_preferences')
            ->withPivot('id');
    }

    public function ingridients(): BelongsToMany
    {
        return $this->belongsToMany(Ingridient::class, 'ingridient_menus');
    }

    // Portions / prices
    public function syncPortions(Request $r): bool
    {
        $priceIdsToAttach = [];
        $prices = $r->prices;

        $existingIds = [];
        // foreach($prices as &$portion) 
        // {
        //     Log::info('Portion: ' . json_encode($portion));
        //     // TODO: check if price have an id,
        //     // If price have an id, that means that nothing changes in edit
        //     // otherwise delete all records that doesn't contain that id
        //     if($portion['id']) {
        //         $exists = Portion::where('id', $portion['id'])
        //             ->where('name', $portion['name'])
        //             ->where('price_id', $portion['price_id'])
        //             ->where('portion_size', $portion['portion_size'])
        //             ->where('menu_id', $this->id)
        //             ->get();
        //         if($exists && $exists['count']) {
        //             $existingIds[] = $portion['id'];
        //         }
        //     }
        // }

        // // DELETE ALL PORTIONS PAST THAT ARE NOT PRESET 
        // // id IN NEW REQUEST
        // // ITEMS THAT CONTAINS id MEANS THAT 
        // DB::table('portions')
        //     ->whereNotIn('id', $existingIds)
        //     ->where('menu_id', $this->id)
        //     ->delete();

        // remove all relations on edit
        // safest way
        // }
        $this->portions()->detach();


        foreach($prices as $price) {

            $dbPriceId = null;
            $dbPrice = Price::where([ 
                'price' => $price['price'],
                'name' => $price['name'],
                'currency_id' => $this->company->currency->id,
             ])->first();
            if(!$dbPrice) {
                $dbPriceId = Price::insertGetId([ 
                    'price' => $price['price'],
                    'name' => $price['name'],
                    'currency_id' => $this->company->currency->id
                ]); 
            }else $dbPriceId = $dbPrice->id;
            // TODO: delete all past portions,
            // because we will replace it with new ones
            $portion = Portion::insert([
                'price_id' => $dbPriceId,
                'currency_id' => $this->company->currency->id,
                'menu_id'   => $this->id,
                'name' => $price['name'],
                'portion_size' => $price['portion_size']
            ]);
        }
        return true;
    }
}
