<?php

namespace App\Http\Controllers;

use App\Http\Requests\DiscountsCreateRequest;
use App\Http\Requests\DiscountsEditRequest;
use App\Http\Responses\CreateResponse;
use App\Http\Responses\EditResponse;
use App\Http\Repositories\DiscountsRepository;
use App\Interfaces\DiscountsRepositoryInterface;
use App\Models\Discount;
use Gate;
use Illuminate\Http\Request;
use Response;

class DiscountController extends Controller
{
    protected DiscountsRepositoryInterface $discountRepository;
    
    public function __construct(DiscountsRepository $dr)
    {
        $this->discountRepository = $dr;
    }  

    /**
     * /
     * @return Collection
     */
    public function get(Request $r)
    {
        if(Gate::denies('view-discounts',  $r)) {
            return \response(null,403);
        }
        return $this->discountRepository->all($r);
    }

    public function insert(DiscountsCreateRequest $r): CreateResponse
    {
        $data = $r->only((new Discount())->getFillable());

        // dd($data);
        $success = $this->discountRepository->store($data);
        if($success) {
            $item = Discount::with(['menu', 'menu.portions', 'menu.translations', 'menu.translations.language', 'menu.translations.language.countries', 'portions'])->where('id', $success->id)->first();
            return new CreateResponse(true,  [ 'item' => $item ]);
        }
        else return new CreateResponse(false, 'Could not create Discount!');
    }

    public function edit($id, DiscountsEditRequest $r): EditResponse
    {
        $data = $r->only((new Discount())->getFillable());
        $discount = Discount::find($id);
        if(!$discount)
            return new EditResponse(success: false, custom_message: 'Discount not found!');
        else {

            $discount = $this->discountRepository->edit($id, $data);
            if($discount) {
                $d = Discount::with(['menu', 'menu.translations', 'menu.portions', 'menu.translations.language', 'menu.translations.language.countries', 'portions'])->where('id', $discount->id)->first();
                return new EditResponse(true, ['item' => $d]);
            }
            else return new EditResponse(false, 'Could not edit discount!');
        }
    }

    public function delete($id)
    {
        $success = $this->discountRepository->delete($id);
        if($success)
            return Response::json([ 'message'=> 'success' ]);
        else return Response::json([ 'message'=> 'Failed to delete resource' ], 404);
    }
}
