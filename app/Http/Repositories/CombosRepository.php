<?php
namespace App\Http\Repositories;

use App\Interfaces\CombosRepositoryInterface;
use App\Models\Combo;
use App\Models\ComboItem;
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
        $companyId = request()->input('company_id');
        // allow admin and demo users to see every company list
        $isNotAdmin = auth('sanctum')->user()->isNotAdminOrDemo();
        $q = Combo::with([
            'price',
            'items',
            'items.menu', 
            'items.menu.portions', 
            'items.menu.translations', 
            'items.menu.translations.language', 
            'items.menu.translations.language.countries', 
            'items.portion',
            'items.portion.prices',
        ])
        ->whereHas('items.menu', function($q) use ($companyId) {
            $q->where('company_id', $companyId);
        });
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
        $data['name'] = 'Combo';
        $this->combo->fill($data);
        $this->combo->save();
        return $this->combo;
    }

    public function storeItems(Request $r)
    {
        $itemsData = [];
        foreach($r->input('items') as $item) 
        {
            $itemsData[] = [
                'combo_id'  => $r->input('combo_id'),
                'menu_id'   => $item['menu_id'],
                'portion_id'=> $item['portion_id'],
                'quantity'  => $r->input('quantity')
            ];
        }

        $success = ComboItem::insert($itemsData);
    }

    public function edit($id, Array $data): Combo | bool
    {
        $row = $this->combo->find($id);
        $row->fill($data);
        if($row->save())
            return $row->fresh();
        return false;
    }

    public function editItems($id, $r)
    {
        $deleted = ComboItem::where('combo_id', $r->input('combo_id'))->delete();
        $this->storeItems($r);
    }

    public function delete($id): bool | null
    {
        return $this->combo->find($id)->delete();
    }
}

?>