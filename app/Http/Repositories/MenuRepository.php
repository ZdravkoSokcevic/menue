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

    public function edit($id, array $data): bool
    {
        $row = $this->menu->find($id);
        if($row)
            return $row->update($data);
        return false;
    }

    public function delete($id): bool|null
    {
        return $this->menu->find($id)->delete();
    }
}

?>