<?php

namespace App\Livewire;

use Illuminate\Http\Request;
use Livewire\Attributes\Layout;
use Livewire\Component;
#[Layout('layouts.app')]
class DetailsPage extends Component
{
    public $page;
    public $code;
    public function mount(Request $r)
    {
        $item = $r->item;
        $this->item = $item;
        $this->code= $r->code;
    }

    public function render(Request $r)
    {

        $data = [
            'code' => $r->code,
            'page' => $this->page
        ];
        // dd('here');
        return view('livewire.details-page')
            ->layout('layouts.app', $data)
            ->with($data);
    }
}