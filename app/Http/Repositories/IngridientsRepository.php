<?php
namespace App\Http\Repositories;
use App\Models\Ingridient;
use Illuminate\Database\Eloquent\Collection;
use App\Interfaces\IngridientsRepositoryInterface;
use \Illuminate\Http\Request;

class IngridientsRepository implements IngridientsRepositoryInterface
{
    private Ingridient $ingridient;

    public function __construct()
    {
        $this->ingridient = new Ingridient();
    }
    public function all(Request $r): Collection
    {
        $q = Ingridient::with('allergens');
        return $q->get();
    }
    public function store(Array $data): Ingridient | bool
    {
        $this->ingridient->fill($data);
        $this->ingridient->save();
        return $this->ingridient->fresh();
    }
    public function edit($id, Array $data): Ingridient | bool
    {
        $row = $this->ingridient->find($id);
        $row->fill($data);
        if($row->save())
            return $row->fresh()->load('allergens');
        else return false;
    }
    public function delete($id): bool | null
    {
        return $this->ingridient->find($id)->delete();
    }
}