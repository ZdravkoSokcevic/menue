<?php

namespace App\Http\Controllers;
use App\Http\Requests\CompanyCreateRequest;
use App\Http\Repositories\CompanyRepository;
use App\Http\Requests\CompanyEditRequest;
use App\Http\Responses\EditResponse;
use App\Interfaces\CompanyRepositoryInterface;
use App\Models\Company;

use App\Models\User;
use App\Services\MediaService;
use Gate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Responses\CreateResponse;
use Illuminate\Support\Facades\Auth;
use Log;
use Response;

class CompaniesController extends Controller
{
    private CompanyRepositoryInterface $companyRepository;
    private MediaService $mediaService;
    public function __construct(CompanyRepository $cs, MediaService $ms)
    {
        $this->companyRepository = $cs;
        $this->mediaService = $ms;
    }
    public function home()
    {
        return '<html><body>There you go</body></html>';
    }

    public function all(Request $r) {
        if(Gate::denies('view-companies',  $r)) {
            return Response::json(null, 403);
        }
        return $this->companyRepository->all();
    }

    public function create(CompanyCreateRequest $r)
    {
        $data = $r->only(Company::getFillableFields());
        $picture_path = '';
        if($r->file('logo'))
            $picture_path = $this->mediaService->uploadPhoto($r->file('logo'), 'companies');
        if($picture_path != '') {
            $data['logo'] = $picture_path;
        }

        // add creator of company
        $data['creator_id'] = auth('sanctum')->user()->id;



        $result = $this->companyRepository->create($data);

        // check if created
        if($result instanceof Company) {
            // Create an admin user for current company
            $user = $result->createAdmin(array_diff_assoc( $r->admin, (new User)->getFillable()));
            Log::info(json_encode([ 'user:companies:create'=>$user]));
            Log::info(json_encode([ 'company:companies:create'=>$result]));
            // create default categories
            $this->companyRepository->createDefaultCategories($result);
            if($user == false) {
                $result->delete();
                return new CreateResponse(false, 'Could not create company, admin creation failed');
            }else  {
                $item = Company::with('creator', 'currency', 'language', 'license', 'admin')->where('id', $result->id)->first();
                return new CreateResponse(true, ['resource' => 'Company', 'item' => $item]);
            }
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
            $success = $this->companyRepository->edit($id, data: $data);
            if($success)
                return new EditResponse(true, ['message' => 'Company edited successfully', 'item' => $success]);
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
