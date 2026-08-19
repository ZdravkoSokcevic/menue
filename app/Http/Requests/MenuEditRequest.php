<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MenuEditRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = auth('sanctum')->user();
        return $user && (
            $user->role === User::ADMIN_ROLE ||
            $user->role === User::COMPANY_ADMIN_ROLE
        );
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
            'id'    => 'required|exists:menus,id',
            'name'=> 'required|string|max:30',
            // it is not mandatory in edit
            'picture' => ['extensions:jpg,png,jpeg'],
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
