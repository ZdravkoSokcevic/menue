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

    public $comboItems;
    public $company;
    public $creator;
    public $table;

    public $room;

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
        
        $tableOrRoom = $record->table;
        // dd($record);
        if(!$tableOrRoom) {
            $tableOrRoom = $record->room;
        }

        if(!$tableOrRoom)
            return abort(403);

        $company = $tableOrRoom->company;
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
        $menuIds = $company->menu()->pluck('id')->toArray();
        $comboIds = Combo::with('items')->whereHas('items.menu', function ($query)use ($menuIds) {
            $query->whereIn('id', $menuIds);
        })->get()->pluck('id')->toArray();
        
        $discounts = Discount::query();

        // Discounts

        $discounts->whereIn('menu_id', $menuIds);
        $discounts->matchActiveDatesAndTimes();

        // Match time in db

        $allDiscounts = $discounts->get();
        // dd($allDiscounts);

        // eliminate menu items that have discount
        $allDiscountIds = $discounts->get()->pluck('menu_id')->toArray();
        // $menu = $menu->whereNotIn('id', $allDiscountIds)->get();
        $menu = $menu->get();

        $combos = (new Combo)->matchActiveDatesAndTimes()->whereIn('id', $comboIds)->get();
        // dd($combos);

        // match combo times


        // dd($discounts);
        $dataForLayout = [
            'company' => $company,
            'menuItems' => $menu,
            'comboItems' => $combos,
            'discountItems' => $allDiscounts,
            'creator' => $creator,
            'table' => $record->table ? $tableOrRoom : null,
            'room' => $record->room ? $tableOrRoom : null,
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