<!DOCTYPE html>
<html>
<head>
    {{-- SEO IS MISSING HERE --}}
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title></title>
    {{-- <script type="module" src="{{ asset('/public/js/components/App.jsx') }}" async defer></script> --}}
    @viteReactRefresh
    @vite('resources/js/app.js')
</head>
<body>
    <div id="root"></div>
</body>
</html>