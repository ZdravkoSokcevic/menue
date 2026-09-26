<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class MenuRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $req = request();
        $user = $req->user();
        $company_id = $user->getActiveCompanyId();
        $user = $req->user();
        if($user->role === User::ADMIN_ROLE)
            return true;
        else if($user->role === 'company_admin' && !is_null($company_id)) {
            // validate that company is owned by company_admin
            
        }
        return false;
    }

    public function prepareForValidation(): void
    {
        $r = request();
        $user = $r->user();
        $this->merge([
            "company_id" => $user->getActiveCompanyId()
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'company_id' => 'exists:companies,id'
        ];
    }
}
