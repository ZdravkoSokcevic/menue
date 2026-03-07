<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MenuRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $req = request();
        $company_id = $req->input('company_id');
        $user = $req->user();
        if($user->role === 'admin')
            return true;
        else if($user->role === 'company_admin' && !is_null($company_id)) {
            // validate that company is owned by company_admin
            
        }
        return false;
    }

    public function prepareForValidation(): void
    {
        $r = request();
        $this->merge([
            "company_id" => $r->input('company_id')
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
