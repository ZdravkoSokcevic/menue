<?php

namespace App\Http\Controllers;

use App\Http\Repositories\AllergensRepository;
use App\Http\Requests\AllergensCreateRequest;
use App\Http\Requests\AllergensEditRequest;
use App\Interfaces\AllergensRepositoryInterface;
use App\Http\Responses\CreateResponse;
use App\Http\Responses\EditResponse;
use App\Models\Allergen;
use App\Services\MediaService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Response;

class AllergensController extends Controller
{
    protected AllergensRepositoryInterface $allergensRepository;
    protected MediaService $mediaService;

    public function __construct(AllergensRepository $ae, MediaService $ms)
    {
        $this->allergensRepository = $ae;
        $this->mediaService = $ms;
    }

    public function all(Request $r): Collection
    {
        return $this->allergensRepository->all($r);
    }

    public function create(AllergensCreateRequest $r)
    {
        $data = $r->only(Allergen::getFillableFields());

        $icon_path = '';
        if($r->file('icon'))
            $icon_path = $this->mediaService->uploadPhoto($r->file('icon'), 'allergens');
        if($icon_path != '') {
            $data['icon'] = $icon_path;
        }

        $success = $this->allergensRepository->store($data);
        if($success)
            return new CreateResponse(true,  [ 'item' => $success ]);
        else return new CreateResponse(false, 'Could not create Allergen!');
    }

    public function edit(AllergensEditRequest $r, $id)
    {
        $data = $r->only(Allergen::getFillableFields());
        $allergen = Allergen::find($id);
        if(!$allergen)
            return new EditResponse(success: false, custom_message: 'Allergen not found!');
        else {
        // only if picture is preset
            if($r->hasFile('icon')) {
                $picture_path = '';
                $old_picture_path = $allergen->icon;
                if($r->file('icon'))
                    $picture_path = $this->mediaService->replacePhoto($old_picture_path, $r->file('icon'), 'allergens');
                if($picture_path != '') {
                    $data['icon'] = $picture_path;
                }
            }

            $allergen = $this->allergensRepository->edit($id, $data);
            if($allergen)
                return new EditResponse(true, ['item' => $allergen]);
            else return new EditResponse(false, 'Could not edit menu!');
        }
    }

    public function delete(Request $r, $id)
    {
        $success = $this->allergensRepository->delete($id);
        if($success)
            return Response::json([ 'message'=> 'success' ]);
        else return Response::json([ 'message'=> 'Failed to delete resource' ], 404);
    }
}
