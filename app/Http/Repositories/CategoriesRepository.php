<?php
namespace App\Http\Repositories;

use App\Interfaces\CategoriesRepositoryInterface;
use App\Models\Categories;
use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoriesRepository implements CategoriesRepositoryInterface
{
    private Category $category;
    public function __construct()
    {
        $this->category = new Category();
    }
    public function all(): Collection
    {
        return $this->category->all();
    }
    public function store(Array $data)
    {
        $this->category->fill($data);
        $this->category->save();
        return $this->category;
    }
    public function edit($id, Array $data): bool
    {
        $row = $this->category->find($id);
        if($row)
            return $row->update($data);
        return false;
    }
    public function delete($id): bool | null
    {
        return $this->category->find($id)->delete();
    }
}

?>