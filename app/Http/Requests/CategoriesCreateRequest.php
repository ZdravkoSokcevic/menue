<?php

namespace App\Http\Requests;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoriesCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {

        $req = request();
        $company_id = $req->input('company_id');
        $user = $req->user();
        // Admin can create without company_id
        if($user->role === User::ADMIN_ROLE)
            return true;
        else if(!$req->filled('company_id'))
            return false;
        else if($user->role === User::AGENT_ROLE && !is_null($company_id)) {
            // validate that company is owned by company_admin
            $companies = Company::where('creator_id', $user->id)->pluck('id')->toArray();
            if(!in_array($company_id, $companies))
                return false;
        }else if($user->role === User::COMPANY_ADMIN_ROLE || $user->role === User::USER_ROLE) {
            if($company_id !== $user->company_id)
                return false;
        }
        // every user can create request
        // only logged in (handled in middeware)
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = request()->user();
        return [
            'name'          => 'string|max:30',
            'category_id'   => Rule::exists('categories', 'id'),
            'picture' => ['required', 'extensions:jpg,png,jpeg'],
            'company_id'    => Rule::when(
                $user->role !== User::ADMIN_ROLE, 
                    ['required', 'exists:companies,id'], 
                    ['nullable', 'exists:companies,id']
            )
        ];
    }

    public function messages(): array
    {
        return [
            'company_id.required' => 'Not a valid company'
        ];
    }
}
