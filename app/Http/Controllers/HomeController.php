<?php

namespace App\Http\Controllers;


use App\Livewire\DetailsPage;
use App\Models\Code;
use Illuminate\Http\Request;
use IPQualityScore\DB\DBReader;
use App\Livewire\HomePage;

class HomeController extends Controller
{
    public function index(Request $r, $code=null)
    {
        // $ip = $r->ip();
        // $is_local = (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE) !== false);
        // // $reader = new DBReader("IPQualityScore-Reputation-IPV4-Database.ipqs");
        // // $ip_record = $reader->Fetch($ip);
        // $record = Code::where('code', $code)->first();
       
        // if(!$record)
        //     return response(403);

        // $table = $record->table;
        // if(!$table) 
        //     return response(403);
        // $company = $table->company;
        // if(!$company)
        //     return response(403);

        // $menu = $company->menu;

        // $creator = $company->creator;
        // if(!$creator)
        //     return response(403);

        // $license = $company->license;
        // if(!$license)
        //     return response(403);

        // // Modify 403 response to show page
        // // with instructions for user to login to local network
        // // eg(scan another qr code)
        // // if($license->type == 'basic' && !$is_local)
        // //     return response(403);
        // $dataForLayout = [
        //     'company' => $company,
        //     'menuItems' => $menu,
        //     'creator' => $creator,
        //     'table' => $table,
        //     'code' => $code
        // ];

        // return view('livewire.home-page', $dataForLayout);

        // // Action for different types of licenses

        // // return redirect()->route('homepage', [
        // //     'menuItems' => $menu,
        // //     'company'   => $company
        // // ]);
        // // return redirect()->to('homepage', 200);


        // dd([
        //     'record' => $record->toArray(),
        //     'table' => $table->toArray(),
        //     'company' => $company->toArray(),
        //     'creator' => $company->creator->toArray(),
        //     'license' => $license->toArray(),
        //     'menu'  => $company->menu->toArray(),
        //     'ip'    => $ip,
        //     'is_local' => $is_local
        // ]);

    }
}
