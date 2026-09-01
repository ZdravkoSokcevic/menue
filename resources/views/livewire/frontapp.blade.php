<div>
    @push('scripts')
    @vite([
        'resources/sass/frontapp/home.scss',
        'resources/sass/frontapp/footer.scss',
    ])
    <script>
        window.LaravelData = {
            code: "{{ $code }}",
            page: "{{ $page }}",
            company: @json($company)
        };
    </script>
    @endpush


    <div class="app-layout">

        <h1 class="text-center text-3xl font-bold my-6 text-gray-800">
            {{$company->name}}
        </h1>
        <script id="menu-data" type="application/ld+json">
            {!! json_encode($menuItems) !!}
        </script>
        <div class="main-content" id="menuitems-component" wire:ignore></div>

        <div id="lang-chooser" class="language-list-container"></div> 
        @include('components.footer', ['company' => $company])
    </div>
</div>