<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TableCreateRequest extends FormRequest
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
            'name' => 'required|string',
            // 'company_id' => 'exists:companies,id'
        ];
    }

    public function messages() {
        return [
            'name.max' => 'The name has exceeded the limit',
            // 'company.exists' => 'Company doesn\'t exists',
        ];
    }
}
