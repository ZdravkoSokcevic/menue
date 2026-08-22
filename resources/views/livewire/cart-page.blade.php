<div>
    @push('scripts')
        @vite([
            'resources/sass/frontapp/cart.scss'
        ])
        <script>
            window.LaravelData = {
                code: "{{ $code }}",
                page: "{{ $page }}"
            };
        </script>
    @endpush
    
    <div id="app-navbar" wire:ignore wire:key="svelte-navbar-unique"></div>

    <div id="cart-details" wire:ignore></div>  
    <div id="lang-chooser" class="language-list-container"></div> 
</div>