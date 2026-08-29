<?php

namespace App\Http\Requests;

use App\Models\Company;
use App\Models\Ingridient;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use JsonException;

class IngridientsEditRequest extends FormRequest
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

        // 3. Fetch the Extra being updated from the route parameter (e.g., /ingridients/{ingridient})
        $ingridient = $this->route('id'); 
        if (!$ingridient instanceof Ingridient) {
            $ingridient = Ingridient::find($ingridient);
        }

        if (!$ingridient) {
            return false;
        }

        // 4. Role-Based Editing Constraints
        if ($user->role === User::AGENT_ROLE) {
            // Agent can only edit Extras attached to companies they created
            $agentCompanyIds = Company::where('creator_id', $user->id)->pluck('id')->toArray();

            // Must own both the extra's current company AND the target company
            $ownsCurrentCompany = in_array($ingridient->company_id, $agentCompanyIds);
            $ownsTargetCompany = in_array($targetCompanyId, $agentCompanyIds);

            return $ownsCurrentCompany && $ownsTargetCompany;
        }

        if ($user->role === User::COMPANY_ADMIN_ROLE || $user->role === User::USER_ROLE) {
            // Must belong to the extra's current company AND the target company
            return $ingridient->company_id === $user->company_id && (int) $targetCompanyId === (int) $user->company_id;
        }

        return false;
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
        $user = $this->user();
        return [
            'id'    => 'required|exists:ingridients,id',
            'name' => 'string|min:4|max:30',
            'is_vegan' => 'numeric|min:0|max:1',
            'allergens' => 'array',
            'allergens.*' => 'exists:allergens,id',
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
