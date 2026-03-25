<?php
namespace App\Http\Repositories;

use App\Interfaces\CategoriesRepositoryInterface;
use App\Models\Categories;
use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class CategoriesRepository implements CategoriesRepositoryInterface
{
    private Category $category;
    public function __construct()
    {
        $this->category = new Category();
    }
    public function all(Request $r): Collection
    {
			$isAdmin = auth('sanctum')->user()->isAdmin();
			// allow admin and demo users to see every company list
			$isNotAdmin = auth('sanctum')->user()->isNotAdminOrDemo();
			$q = Category::query();
			if($isNotAdmin)
				$q->where('company_id', $r->input('company_id'));
			else if ($r->filled('company_id'))
				$q->where('company_id', $r->input('company_id'));
			return $q->get();
    }
    public function store(Array $data)
    {
        $this->category->fill($data);
        $this->category->save();
        return $this->category;
    }
    public function edit($id, Array $data): Category | bool
    {
        $row = $this->category->find($id);
        $row->fill($data);
        if($row->save())
            return $row->fresh();
        return false;
    }
    public function delete($id): bool | null
    {
        return $this->category->find($id)->delete();
    }
}

?>