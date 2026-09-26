<?php

namespace App\Http\Requests;

use App\Models\Company;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CompanySwitchRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = request()->user();
        if($user->isAdminOrDemo()) {
            return true;
        }else if($user->isAgent()) {
            // detect which company he is trying to join user
            $company = Company::where('creator_id', $user->id)->toArray();
            if(
                in_array(request('company_id'), $company)
            ) {
                return true;
            }else {
                return false;
            }
        }

        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'company_id' => 'exists:companies,id'
        ];
    }
}
