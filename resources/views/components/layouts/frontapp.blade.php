<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menue</title>
    @vite([
        'resources/sass/frontapp/tailwind.css',
        'resources/sass/frontapp/app.scss'
    ])
    @yield('styles')
    @stack('scripts')
</head>
<body>


    <!-- Navbar content -->
    <div id="app-navbar" wire:ignore wire:key="svelte-navbar-unique"></div>
    
    <!-- @yield('content') -->
    {{ $slot }}
    <!-- @yield('nav') -->


    @vite(['resources/js/svelte/App.js'])

</body>
</html>