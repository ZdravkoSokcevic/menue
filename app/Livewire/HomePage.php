<?php

namespace App\Livewire;

use App\Models\Code;
use Illuminate\Http\Request;
use Livewire\Component;

class HomePage extends Component
{
    public $menuItems;
    public $company;
    public $creator;
    public $table;

    public $code;
    public function index($code, Request $r)
    {

    }
    public function mount($code, Request $r)
    {
        $ip = $r->ip();
        $is_local = (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE) !== false);
        // $reader = new DBReader("IPQualityScore-Reputation-IPV4-Database.ipqs");
        // $ip_record = $reader->Fetch($ip);
        $record = Code::with('table')->where('code', $code)->first();
        if(!$record)
            return response(403);
        
        $table = $record->table;
        if(!$table) 
            return response(403);
        $company = $table->company;
        if(!$company)
            return response(403);

        $menu = $company->menu()->with('category')->get();

        $creator = $company->creator;
        if(!$creator)
            return response(403);

        $license = $company->license;
        if(!$license)
            return response(403);

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
    }

    public function render()
    {
        return view('livewire.home-page', ['code' => 'code1']);
    }
};