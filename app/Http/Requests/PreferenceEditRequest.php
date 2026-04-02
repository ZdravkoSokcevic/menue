<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PreferenceEditRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // only admin can edit preference
        $user = auth('sanctum')->user();
        return $user && $user->role === 'admin';
    }

    public function prepareForValidation(): void
    {
        // Param validation
        $param = $this->route()->parameters();
        $paramId = [];
        foreach($param as $k => $v) {
            if($k == 'id')
                $paramId[$k] = $v;
        }
        $this->merge($paramId);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id'    => 'required|exists:preferences,id',
            'name' => 'required|string|min:4|max:30',
            'description' => 'string|max:255',
        ];
    }
}
