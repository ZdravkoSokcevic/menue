<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
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
            'items.*.menu_id' => 'exists:menu,id',
            'items.*.portion_id' => 'exists: portions,id',
            'items.*.quantity' => 'min:1|max:20',
            'items.*.extras.*' => 'exists:menu_extras,id',
            'items.*.preferences.*' => 'exists:menu_preferences,id',
            'items.*.note' => 'string|max:255'
        ];
    }
}
