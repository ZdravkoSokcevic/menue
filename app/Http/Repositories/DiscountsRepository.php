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
        $user = $r->user();
        $isAdmin = $user->isAdmin();
        // allow admin and demo users to see every company list
        $isNotAdmin = $user->isNotAdminOrDemo();
        $q = Discount::with(
            'menu', 
            'menu.portions',
            'menu.translations', 
            'menu.translations.language', 
            'menu.translations.language.countries', 
            'portions', 
            'portion'
        );
        // TODO: if user is not superadmin, if the role is company_admin, agent, or user,
        // filter company_id
        if($isNotAdmin)
            $q->whereHas('menu', function($query)use ($r, $user) {
                $query->where('menus.company_id', $user->getActiveCompanyId());
            });
        else if ($user->getActiveCompanyId()) {
            $q->whereHas('menu', function($query) use ($r, $user) {
                $query->where('menus.company_id', $user->getActiveCompanyId());
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