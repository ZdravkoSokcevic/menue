<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CompanyCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = auth('sanctum')->user();
        return $user && $user->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'          => 'required:string|max:80',
            'email'         => 'required:email|unique:companies,email|unique:users,email',
            'description'   => 'required:text',
            'logo'          => '',
            'phone'         => 'string|max:20',
            'location_lat'  => 'required|between:-90,90',
            'location_lng'  => 'required|between:-180,180',
            'currency_id'   => 'exists:currencies,id',
            'language_id'   => 'exists:languages,id' 
        ];
    }

    public function messages()
    {
        return [
            'name.max' => 'The name has exceeded the limit',
            'location_lat.between' => 'The latitude must be in range between -90 and 90',
            'location_lng.between' => 'The longitude mus be in range between -180 and 180'
        ];
    }
}
