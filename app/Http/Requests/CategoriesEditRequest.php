<?php

namespace App\Http\Requests;

use App\Models\Category;
use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoriesEditRequest extends FormRequest
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
        $category = $this->route('id'); 
        if (!$category instanceof Category) {
            $category = Category::find($category);
        }

        if (!$category) {
            return false;
        }

        // 4. Role-Based Editing Constraints
        if ($user->role === User::AGENT_ROLE) {
            // Agent can only edit Extras attached to companies they created
            $agentCompanyIds = Company::where('creator_id', $user->id)->pluck('id')->toArray();

            // Must own both the category's current company AND the target company
            $ownsCurrentCompany = in_array($category->company_id, $agentCompanyIds);
            $ownsTargetCompany = in_array($targetCompanyId, $agentCompanyIds);

            return $ownsCurrentCompany && $ownsTargetCompany;
        }

        if ($user->role === User::COMPANY_ADMIN_ROLE || $user->role === User::USER_ROLE) {
            // Must belong to the preference's current company AND the target company
            return $category->company_id === $user->company_id && (int) $targetCompanyId === (int) $user->company_id;
        }

        return false;
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
            'name'          => 'string|max:30',
            'category_id'   => Rule::exists('categories', 'id'),
            'picture' => [ 'extensions:jpg,png,jpeg'],
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
