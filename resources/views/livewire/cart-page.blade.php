<div>
    @push('scripts')
        @vite([
            'resources/sass/homepage/cart.scss'
        ])
    @endpush
    
    <div id="app-navbar" wire:ignore wire:key="svelte-navbar-unique"></div>

    <div id="cart-details" wire:ignore></div>   
</div>