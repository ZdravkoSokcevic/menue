<div>
    @include('components.navbar', [ 'code' => $code ])
    
    <div id="app-navbar" wire:ignore wire:key="svelte-navbar-unique"></div>
    This is page {{ $page }}
</div>