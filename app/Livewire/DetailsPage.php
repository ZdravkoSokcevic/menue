<?php

namespace App\Livewire;

use App\Models\Code;
use App\Models\Combo;
use App\Models\Discount;
use App\Models\Menu;
use Illuminate\Http\Request;
use Livewire\Attributes\Layout;
use Livewire\Component;
#[Layout('layouts.frontapp')]
class DetailsPage extends Component
{
    public $item;
    public $code;

    public $company;

    public $page;

    // Type references to either: menu, discount or combo
    public $type;
    public function mount(Request $r, $type, $id)
    {
        $item = null;
        if($type == 'menu')
            $item = Menu::with([
                'category', 
                'extras', 
                'extras.prices', 
                'preferences', 
                'ingridients', 
                'ingridients.allergens' ,
                'portions', 
                'portions.prices'
            ])->whereId($id)->first();
        else if($type == 'discount')
            $item = Discount::with(
                'menu', 
                'menu.portions',
                'menu.category',
                'menu.translations', 
                'menu.translations.language', 
                'menu.translations.language.countries', 
                'portions', 
                'portion'
            )->whereId($id)->first();
        else if($type == 'combo')
            $item = Combo::with((new Combo)->relations)->whereId($id)->first();

        if(!$item)
            return abort(403);

        $record = Code::with('table')->where('code', $r->code)->first();
        if(!$record)
            return abort(403);
        
        $table = $record->table;
        if(!$table) 
            return abort(403);
        $company = $table->company;
        if(!$company)
            return abort(403);

        $creator = $company->creator;
        if(!$creator)
            return abort(403);

        $license = $company->license;
        if(!$license)
            return abort(403);


        $this->item = $item;
        $this->code= $r->code;
        $this->company = $company;
        $this->page = 'details';
        $this->type = $r->type;
    }

    public function render(Request $r)
    {
        $view = 'livewire.details-page';
        if($r->type == 'menu')
            $view = 'livewire.details-page';

        $data = [
            'code'      => $r->code,
            'item'      => $this->item,
            'page'      => $this->page,
            'company'   => $this->company,
            'type'      => $this->type
        ];

        // dd($data);
        return view($view)
            ->layout('layouts.frontapp', $data)
            ->with($data);
    }
}