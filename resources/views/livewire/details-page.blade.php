@extends('layouts.app')

@section('nav')
    @include('components.navbar', [ 'code' => $code ])
@endsection

@section('content')
    This is page {{ $page }}
@endsection