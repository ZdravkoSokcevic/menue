<?php
namespace App\Builders;
use App\Models\Company;
use Carbon\Carbon;
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
        $user = $request->user();
        if($user->isCompanyAdmin())
        {
            return $this->where('company_id', $user->company_id)->orWhereNull('company_id');
        }else if($user->isAgent()) {
            $companies = Company::where('creator_id', $user->id)->pluck('id')->toArray();
            return $this->where('company_id', 'in', $companies)->orWhereNull('company_id');
        }

        return $this;
    }

    public function matchActiveDatesAndTimes(): self
    {
        $model = $this->getModel();

        $this->with($model->relations);

        // Match discount times
        // and active dates
        $today = Carbon::now()->startOfDay();
        $now = Carbon::parse($today);
        
        $this->where(function ($q) use ($today) {
            $q->where('start_at', '<=', $today);
            $q->orWhereNull('start_at');
        });
        $this->where(function ($q) use ($today) {
            $q->where('end_at', '>=', $today);
            $q->orWhereNull('end_at');
        });

        // Match active days of week
        $this->where(function ($query) {
            $query->where('active_times', '!=', 2)
            ->orWhere(function ($q) {
                $weekMap = [
                    0 => 'su',
                    1 => 'mo',
                    2 => 'tu',
                    3 => 'we',
                    4 => 'th',
                    5 => 'fr',
                    6 => 'sa',
                ];
                $dayOfWeek = Carbon::now()->dayOfWeek;
                $weekDay = $weekMap[$dayOfWeek];
                $q->where('active_times', 2);
                $q->where(function ($q) use ($weekDay) {
                    $q->whereNull('times')
                        ->orWhereRaw('FIND_IN_SET(?, times)', [$weekDay]);
                });
            });
        });

        // Discount times
        $this->where(function ($query) {
            // match discounts time
            $query->where(function ($q) {
                $q->whereNull('time_from')
                    ->whereNull('time_to');
            })
            ->orWhere(function ($q) {
                $q->whereNull('time_from')
                    ->whereNotNull('time_to')
                    ->whereRaw('CURRENT_TIME() <= time_to');
            })
            ->orWhere(function ($q) {
                $q->whereNotNull('time_from')
                    ->whereNull('time_to')
                    ->whereRaw('CURRENT_TIME() >= time_from');
            })
            ->orWhere(function ($q) {
                $q->where(function ($q) {
                    $q->where('time_from', '<=', 'time_to')
                    ->whereRaw("CURRENT_TIME() BETWEEN time_from AND time_to");
                });
            })
            ->orWhere(function ($q) {
                $q->whereNotNull('time_from')
                    ->whereNotNUll('time_to')
                    ->whereColumn('time_from', '>', 'time_to')
                    ->where(function ($q) {
                        $q->whereRaw('CURRENT_TIME() >= time_from')
                        ->orWhereRaw('CURRENT_TIME() <= time_to');
                    });
            });

        });

        return $this;
    }
}

?>