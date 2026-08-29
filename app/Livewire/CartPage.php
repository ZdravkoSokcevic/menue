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
        // dd($r->code);
        // dd('here');
        $data = [
            'page' => 'cart',
            'code' => $r->code
        ];
        
        return view('livewire.cart-page')
            ->layout('layouts.frontapp')
            ->with($data);
    }
}
?>