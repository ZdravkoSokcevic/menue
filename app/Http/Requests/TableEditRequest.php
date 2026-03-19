<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TableEditRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $param = $this->route()->parameters('id');
        // $params = 
        $user = auth('sanctum')->user();
        return $user->role === 'admin' || $user->role === 'company_admin'
            ? true
            : false;
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
            'id' => 'required|exists:tables,id',
            'name'          => 'string|max:50|min:2',
            // 'availability'  => 'boolean',
            // 'company_id'    => 'exists:companies,id'
        ];
    }
}
