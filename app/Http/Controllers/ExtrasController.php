<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExtraCreateRequest;
use App\Http\Requests\ExtraDeleteRequest;
use App\Http\Requests\ExtraEditRequest;
use App\Http\Responses\CreateResponse;
use App\Http\Responses\EditResponse;
use App\Interfaces\ExtrasRepositoryInterface;
use Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use App\Models\Extra;
use App\Http\Repositories\ExtrasRepository;
use Response;


class ExtrasController extends Controller
{
    public ExtrasRepositoryInterface $extrasRepository;

    public function __construct(ExtrasRepository $er)
    {
        $this->extrasRepository = $er;
    }

    public function all(Request $r): mixed
    {
        if(Gate::denies('view-extras',  $r)) {
            return Response::json(null, 403);
        }
        return $this->extrasRepository->all();
    }

    public function create(ExtraCreateRequest $r): CreateResponse
    {
        $data = $r->only(Extra::getFillableFields());
        $success = $this->extrasRepository->create($data);
        if($success && ($success instanceof Extra)) {
            return new CreateResponse(true,  [ 'item' => $success ]);
        }
        else return new CreateResponse(false, 'Could not create Extra!');
    }

    public function edit(ExtraEditRequest $r, $id): EditResponse
    {
        $data = $r->only(Extra::getFillableFields());
        $extra = Extra::find($id);
        if(!$extra)
            return new EditResponse(success: false, custom_message: 'Extra not found!');
        else {
        // only if picture is preset

            $extra = $this->extrasRepository->edit($id, $data);
            if($extra) {
                return new EditResponse(true, ['item' => $extra]);
            }
            else return new EditResponse(false, 'Could not edit extra!');
        }
    }

    public function delete(ExtraDeleteRequest $r, $id)
    {
        $success = $this->extrasRepository->delete($id);
        if($success)
            return Response::json([ 'message'=> 'success' ]);
        else return Response::json([ 'message'=> 'Failed to delete resource' ], 404);
    }
}
