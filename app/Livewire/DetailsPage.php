<?php

namespace App\Livewire;

use Illuminate\Http\Request;
use Livewire\Component;

class DetailsPage extends Component
{
    public $page;
    public $code;
    public function mount($page, Request $r)
    {
        $this->page = $page;
        $this->code= $r->code;
    }

    // public function render()
    // {
    //     dd('here');
    //     return view('livewire.details-page')
    //         ->([ 'page' => $this->page ]);
    // }
}