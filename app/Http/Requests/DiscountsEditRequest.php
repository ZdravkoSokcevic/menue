<?php

namespace App\Http\Requests;

use App\Models\Company;
use App\Models\Discount;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DiscountsEditRequest extends FormRequest
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

        // 3. Fetch the Extra being updated from the route parameter (e.g., /extras/{extra})
        $discount = $this->route('id');
        if (!$discount instanceof Extra) {
            $discount = Discount::find($discount);
        }

        if (!$discount) {
            return false;
        }

        // 4. Role-Based Editing Constraints
        if ($user->role === User::AGENT_ROLE) {
            // Agent can only edit Extras attached to companies they created
            $agentCompanyIds = Company::where('creator_id', $user->id)->pluck('id')->toArray();

            // Must own both the extra's current company AND the target company
            $ownsCurrentCompany = in_array($discount->company_id, $agentCompanyIds);
            $ownsTargetCompany = in_array($targetCompanyId, $agentCompanyIds);

            return $ownsCurrentCompany && $ownsTargetCompany;
        }

        if ($user->role === User::COMPANY_ADMIN_ROLE || $user->role === User::USER_ROLE) {
            // Must belong to the extra's current company AND the target company
            return $discount->company_id === $user->company_id && (int) $targetCompanyId === (int) $user->company_id;
        }

        return false;
    }

    // JOIN PARAM ID AND VALIDATE IT HERE
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
        $r = request();
        $user = $this->user();
        return [
            'id' => 'required|exists:discounts,id',
            'portion_id' => 'required|exists:portions,id',
            'value' => [
                Rule::when($r->type == 'percent', 'min:0', 'max:100'),
                Rule::when($r->type == 'fixed', 'min:0', 'max:100000'),
            ],
            'active_times' => [
                Rule::in('0', '1', '2')
            ],
            'times.*' => [
                // weekly
                Rule::when(
                    $r->active_times == '2', 
                    Rule::in('mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'),
                    'required'
                )
            ],
            'start_at' => 'date|after_or_equal:today',
            'end_at' => [
                'date',
                'after_or_equal:today',
                'after:starts_at',
            ],
            'is_active' => 'boolean',
             'company_id'    => Rule::when($user->role !== User::ADMIN_ROLE, ['required', 'exists:companies,id'], ['nullable', 'exists:companies,id'])
        ];
    }

    public function messages() {
        $r = request();
        return [
            'value.max' => $r->type === 'percent' 
                ? 'A percentage value cannot exceed 100%.' 
                : 'A fixed amount value cannot exceed 100,000.',
            'company_id.required' => 'Not a valid company',
        ];
    }
}