<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExtraTranslationsUpsertRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = auth('sanctum')->user();
        return $user && 
        (
            $user->role === 'admin' ||
            $user->role === 'company_admin'
        );
    }

    public function prepareForValidation(): void
    {
        // Param validation
        $param = $this->route()->parameters();
        $paramId = [];
        if($param['id'])
            $this->merge([
            'extra_id' => $param['id']
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
            'extra_id'                      => 'required|exists:extras,id',
            'translations.*.name'           => 'required|string|min:2|max:30',
        ];
    }
}
