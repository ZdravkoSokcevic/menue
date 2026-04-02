<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use JsonException;

class IngridientsEditRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = auth('sanctum')->user();
        return !is_null($user) && (
            $user->role === 'admin' || 
            $user->role === 'agent'
        );
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
            'id'    => 'required|exists:ingridients,id',
            'name' => 'string|min:4|max:30',
            'is_vegan' => 'numeric|min:0|max:1',
            'allergens' => 'array',
            'allergens.*' => 'exists:allergens,id'
        ];
    }
}
