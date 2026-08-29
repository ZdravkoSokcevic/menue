<?php
namespace App\Http\Repositories;

use App\Models\Allergen;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use App\Interfaces\AllergensRepositoryInterface;

class AllergensRepository implements AllergensRepositoryInterface
{
    private Allergen $allergen;

    public function __construct()
    {
        $this->allergen = new Allergen();
    }
    public function all(Request $r)
    {
        $user = $r->user();
        // allow admin and demo users to see allergens
        $isAdmin = $user->isAdmin();
        $q = Allergen::with('translations', 'translations.language');
        // company_id must be provided if not admin
        $data = $q->filterCompanyIfNeeded();
        return $data->get();
    }
    public function store(Array $data): Allergen | null
    {
        $this->allergen->fill($data);
        $this->allergen->save();
        return $this->allergen;
    }
    public function edit($id, Array $data): Allergen | bool
    {
        $row = $this->allergen->find($id);
        $row->fill($data);
        if($row->save())
            return $row->fresh();
        else return false;
    }
    public function delete($id): bool | null
    {
        return $this->allergen->find($id)->delete();
    }
}