<?php

namespace App\Http\Controllers;

use App\Http\Requests\MenuCreateRequest;
use App\Http\Requests\MenuEditRequest;
use App\Http\Requests\MenuRequest;
use App\Http\Responses\CreateResponse;
use App\Http\Responses\EditResponse;
use App\Models\Company;
use App\Models\Menu;
use App\Models\MenuExtra;
use App\Models\Price;
use DB;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use App\Http\Repositories\MenuRepository;
use App\Services\MediaService;
use Illuminate\Support\Facades\Gate;
use Response;
use \App\Interfaces\MenuRepositoryInterface;

class MenuController extends Controller
{
    protected MenuRepositoryInterface $menuRepository;
    protected MediaService $mediaService;

    public function __construct(MenuRepository $me, protected MediaService $ms)
    {
        $this->menuRepository = $me;
        $this->mediaService = $ms;
    }

    /**
     * /
     * @return Collection
     *  Needs to be changed to return tables only for company
     */
    public function get(MenuRequest $r)
    {
        if(Gate::denies('view-menu',  $r)) {
            return response(null,403);
        }
        return $this->menuRepository->all($r);

    }

    public function insert(MenuCreateRequest $r): CreateResponse
    {
        $data = $r->only((new Menu)->getFillable());
        // 1. Insert menu image and return picture path
        // 2. Replace data image path
        $picture_path = '';
        if($r->file('picture'))
            $picture_path = $this->mediaService->uploadPhoto($r->file('picture'), 'menu');
        if($picture_path != '') {
            $data['picture'] = $picture_path;
        }

        $company = Company::find($r->input('company_id'));

        // dd($company->currency);
        
        $success = $this->menuRepository->store($data);
            if($success) {
            // extras and preferences
            if($r->filled('extras') && \count($r->input('extras'))) {
                $data = [];
                // input extra [id: extra_id, price: extra_price]
                foreach($r->input('extras') as $inputExtra) {
                    $price = Price::where('price', $inputExtra['price'])->first();
                    // dd($price);
                    if(!$price) {

                        $priceModelId = Price::insertGetId([
                            'name' => 'extra_price',
                            'price' => $inputExtra['price'],
                            'currency_id' => $company->currency->id
                            ]);
                            if(!$priceModelId) {
                                // error inserting price
                            }
                    }
                        // $price = Price::find($price);
                    $data[] = [
                        'extra_id' => $inputExtra['id'],
                        'price_id' => isset($priceModelId) ? $priceModelId : $price->id,
                        'menu_id'  => $success->id
                    ];
                }

                // insert extras finally
                // not using model methods here, bcs of speed
                MenuExtra::insert($data);
            }

            if($r->filled('preferences') && $r->input('preferences')) {
                $success->preferences()->sync($r->input('preferences'));
            }

            if($r->filled('ingridients') && $r->input('ingridients')) {
                $success->ingridients()->sync($r->input('ingridients'));
            }

            // prices
            if($r->filled('prices') && $r->input('prices')) {
                $success->syncPortions($r);
            }
            $item = Menu::with('portions', 'portions.prices')->where('id', $success->id)->first();


            return new CreateResponse(true,   ['item'=> $item]);
        }
        else return new CreateResponse(false, 'Could not create Menu!');
    }

    public function edit($id, MenuEditRequest $r): EditResponse
    {
        $data = $r->only((new Menu)->getFillable());
        $menu = Menu::find($id);
        if(!$menu)
            return new EditResponse(success: false, custom_message: 'Menu not found!');
        else {
            $company = Company::find($r->input('company_id'));
            // only if picture is preset
            if($r->hasFile('picture')) {
                $picture_path = '';
                $old_picture_path = $menu->picture;
                if($r->file('picture'))
                    $picture_path = $this->mediaService->replacePhoto($old_picture_path, $r->file('picture'), 'menu');
                if($picture_path != '') {
                    $data['picture'] = $picture_path;
                }
            }

            $success = $this->menuRepository->edit($id, $data);
            if($success) {
                if($r->filled('extras') && \count($r->input('extras'))) {
                    // detach all extras
                    $success->extras()->detach();
                    $data = [];
                    // input extra [id: extra_id, price: extra_price]
                    foreach($r->input('extras') as $inputExtra) {
                        $price = Price::where('price', $inputExtra['price'])->first();
                        // dd($price);
                        if(!$price) {

                            $priceModelId = Price::insertGetId([
                                'name' => 'extra_price',
                                'price' => $inputExtra['price'],
                                'currency_id' => $company->currency->id
                                ]);
                                if(!$priceModelId) {
                                    // error inserting price
                                }
                        }else {
                            $priceModelId = $price->id;
                        }
                        $data[] = [
                            'extra_id'  => $inputExtra['id'],
                            'price_id'  => $priceModelId,
                            'menu_id'   => $success->id 
                        ];
                    }

                    // $success->extras()->attach($data);
                    // important here
                    DB::beginTransaction();
                    try {
                        DB::table('menu_extras')->where('menu_id', $success->id)->delete();
                        MenuExtra::insert($data);
                        DB::commit();
                    }catch(\Illuminate\Database\QueryException $e) {
                        DB::rollBack();
                    }
                    
                    // insert extras finally
                    // not using model methods here, bcs of speed
                    // MenuExtra::insert($data);
                }else {
                    $success->extras()->detach();
                }

                // dd($r->input('preferences'));
                if($r->filled('preferences') && $r->input('preferences')) {
                    $success->preferences()->detach();
                    $success->preferences()->sync($r->input('preferences'));
                }else {
                    $success->preferences()->detach();
                }

                if($r->filled('ingridients') && $r->input('ingridients')) {
                     $success->ingridients()->detach();
                    $success->ingridients()->sync($r->input('ingridients'));
                }else {
                    $success->ingridients()->detach();
                }

                // prices
                if($r->filled('prices') && $r->input('prices')) {
                    $success->syncPortions($r);
                }

                // need to return fresh updated row, that's why new query is required
                $updatedRow = Menu::with(['ingridients', 'extras', 'extras.prices', 'portions', 'portions.prices', 'preferences'])
                    ->where('id', $success->id)->first();
                    
                return new EditResponse(true, ['item' => $updatedRow ]);
            } else return new EditResponse(false, 'Could not edit menu!');
        }
    }

    public function delete($id)
    {
        $success = $this->menuRepository->delete($id);
        if($success)
            return Response::json([ 'message'=> 'success' ]);
        else return Response::json([ 'message'=> 'Failed to delete resource' ], 404);
    }
}
