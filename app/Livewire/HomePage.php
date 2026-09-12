<?php

namespace App\Livewire;

use App\Models\Code;
use App\Models\Combo;
use App\Models\Discount;
use Illuminate\Http\Request;
use Livewire\Attributes\Layout;
use Livewire\Component;
use Carbon\Carbon;

class HomePage extends Component
{
    public $menuItems;

    public $discountItems;
    public $company;
    public $creator;
    public $table;

    public $code;

    public function mount($code)
    {
        $r = request();
        $ip = $r->ip();
        $is_local = (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE) !== false);
        // $reader = new DBReader("IPQualityScore-Reputation-IPV4-Database.ipqs");
        // $ip_record = $reader->Fetch($ip);
        // $code = $r->input('code');
        // dd($code);
        if(!$code)
            return redirect()->route('webpage');
        $record = Code::with('table')->where('code', $code)->first();
        if(!$record)
            return abort(403);
        
        $table = $record->table;
        // dd($record);
        if(!$table) 
            return abort(403);
        $company = $table->company;
        if(!$company)
            return abort(403);


        $menu = $company->menu()->with([
            'category', 
            'extras', 
            'extras.prices', 
            'preferences', 
            'ingridients', 
            'portions', 
            'portions.prices',
            'translations',
            'translations.language'
            ])
            ->whereHas('portions');
            // dd($menu);
        $creator = $company->creator;
        if(!$creator)
            return abort(403);

        $license = $company->license;
        // dd($menu);
        // if(!$license)
        //     return abort(403);

        // Modify 403 response to show page
        // with instructions for user to login to local network
        // eg(scan another qr code)
        // if($license->type == 'basic' && !$is_local)
        //     return response(403);

        // Discounts
        $menuIds = $company->menu()->pluck('id')->toArray();
        // TODO: Match active times and active days
        $discounts = Discount::with([
            'portion',
            'portion.prices',
            'menu.category', 
            'menu.extras', 
            'menu.extras.prices', 
            'menu.preferences', 
            'menu.ingridients', 
            'menu.portions.prices',
            'menu.translations',
            'menu.translations.language'
        ])->whereIn('menu_id', $menuIds);
        // Match discount times
        // and active dates
        $today = Carbon::now()->startOfDay();
        $now = Carbon::parse($today);
        
        $discounts->where(function ($q) use ($today) {
            $q->where('start_at', '<=', $today);
            $q->orWhereNull('start_at');
        });
        $discounts->where(function ($q) use ($today) {
            $q->where('end_at', '>=', $today);
            $q->orWhereNull('end_at');
        });

        // Match active days of week
        $discounts->where(function ($query) {
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
        $discounts->where(function ($query) {
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

        // Match time in db

        $allDiscounts = $discounts->get();

        // eliminate menu items that have discount
        $allDiscountIds = $discounts->get()->pluck('menu_id')->toArray();
        $menu = $menu->whereNotIn('id', $allDiscountIds)->get();


        // Combos
        $combos = Combo::with([
            'items',
            'items.menu',
            'items.portion',
            'items.portion.prices',
            'items.menu',
            'items.menu.category', 
            'items.menu.extras', 
            'items.menu.extras.prices', 
            'items.menu.preferences', 
            'items.menu.ingridients', 
            'items.menu.portions.prices',
            'items.menu.translations',
            'items.menu.translations.language'
        ])->whereIn('items.menu_id', $menuIds);

        $combos->where(function ($q) use ($today) {
            $q->where('start_at', '<=', $today);
            $q->orWhereNull('start_at');
        });
        $combos->where(function ($q) use ($today) {
            $q->where('end_at', '>=', $today);
            $q->orWhereNull('end_at');
        });

        $combos->where(function ($q) {
            $now = Carbon::now();
            $q->whereRaw("CURRENT_TIME() BETWEEN time_from AND time_to");
        });

        // match combo times


        // dd($discounts);
        $dataForLayout = [
            'company' => $company,
            'menuItems' => $menu,
            'discountItems' => $allDiscounts,
            'creator' => $creator,
            'table' => $table,
            'code' => $code
        ];

        $this->code = $code;
        

        foreach ($dataForLayout as $key => $val) {
            $this->$key = $val;
        }
        

        // dd($dataForLayout['discountItems']);
    }

    public function render()
    {
        $data = [];
        if($this->code != '')
            $data['code'] = $this->code;
        if($this->menuItems)
            $data['menuItems'] = $this->menuItems;
        $data['page'] = 'home';
        return view('livewire.frontapp')
            ->layout('layouts.frontapp', $data)
            ->with($data);
    }
};