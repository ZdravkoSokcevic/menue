<?php
namespace App\Interfaces;

use App\Models\Combo;
use Illuminate\Http\Request;

interface CombosRepositoryInterface
{
    public function all(Request $r);
    public function store(Array $data);
    public function edit($id, Array $data): Combo | bool;
    public function delete($id): bool | null;
}

?>