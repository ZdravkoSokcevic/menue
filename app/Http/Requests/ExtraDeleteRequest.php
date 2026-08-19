<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class ExtraDeleteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = auth('sanctum')->user();
        return !is_null($user) &&
            $user->role === User::ADMIN_ROLE;
    }

    public function prepareForValidation()
    {
        $r = request();
        $this->merge(['id' => $r->route('id')]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
         return [
            'id' => 'required|numeric|exists:extras,id'
        ];
    }
}
