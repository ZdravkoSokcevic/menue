<?php

namespace App\Http\Controllers;
use App\Http\Requests\CompanyCreateRequest;
use App\Http\Repositories\CompanyRepository;
use App\Http\Requests\CompanyEditRequest;
use App\Http\Responses\EditResponse;
use App\Models\Company;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Responses\CreateResponse;

class CompaniesController extends Controller
{
    private CompanyRepository $companyRepository;
    public function __construct(CompanyRepository $cs)
    {
        $this->companyRepository = $cs;
    }
    public function home()
    {
        return '<html><body>There you go</body></html>';
    }

    public function all() {
        return $this->companyRepository->all();
    }

    public function create(CompanyCreateRequest $r)
    {
        $data = $r->only(Company::getFillableFields());
        $result = $this->companyRepository->create($data);
        // check if created
        if($result instanceof Company) {
            return new CreateResponse(true, ['resource' => 'Company']);
        }else {
            // Error
            if($result['message'])
                return new CreateResponse(false, $result['message']);
            else return new CreateResponse(false);
        }
    }

    public function edit($id, CompanyEditRequest $r): EditResponse
    {
        $data = $r->only(Company::getFillableFields());
        $company = Company::find($id);
        if(!$company)
            return new EditResponse(success: false, custom_message: 'Company not found!');
        else {
            $success = $this->companyRepository->edit($id, $data);
            if($success)
                return new EditResponse(true);
            else return new EditResponse(false, 'Could not edit company!');
        }
    }

    public function delete($id): JsonResponse
    {
        $success = $this->companyRepository->delete($id);
        if($success)
            return response()->json([ 'message'=> 'success' ]);
        else return response()->json([ 'message'=> 'Failed to delete resource' ], 404);
    }
}
