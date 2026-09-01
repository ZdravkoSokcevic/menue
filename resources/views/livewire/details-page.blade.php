<div>
    @push('scripts')
        @vite([
            'resources/sass/frontapp/details.scss'
        ])
        <script>
            window.LaravelData = {
                code: "{{ $code }}",
                item: "{{ $item }}",
                page: "{{ $page }}",
                company: @json($company)
            };
        </script>
    @endpush

    <script id="menuitem-data"  type="application/ld+json">
        {!! json_encode($item) !!}
    </script>
    
    <div id="app-navbar" wire:ignore wire:key="svelte-navbar-unique"></div>

    <div id="menu-details" wire:ignore></div>
    <div id="lang-chooser" class="language-list-container"></div>   
</div>