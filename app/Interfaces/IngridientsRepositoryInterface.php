<?php
namespace App\Interfaces;
use Illuminate\Support\Collection;
use App\Models\Ingridient;
use Illuminate\Http\Request;

interface IngridientsRepositoryInterface 
{
    public function all(Request $r): Collection;
    public function store(Array $data): Ingridient | bool;
    public function edit($id, Array $data): Ingridient | bool;
    public function delete($id): bool | null;
    
}