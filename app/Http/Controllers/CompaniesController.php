<?php

namespace App\Http\Controllers;
use App\Http\Requests\CompanyCreateRequest;
use App\Http\Repositories\CompanyRepository;
use App\Models\Company;

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

    public function store(CompanyCreateRequest $r)
    {
        $data = $r->only(Company::getFillableFields());
        $success = $this->companyRepository->create($data);
        // check if created
        if($success instanceof Company) {
            return new CreateResponse(true, ['resource' => 'Company']);
        }else {
            // Error
            return new CreateResponse(false);
        }
        
    }
}
