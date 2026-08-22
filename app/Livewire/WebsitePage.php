<?php

namespace App\Livewire;
use Livewire\Component;

class WebsitePage extends Component
{
    public function mount()
    {
    }

    public function render()
    {
        // dd('here');
        return view('livewire.homepage')
            ->layout('layouts.website', [
                
            ])
            ->with([]);
    }
}

?>