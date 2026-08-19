<?php
namespace App\Http\Controllers;

use App\Http\Requests\UserCreateRequest;
use App\Http\Requests\UserEditRequest;
use App\Http\Requests\UserLoginRequest;
use App\Http\Requests\UsersDeleteRequest;
use App\Http\Responses\CreateResponse;
use App\Http\Responses\EditResponse;
use App\Interfaces\UsersRepositoryInterface;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Response;
use App\Http\Repositories\UsersRepository;

class UsersController extends Controller
{
    private UsersRepositoryInterface $userRepository;
    public function __construct(UsersRepository $ue) {
        $this->userRepository = $ue;
    }
    public function login(UserLoginRequest $r) 
    {

        $data = $r->only(['username', 'password']);
        $user = User::where('username', 'like', '%' . $data['username'] . '%')
        ->orWhere('email', $data['username'])
        ->first();
        
        if(!$user ||  $user == null)
            return response()->json(['message' => 'Unauthorized'], 401);
    
        if(Hash::check($data['password'], $user->password)) {
            $token = $user->createToken($user->username.'-AuthToken')->plainTextToken;
            return response()->json([
                'access_token' => $token,
                'user' => $user
            ]);
        }else return response(['message' => 'Unauthorized!'], 401);
        
    }

    public function logout(Request $request)
    {
        // Revoke the specific token used in the current request
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function all()
    {
        $user = auth('sanctum')->user();
        // TODO: superadmin can obtain all users
        // company_admin only users that belongs to the his company
        // agent can see users only that belong to his companies
        // dd($user);
        $users = User::where('id', '!=' , $user->id);

        if($user->isAdmin())
            return $users->get();
        else if($user->isCompanyAdmin()) {
            return $users->where('company_id', $user->company_id)->get();
            // return $users->where();
        }
        else if($user->isAgent()) {
            $companies = Company::where('creator_id', $user->id)->get();
            return $users->whereIn('company_id', $companies)->get();
        }else {
            // normal user
            return new Response('Not found', 404);
        }

    }

    public function create(UserCreateRequest $r): CreateResponse
    {
        $data = $r->only(User::getFillableFields());
        // dd($data);   
        $data['password'] = Hash::make($r->input('password'));
        $data['company_id'] = $r->input('company_id');
        if(!$r->filled('name')) {
            $data['name'] = $r->input('first_name') . ' ' . $r->input('last_name');
        }
        $result = $this->userRepository->create($data);
        if($result) {
            // dd($result);
            $item = User::find($result->id);
            return new CreateResponse(true, ['resource'=>'user', 'item' => $item]);
        } else {
            if($result['message'])
                return new CreateResponse(false, $result['message']);
            else return new CreateResponse(false); 
        }
    }

    public function edit(UserEditRequest $r, $id): EditResponse
    {
        $data = $r->only(User::getFillableFields());
        // dd($data);   
        if($r->filled('password'))
            $data['password'] = Hash::make($r->input('password'));
        if($r->filled('company_id'))
            $data['company_id'] = $r->input('company_id');

        $result = $this->userRepository->edit($id, $data);
        if($result) {
            $item = User::find($result->id);
            return new EditResponse(true, ['resource'=>'user', 'item' => $item]);
        } else {
            if($result['message'])
                return new EditResponse(false, $result['message']);
            else return new EditResponse(false); 
        }
        return Response::json(['message' => 'Edited!']);
    }

    public function delete(UsersDeleteRequest $r): JsonResponse
    {
        $success = $this->userRepository->delete($r->input('id'));
        if($success)
            return response()->json([ 'message'=> 'success' ]);
        else return response()->json([ 'message'=> 'Failed to delete resource' ], 404);
    }

    public function me(): JsonResponse
    {
        $u = auth('sanctum')->user();
        if(!$u)
            return Response::json(null, 404);
        $user = User::find($u->id);
        return new JsonResponse($user);
    }
}
