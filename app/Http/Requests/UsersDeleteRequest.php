<?php

namespace App\Http\Requests;

use App\Models\Company;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UsersDeleteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // TODO: check role of user that delete,
        // and role of user that is gonna be deleted
        $user = auth('sanctum')->user();
        $userToDelete = User::find(request()->route('id'));

        if(is_null($user) || is_null($userToDelete))
            return false;

        if($user->isAdmin())
            return true;
        if($user->isCompanyAdmin())
            return $user->company_id == $userToDelete->company_id;
        if($user->isAgent()) {
            // detect which company he is trying to join user
            $company = Company::where('creator_id', $user->id)->toArray();
            if(
                in_array(request()->input('company_id'), $company) &&
                request('role') == 'user' 
            ) {
                return true;
            }
            return false;
        }
        if($user->isUser())
            return false;

        return !is_null($user) &&
            $user->role === User::ADMIN_ROLE;
    }

    public function prepareForValidation()
    {
        $r = request();
        $this->merge(['id' => $r->route('id')]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
         return [
            'id' => 'required|numeric|exists:users,id'
        ];
    }
}
