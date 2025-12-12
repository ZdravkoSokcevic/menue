<?php
namespace App\Http\Controllers;

use App\Http\Requests\UserCreateRequest;
use App\Http\Requests\UserEditRequest;
use App\Http\Requests\UserLoginRequest;
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

    public function all()
    {
        if(Auth::user()->role != 'admin')
            return Response('Not found', 404);

        return User::all();
    }

    public function create(UserCreateRequest $r): JsonResponse
    {
        return Response::json(['message' => 'Here']);
    }

    public function edit(UserEditRequest $r): JsonResponse
    {
        return Response::json(['message' => 'Edited!']);
    }
}
