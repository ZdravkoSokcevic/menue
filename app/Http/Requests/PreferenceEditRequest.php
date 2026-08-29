<?php

namespace App\Http\Requests;

use App\Models\Company;
use App\Models\Preference;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PreferenceEditRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = auth('sanctum')->user();
        
        // 1. Admin can edit anything
        if ($user->role === User::ADMIN_ROLE) {
            return true;
        }

        // 2. Non-admins must provide a company_id
        $targetCompanyId = $this->input('company_id');
        if (!$this->filled('company_id')) {
            return false;
        }

        // 3. Fetch the Extra being updated from the route parameter (e.g., /preferences/{preference})
        $preference = $this->route('id'); 
        if (!$preference instanceof Preference) {
            $preference = Preference::find($preference);
        }

        if (!$preference) {
            return false;
        }

        // 4. Role-Based Editing Constraints
        if ($user->role === User::AGENT_ROLE) {
            // Agent can only edit Extras attached to companies they created
            $agentCompanyIds = Company::where('creator_id', $user->id)->pluck('id')->toArray();

            // Must own both the preference's current company AND the target company
            $ownsCurrentCompany = in_array($preference->company_id, $agentCompanyIds);
            $ownsTargetCompany = in_array($targetCompanyId, $agentCompanyIds);

            return $ownsCurrentCompany && $ownsTargetCompany;
        }

        if ($user->role === User::COMPANY_ADMIN_ROLE || $user->role === User::USER_ROLE) {
            // Must belong to the preference's current company AND the target company
            return $preference->company_id === $user->company_id && (int) $targetCompanyId === (int) $user->company_id;
        }

        return false;
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
        $user = $this->user();
        return [
            'id'    => 'required|exists:preferences,id',
            'name' => 'required|string|min:4|max:30',
            'description' => 'string|max:255',
            'company_id'  => Rule::when(
                $user->role !== User::ADMIN_ROLE, 
                    ['required', 'exists:companies,id'], 
                    ['nullable', 'exists:companies,id']
            ),
        ];
    }

    public function messages(): array
    {
        return [
            'company_id.required' => 'Not a valid company',
        ];
    }
}
