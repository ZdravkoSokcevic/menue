<?php

namespace App\Http\Repositories;

use App\Models\Menu;
use Illuminate\Database\Eloquent\Collection;
use App\Interfaces\MenuRepositoryInterface;
use Illuminate\Http\Request;

class MenuRepository implements MenuRepositoryInterface
{
    private Menu $menu;
    public function __construct()
    {
        $this->menu = new Menu();
    }
    public function all(Request $r)
    {
        $isAdmin = auth('sanctum')->user()->isAdmin();
        // allow admin and demo users to see every company list
        $isNotAdmin = auth('sanctum')->user()->isNotAdminOrDemo();
        $q = Menu::with([
            'ingridients', 
            'extras', 
            'extras.prices', 
            'portions', 
            'portions.prices', 
            'preferences',
            'translations',
            'translations.language.countries',
            'name_translations.language',
            'name_translations.language.countries',
        ]);
        if($isNotAdmin)
            $q->where('company_id', $r->input('company_id'));
        else if ($r->filled('company_id'))
            $q->where('company_id', $r->input('company_id'));

        $q->with('translations.language', function($q) {
            // filter language
            // $q->where('code', 'deu');
        });

        $q->whereHas('portions');

        $data = $q->get();
        return collect($data->toArray());
    }

    public function store(array $data): array|Menu
    {
        $this->menu->fill($data);
        $this->menu->save();
        return $this->menu;
    }

    public function edit($id, array $data): bool | Menu
    {
        $row = $this->menu->find($id);
        $row->fill($data);
        if($row->save())
            return $row->fresh();
        return false;
    }

    public function delete($id): bool|null
    {
        $menu = $this->menu->find($id);
        return !is_null($menu) ? $menu->delete() : false;
    }
}

?>