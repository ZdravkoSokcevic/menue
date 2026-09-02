<?php

namespace App\Http\Controllers;
use App\Http\Requests\PreferenceCreateRequest;
use App\Http\Requests\PreferenceDeleteRequest;
use App\Http\Requests\PreferenceEditRequest;
use App\Http\Responses\CreateResponse;
use App\Http\Responses\EditResponse;
use Gate;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
use App\Interfaces\PreferencesRepositoryInterface;
use App\Http\Repositories\PreferencesRepository;
use App\Models\Preference;
use Response;


class PreferencesController extends Controller
{
    private PreferencesRepositoryInterface $preferencesRepository;
    public function __construct(PreferencesRepository $pr)
    {
        $this->preferencesRepository = $pr;
    }

    public function all(Request $r): JsonResponse | Collection
    {
        if(Gate::denies('view-preferences',  $r)) {
            return Response::json(null, 403);
        }
        return $this->preferencesRepository->all();
    }

    public function create(PreferenceCreateRequest $r): CreateResponse
    {
        $data = $r->only(Preference::getFillableFields());
        $success = $this->preferencesRepository->create($data);
        if($success && ($success instanceof Preference)) {
            return new CreateResponse(true,  [ 'item' => $success ]);
        }
        else return new CreateResponse(false, 'Could not create Preference!');
    }

    public function edit(PreferenceEditRequest $r, $id): EditResponse
    {
        $data = $r->only(Preference::getFillableFields());
        $preference = Preference::find($id);
        if(!$preference)
            return new EditResponse(success: false, custom_message: 'Preference not found!');
        else {
        // only if picture is preset

            $preference = $this->preferencesRepository->edit($id, $data);
            if($preference) {
                return new EditResponse(true, ['item' => $preference]);
            }
            else return new EditResponse(false, 'Could not edit preference!');
        }
    }

    public function delete(PreferenceDeleteRequest $r, $id)
    {
        $success = $this->preferencesRepository->delete($id);
        if($success)
            return Response::json([ 'message'=> 'success' ]);
        else return Response::json([ 'message'=> 'Failed to delete resource' ], 404);
    }
}
