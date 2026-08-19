<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class AllergensEditRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // TODO: Only admin can edit allergen,
        $user = auth('sanctum')->user();
        return $user && 
        (
            $user->role === User::ADMIN_ROLE ||
            $user->role === User::COMPANY_ADMIN_ROLE
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
            'name' => 'required|string|min:4|max:30',
            'icon' => ['extensions:jpg,png,jpeg'],
        ];
    }
}
