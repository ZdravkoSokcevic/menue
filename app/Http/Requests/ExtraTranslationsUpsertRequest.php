<?php

namespace App\Http\Requests;

use App\Models\Company;
use App\Models\Extra;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class ExtraTranslationsUpsertRequest extends FormRequest
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

        // 3. Fetch the Extra being updated from the route parameter (e.g., /extras/{extra})
        $extra = $this->route('id'); 
        if (!$extra instanceof Extra) {
            $extra = Extra::find($extra);
        }

        if (!$extra) {
            return false;
        }

        $targetCompanyId = $extra->company_id;
        if(!$targetCompanyId)
            return false;

        // 4. Role-Based Editing Constraints
        if ($user->role === User::AGENT_ROLE) {
            // Agent can only edit Extras attached to companies they created
            $agentCompanyIds = Company::where('creator_id', $user->id)->pluck('id')->toArray();

            // Must own both the extra's current company AND the target company
            $ownsCurrentCompany = in_array($extra->company_id, $agentCompanyIds);
            $ownsTargetCompany = in_array($targetCompanyId, $agentCompanyIds);

            return $ownsCurrentCompany && $ownsTargetCompany;
        }

        if ($user->role === User::COMPANY_ADMIN_ROLE || $user->role === User::USER_ROLE) {
            // Must belong to the extra's current company AND the target company
            return $extra->company_id === $user->company_id && (int) $targetCompanyId === (int) $user->company_id;
        }

        return false;
    }

    public function prepareForValidation(): void
    {
        // Param validation
        $param = $this->route()->parameters();
        $paramId = [];
        if($param['id'])
            $this->merge([
            'extra_id' => $param['id']
            ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'extra_id'                      => 'required|exists:extras,id',
            'translations.*.name'           => 'required|string|min:2|max:30',
        ];
    }
}
