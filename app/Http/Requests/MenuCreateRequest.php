<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MenuCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // TODO: user can also add menu,
        // but just for company that he belongs
        // company 
        $user = auth('sanctum')->user();
        return $user && 
        (
            $user->role === 'admin' ||
            $user->role === 'company_admin'
        );
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'=> 'required|string|max:30',
            'picture' => ['required', 'extensions:jpg,png,jpeg'],
            'description' => 'string|max:255',
            'quantity' => '',
            'company_id' => [
                'nullable', 
                Rule::exists('companies', 'id')],
            'category_id' => [
                'nullable',
                Rule::exists('categories', 'id')
            ],
            'prep_time' => 'required|numeric'
        ];
    }
}
