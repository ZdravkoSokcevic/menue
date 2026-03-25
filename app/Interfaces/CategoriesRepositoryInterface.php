<?php
namespace App\Interfaces;

use Illuminate\Database\Eloquent\Collection;
use App\Models\Category;
use Illuminate\Http\Request;

interface CategoriesRepositoryInterface
{
    public function all(Request $r): Collection;
    public function store(Array $data);
    public function edit($id, Array $data): Category | bool;
    public function delete($id): bool | null;
}

?>