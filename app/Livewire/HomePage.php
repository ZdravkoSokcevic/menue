<?php

namespace App\Livewire;

use App\Models\Code;
use App\Models\Discount;
use Illuminate\Http\Request;
use Livewire\Attributes\Layout;
use Livewire\Component;

class HomePage extends Component
{
    public $menuItems;
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
            ->whereHas('portions')
            ->get();
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
        ])->whereIn('menu_id', $menuIds)->get()->toArray();
        dd($discounts);
        $dataForLayout = [
            'company' => $company,
            'menuItems' => $menu,
            'creator' => $creator,
            'table' => $table,
            'code' => $code
        ];

        $this->code = $code;
        

        foreach ($dataForLayout as $key => $val) {
            $this->$key = $val;
        }
        

        // dd('here');
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