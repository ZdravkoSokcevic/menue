<?php

namespace App\Livewire;

use App\Models\Code;
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

    public function mount($code, Request $r)
    {
        $ip = $r->ip();
        $is_local = (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE) !== false);
        // $reader = new DBReader("IPQualityScore-Reputation-IPV4-Database.ipqs");
        // $ip_record = $reader->Fetch($ip);
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

        $menu = $company->menu()->with(['category', 'extras', 'extras.prices', 'preferences', 'ingridients', 'portions', 'portions.prices'])
            ->whereHas('portions')
            ->get();
            // dd($menu);
        $creator = $company->creator;
        if(!$creator)
            return abort(403);

        $license = $company->license;
        if(!$license)
            return abort(403);

        // Modify 403 response to show page
        // with instructions for user to login to local network
        // eg(scan another qr code)
        // if($license->type == 'basic' && !$is_local)
        //     return response(403);
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
        return view('livewire.home-page')
            ->layout('layouts.app', $data)
            ->with($data);
    }
};