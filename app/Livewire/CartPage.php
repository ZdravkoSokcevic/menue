<?php
namespace App\Livewire;

use App\Models\Code;
use App\Models\Menu;
use Illuminate\Http\Request;
use Livewire\Attributes\Layout;
use Livewire\Component;
#[Layout('layouts.frontapp')]
class CartPage extends Component
{
    public $code;
    public $page;

    public function mount(Request $r) {
        // $this->code = $r->code;
        // $this->page = 'cart';
    }
    public function render(Request $r)
    {
        $code = $r->code;

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
        // dd('here');
        $data = [
            'page' => 'cart',
            'code' => $r->code,
            'company' => $company
        ];
        
        return view('livewire.cart-page')
            ->layout('layouts.frontapp')
            ->with($data);
    }
}
?>