<?php
namespace App\Http\Controllers;

use App\Http\Requests\UserCreateRequest;
use App\Http\Requests\UserEditRequest;
use App\Http\Requests\UserLoginRequest;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Response;

class UsersController extends Controller
{
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

    public function create(UserCreateRequest $r): JsonResponse
    {
        return Response::json(['message' => 'Here']);
    }

    public function edit(UserEditRequest $r): JsonResponse
    {
        return Response::json(['message' => 'Edited!']);
    }

    public function me(): JsonResponse
    {
        $u = auth('sanctum')->user();
        if(!$u)
            return response(null, 404);
        $user = User::find($u->id);
        return new JsonResponse($user);
    }
}
