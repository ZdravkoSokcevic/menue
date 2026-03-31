<?php

namespace App\Http\Requests;

use Exception;
use Illuminate\Foundation\Http\FormRequest;
use JsonException;

class IngridientsCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = auth('sanctum')->user();
        return !is_null($user);
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
        return [
            'name' => 'required|string|min:4|max:30',
            'is_vegan' => 'required|numeric|min:0|max:1',
            'allergens' => 'array',
            'allergens.*' => 'exists:allergens,id'
        ];
    }
}
