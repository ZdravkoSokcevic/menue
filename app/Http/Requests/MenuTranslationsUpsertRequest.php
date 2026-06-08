<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MenuTranslationsUpsertRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = auth('sanctum')->user();
        return isset($user);
    }

    public function prepareForValidation(): void
    {
        // Param validation
        $param = $this->route()->parameters();
        $paramId = [];
        if($param['id'])
            $this->merge([
            'menu_id' => $param['id']
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
            'menu_id'                       => 'required|exists:menus,id',
            'translations.*.name'           => 'required|string|min:2|max:30',
            'translations.*.description'    => 'required|string|min:5|max:80'
        ];
    }
}
