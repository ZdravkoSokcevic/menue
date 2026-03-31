<?php
namespace App\Interfaces;
use Illuminate\Support\Collection;
use App\Models\Allergen;
use Illuminate\Http\Request;

interface AllergensRepositoryInterface 
{
    public function all(Request $r): Collection;
    public function store(Array $data): Allergen | null;
    public function edit($id, Array $data): Allergen | bool;
    public function delete($id): bool | null;

}