<?php

namespace App\Http\Controllers;

use App\Http\Repositories\LicenceRepository;
use App\Http\Requests\LicenseCreateRequest;
use App\Http\Requests\LicenseEditRequest;
use App\Http\Responses\CreateResponse;
use App\Http\Responses\EditResponse;
use App\Interfaces\LicenceRepositoryInterface;
use App\Models\License;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Response;

class LicensesController extends Controller
{
    protected LicenceRepositoryInterface $licenceRepository;
    
    public function __construct(LicenceRepository $lr)
    {
        $this->licenceRepository = $lr;
    }


    public function get(): Collection
    {
        return $this->licenceRepository->all();
    }

    public function insert(LicenseCreateRequest $r): CreateResponse
    {
        $data = $r->only((new License)->getFillable());
        // dd($data);
        $success = $this->licenceRepository->store($data);
        if($success)
            return new CreateResponse(true, 'Created successfully!');
        else return new CreateResponse(false, 'Could not create Menu!');
    }

    public function edit($id, LicenseEditRequest $r): EditResponse
    {
        $data = $r->only((new License)->getFillable());
        $menu = License::find($id);
        if(!$menu)
            return new EditResponse(success: false, custom_message: 'Company not found!');
        else {
            $success = $this->licenceRepository->edit($id, $data);
            if($success)
                return new EditResponse(true);
            else return new EditResponse(false, 'Could not edit menu!');
        }
    }

    public function delete($id)
    {
        $success = $this->licenceRepository->delete($id);
        if($success)
            return Response::json([ 'message'=> 'success' ]);
        else return Response::json([ 'message'=> 'Failed to delete resource' ], 404);
    }

    // Add new license (CompanyLicenses)
    // Edit license 
    // Exhance time in license
    // Delete license
    // Add new field license_valid (permanent ban) or in companies add field ban
}
