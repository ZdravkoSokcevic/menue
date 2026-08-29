<?php

namespace App\Http\Controllers;

use App\Http\Requests\IngridientsCreateRequest;
use App\Http\Requests\IngridientsDeleteRequest;
use App\Http\Requests\IngridientsEditRequest;
use App\Http\Responses\CreateResponse;
use App\Http\Responses\EditResponse;
use App\Interfaces\IngridientsRepositoryInterface;
use App\Models\Ingridient;
use App\Services\MediaService;
use Gate;
use Illuminate\Support\Collection;
use \Illuminate\Http\Request;
use App\Http\Repositories\IngridientsRepository;
use Response;

class IngridientsController extends Controller
{
    public IngridientsRepositoryInterface $ingridientsRepository;
    public MediaService $mediaService;

    public function __construct(IngridientsRepository $ie, MediaService $ms)
    {
        $this->ingridientsRepository = $ie;
        $this->mediaService = $ms;
    }

    public function all(Request $r)
    {
        if(Gate::denies('view-ingridients',  $r)) {
            return Response::json(null, 403);
        }
        return $this->ingridientsRepository->all($r);
    }

    public function create(IngridientsCreateRequest $r): CreateResponse
    {
        $data = $r->only(Ingridient::getFillableFields());
        $success = $this->ingridientsRepository->store($data);
        if($success && ($success instanceof Ingridient)) {
            // Attach allergens
            $allergens = $r->input('allergens');
            if(!is_null($allergens) && count($allergens))
                $success->allergens()->sync($allergens);

            return new CreateResponse(true,  [ 'item' => $success->load('allergens') ]);
        }
        else return new CreateResponse(false, 'Could not create Allergen!');

    }

    public function edit(IngridientsEditRequest $r, $id):EditResponse
    {
        $data = $r->only(Ingridient::getFillableFields());
        $ingridient = Ingridient::find($id);
        if(!$ingridient)
            return new EditResponse(success: false, custom_message: 'Allergen not found!');
        else {
        // only if picture is preset

            $ingridient = $this->ingridientsRepository->edit($id, $data);
            if($ingridient) {
                // Attach allergens
                $allergens = $r->input('allergens');
                if(!is_null($allergens) && count($allergens))
                    $ingridient->allergens()->sync($allergens);
                return new EditResponse(true, ['item' => $ingridient->load('allergens')]);
            }
            else return new EditResponse(false, 'Could not edit menu!');
        }
    }

    public function delete(IngridientsDeleteRequest $r, $id)
    {
        $success = $this->ingridientsRepository->delete($id);
        if($success)
            return Response::json([ 'message'=> 'success' ]);
        else return Response::json([ 'message'=> 'Failed to delete resource' ], 404);
    }

}
