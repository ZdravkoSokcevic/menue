<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExtraCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
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
        return [
            'name' => 'required|string|min:4|max:30',
            'description' => 'string|max:255',
        ];
    }
}
