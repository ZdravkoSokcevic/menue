<?php
namespace App\Livewire;

use App\Models\Code;
use App\Models\Menu;
use Illuminate\Http\Request;
use Livewire\Attributes\Layout;
use Livewire\Component;
#[Layout('layouts.app')]
class CartPage extends Component
{
    public function render(Request $r)
    {
        // dd('here');
        return view('livewire.cart-page')
            ->layout('layouts.app', [])
            ->with([]);
    }
}
?>