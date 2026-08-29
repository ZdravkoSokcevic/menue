<?php
namespace App\Builders;
use App\Models\Company;
use Illuminate\Database\Eloquent\Builder;

class BaseEloquentBuilder extends Builder
{
    /**
     * Filters company depending of what user can see
     * Every user which is not admin, cannot see items from other companies,
     * except that ones where company_id is null
     * Making company_id is null makes thing available globally and that ability only admin have.
     * @return void
     */
    public function filterCompanyIfNeeded(): self
    {
        $request = request();
        $user = auth('sanctum')->user();
        if($user->isCompanyAdmin())
        {
            return $this->where('company_id', $user->company_id)->orWhereNull('company_id');
        }else if($user->isAgent()) {
            $companies = Company::where('creator_id', $user->id)->pluck('id')->toArray();
            return $this->where('company_id', 'in', $companies)->orWhereNull('company_id');
        }

        return $this;
    }
}

?>