<?php
namespace App\Http\Repositories;

use App\Interfaces\DiscountsRepositoryInterface;
use App\Models\Discount;
use Illuminate\Http\Request;

class DiscountsRepository implements DiscountsRepositoryInterface
{
    private Discount $discount;
    public function __construct()
    {
        $this->discount = new Discount();
    }
    public function all(Request $r)
    {
        $isAdmin = auth('sanctum')->user()->isAdmin();
        // allow admin and demo users to see every company list
        $isNotAdmin = auth('sanctum')->user()->isNotAdminOrDemo();
        $q = Discount::with('menu', 'menu.portions','menu.translations', 'menu.translations.language', 'menu.translations.language.countries', 'portions', 'portion');
        // TODO: if user is not superadmin, if the role is company_admin, agent, or user,
        // filter company_id
        if($isNotAdmin)
            $q->whereHas('menu', function($query)use ($r) {
                $query->where('menus.company_id', $r->input('company_id'));
            });
        else if ($r->filled('company_id')) {
            $q->whereHas('menu', function($query) use ($r) {
                $query->where('menus.company_id', $r->input('company_id'));
            });
        }

        $data = $q->get();
        return collect($data->toArray());
    }
    public function store(Array $data)
    {
        $this->discount->fill($data);
        $this->discount->save();
        return $this->discount;
    }
    public function edit($id, Array $data): Discount | bool
    {
        $row = $this->discount->find($id);
        $row->fill($data);
        if($row->save())
            return $row->fresh();
        return false;
    }
    public function delete($id): bool | null
    {
        return $this->discount->find($id)->delete();
    }
}

?>