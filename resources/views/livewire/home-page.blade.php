<div>
    @push('scripts')
    @vite([
        'resources/sass/homepage/home.scss'
    ])
    <script>
        window.LaravelData = {
            code: "{{ $code }}"
        };
    </script>
    @endpush


    <div>

        <div class="container">
            <h1>Menu</h1> 
        </div>
        <script id="menu-data" type="application/ld+json">
            {!! json_encode($menuItems) !!}
        </script>
        <div id="menuitems-component" wire:ignore></div>

    </div>
</div>