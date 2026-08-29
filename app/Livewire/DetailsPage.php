<?php

namespace App\Livewire;

use App\Models\Code;
use App\Models\Menu;
use Illuminate\Http\Request;
use Livewire\Attributes\Layout;
use Livewire\Component;
#[Layout('layouts.frontapp')]
class DetailsPage extends Component
{
    public $item;
    public $code;

    public $page;
    public function mount(Request $r, $id)
    {
        $item = Menu::with(['category', 'extras', 'extras.prices', 'preferences', 'ingridients', 'ingridients.allergens' ,'portions', 'portions.prices'])->whereId($id)->first();
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
        $this->page = 'details';
    }

    public function render(Request $r)
    {

        $data = [
            'code' => $r->code,
            'item' => $this->item,
            'page' => $this->page
        ];
        return view('livewire.details-page')
            ->layout('layouts.frontapp', $data)
            ->with($data);
    }
}