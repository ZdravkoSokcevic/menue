<?php

namespace App\Http\Controllers;

use App\Http\Repositories\CombosRepository;
use App\Http\Requests\CombosEditRequest;
use App\Http\Requests\CombosCreateRequest;
use App\Http\Responses\CreateResponse;
use App\Http\Responses\EditResponse;
use App\Interfaces\CombosRepositoryInterface;
use App\Models\Combo;
use App\Models\Price;
use App\Models\Company;
use Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Response;

class CombosController extends Controller
{
    protected CombosRepositoryInterface $combosRepository;

    public function __construct(CombosRepository $cr)
    {
        $this->combosRepository = $cr;
    }

    /**
     * /
     * @return Collection
     */
    public function get(Request $r)
    {
        if(Gate::denies('view-combos',  $r)) {
            return \response(null,403);
        }
        return $this->combosRepository->all($r);
    }

    public function insert(CombosCreateRequest $r): CreateResponse
    {
        $company = Company::find($r->input('company_id'));
        $priceId = Price::insertGetId(['name' => 'Combo Price', 'price' => $r->price, 'currency_id' => $company->currency->id]);
        // dd($priceId);
        $r->merge(['price_id' => $priceId]);
        $data = $r->only((new Combo())->getFillable());
        // dd($r->all());
        $success = $this->combosRepository->store($data);
        if($success) {
            $item = Combo::with([
                'price',
                'items',
                'items.menu', 
                'items.menu.portions', 
                'items.menu.translations', 
                'items.menu.translations.language', 
                'items.menu.translations.language.countries', 
                'items.portion',
                'items.portion.prices',
            ])->where('id', $success->id)->first();
            $r->merge(['combo_id' => $item->id]);
            $itemsInserted = $this->combosRepository->storeItems($r);
            $comboItem = Combo::with([
                'price',
                'items',
                'items.menu', 
                'items.menu.portions', 
                'items.menu.translations', 
                'items.menu.translations.language', 
                'items.menu.translations.language.countries', 
                'items.portion',
                'items.portion.prices',
            ])->where('id', $item->id)->first();
            return new CreateResponse(true,  [ 'item' => $item ]);
        }
        else return new CreateResponse(false, 'Could not create Combo!');
    }

    public function edit($id, CombosEditRequest $r): EditResponse
    {
        $data = $r->only((new Combo())->getFillable());
        $discount = Combo::find($id);
        if(!$discount)
            return new EditResponse(success: false, custom_message: 'Discount not found!');
        else {

            $discount = $this->combosRepository->edit($id, $data);
            if($discount) {
                $d = Combo::with([
                    'price',
                    'items',
                    'items.menu', 
                    'items.menu.portions', 
                    'items.menu.translations', 
                    'items.menu.translations.language', 
                    'items.menu.translations.language.countries', 
                    'items.portion',
                    'items.portion.prices',
                ])->where('id', $discount->id)->first();
                return new EditResponse(true, ['item' => $d]);
            }
            else return new EditResponse(false, 'Could not edit discount!');
        }
    }

    public function delete($id)
    {
        $success = $this->combosRepository->delete($id);
        if($success)
            return Response::json([ 'message'=> 'success' ]);
        else return Response::json([ 'message'=> 'Failed to delete combo' ], 404);
    }
}
