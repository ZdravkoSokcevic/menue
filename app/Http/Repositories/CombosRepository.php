<?php
namespace App\Http\Repositories;

use App\Interfaces\CombosRepositoryInterface;
use App\Models\Combo;
use Illuminate\Http\Request;

class CombosRepository implements CombosRepositoryInterface
{
    private Combo $combo;
    public function __construct()
    {
        $this->combo = new Combo();
    }
    public function all(Request $r)
    {
        $isAdmin = auth('sanctum')->user()->isAdmin();
        // allow admin and demo users to see every company list
        $isNotAdmin = auth('sanctum')->user()->isNotAdminOrDemo();
        $q = Combo::with([
            'items',
            'items.menu', 
            'items.menu.portions', 
            'items.menu.translations', 
            'items.menu.translations.language', 
            'items.menu.translations.language.countries', 
            'items.portions'
        ]);
        // TODO: if user is not superadmin, if the role is company_admin, agent, or user,
        // filter company_id
        // if($isNotAdmin)
        //     $q->whereHas('items.menu', function($query)use ($r) {
        //         $query->where('items.menus.company_id', $r->input('company_id'));
        //     });
        // else if ($r->filled('company_id')) {
        //     $q->whereHas('items.menu', function($query) use ($r) {
        //         $query->where('items.menus.company_id', $r->input('company_id'));
        //     });
        // }

        $data = $q->get();
        return collect($data->toArray());
    }
    public function store(Array $data)
    {
        $this->combo->fill($data);
        $this->combo->save();
        return $this->combo;
    }
    public function edit($id, Array $data): Combo | bool
    {
        $row = $this->combo->find($id);
        $row->fill($data);
        if($row->save())
            return $row->fresh();
        return false;
    }
    public function delete($id): bool | null
    {
        return $this->combo->find($id)->delete();
    }
}

?>