@extends('app')

@section('styles')
    @vite([
        'resources/sass/homepage/home.scss'
    ])
    <script id="menu-data">
        {!! json_encode($menuItems) !!}
    </script>
@endsection

@section('nav')

    @include('components.navbar', [ 'code' => $code ])
@endsection
@section('content')
    <div class="container">
        <h1>Menu</h1>


    </div>

    <div 
        class="menuitems-component" 
        id="menuitems-component"
    ></div>

        <!-- </div> -->

        @vite(['resources/js/homepage.js'], ['data-navigate-track' => true])
        <!-- 
        <div class="categories">
            <button class="cat-btn active" onclick="filterItems('all', this)">All</button>
            <button class="cat-btn" onclick="filterItems('food', this)">Food</button>
            <button class="cat-btn" onclick="filterItems('drinks', this)">Drinks</button>
        </div>

        <div class="grid">

            <div class="card">
                <img src="https://picsum.photos/300/200?1" alt="Item">
                <div class="card-content">
                    <div class="card-title">Burger</div>
                    <div class="card-desc">Juicy grilled burger with cheese.</div>
                    <div class="card-footer">
                        <span class="price">$8.99</span>
                        <button class="btn">Add</button>
                    </div>
                </div>
            </div>

        </div> -->
    {{ $menuItems }}
@endsection