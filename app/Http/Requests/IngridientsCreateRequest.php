<?php

namespace App\Http\Requests;

use App\Models\Company;
use App\Models\User;
use Exception;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use JsonException;

class IngridientsCreateRequest extends FormRequest
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

    public function prepareForValidation()
    {
        // to be able to make sure that allergens is array,
        // even if we send as string for ex "[2,3]"
        // will be just [2,3]
        try {
            $r = request();
            $allergens = $r->input('allergens');
            if(is_string($allergens)) {
                $allergens = json_decode($allergens);
                $this->merge([
                    'allergens' => $allergens
                ]);
            }
        }catch(JsonException $e) {
            $this->merge(['allergens' => '']);
        }
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
            'name' => 'required|string|min:4|max:30',
            'is_vegan' => 'required|numeric|min:0|max:1',
            'allergens' => 'array',
            'allergens.*' => 'exists:allergens,id',
            'company_id'    => Rule::when($user->role !== User::ADMIN_ROLE, ['required', 'exists:companies,id'], ['nullable', 'exists:companies,id'])
        ];
    }

    public function messages(): array
    {
        return [
            'company_id.required' => 'Not a valid company'
        ];
    }
}
