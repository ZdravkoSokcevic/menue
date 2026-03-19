@extends('layouts.app')

@section('nav')
    <!-- NAVBAR -->
    <div class="navbar">
        <div class="logo">MyStore</div>
        <div class="menu-toggle" onclick="toggleMenu()">☰</div>
        <div class="nav-links" id="navLinks">
        <a href="/shorts/{{  $code }}" wire:navigate>Home</a>
        <a href="/details/2?code={{ @$code }}" wire:navigate>Details</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
        </div>
    </div>
@endsection

@section('content')
    This is page {{ $page }}
@endsection