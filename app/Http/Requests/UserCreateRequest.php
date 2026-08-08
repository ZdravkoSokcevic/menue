<?php

namespace App\Http\Requests;

use App\Models\BaseModel;
use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserCreateRequest extends FormRequest
{ 
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = auth('sanctum')->user();
        if($user->isAdmin())
            return true;
        else if($user->isCompanyAdmin()) {
            // detect which role he's trying to create
            // Company admin can only create users in their own company
            $role = request()->input('role');
            if($role == User::ADMIN_ROLE || $role == User::COMPANY_ADMIN_ROLE) {
                return false;
            }
            if(request()->input('company_id') != $user->company_id)
                return false;

            return true;

        }else if($user->isAgent()) {
            // detect which company he is trying to join user
            $company = Company::where('creator_id', $user->id)->toArray();
            if(
                request()->has('company_id') && 
                in_array(request()->input('company_id'), $company) &&
                request('role') == 'user' 
            ) {
                return true;
            }
            return false;
        }

        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'string',
            'first_name' => 'required|string|max:60',
            'last_name' => 'required|string|max:60',
            'username' => 'required|string|min:3|max:60|unique:users,username',
            'email' => 'required|string|email|max:255|unique:users,email',
            // superadmin, admin, agent, user, demo
            'role' => Rule::in(['superadmin', 'admin', 'agent', 'user', 'demo']),
            'company_id' => 'required|exists:companies,id',
            'password' => Password::required()->min(7)->letters()->numbers()->symbols(),
        ];
    }
}
