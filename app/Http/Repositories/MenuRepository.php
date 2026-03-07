<?php

namespace App\Http\Repositories;

use App\Models\Menu;
use Illuminate\Database\Eloquent\Collection;
use App\Interfaces\MenuRepositoryInterface;

class MenuRepository implements MenuRepositoryInterface
{
    private Menu $menu;
    public function __construct()
    {
        $this->menu = new Menu();
    }
    public function all(): Collection
    {
        return $this->menu->all();
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