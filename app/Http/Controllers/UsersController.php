<?php
namespace App\Http\Controllers;

use App\Http\Requests\UserLoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Hash;
use Illuminate\Support\Facades\Auth;

class UsersController extends Controller
{
    public function login(UserLoginRequest $r) 
    {
        $data = $r->only(['username', 'password']);
        $user = User::where('username', 'like', '%' . $data['username'] . '%')
        ->orWhere('email', $data['username'])
        ->first();
        
        if(!$user)
        response()->json(['message' => 'Unauthorized'], 401);
    
        if(Hash::check($data['password'], $user->password)) {
            $token = $user->createToken($user->username.'-AuthToken')->plainTextToken;
            return response()->json([
                'access_token' => $token,
                'user' => $user
            ]);
        }else return response('Unauthorized!', 401);
        
    }
}
