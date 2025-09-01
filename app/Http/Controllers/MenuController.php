<?php

namespace App\Http\Controllers;

use App\Http\Requests\MenuCreateRequest;
use App\Http\Requests\MenuEditRequest;
use Illuminate\Http\Request;
use MenuRepository;
use MenuRepositoryInterface;

class MenuController extends Controller
{
    protected MenuRepository $menuRepository;

    public function __construct(MenuRepositoryInterface $me): void
    {
        $this->menuRepository = $me;
    }

    public function get(): Collection
    {
        return $this->menuRepository->getTables();
    }

    public function insert(MenuCreateRequest $r): Menu | bool
    {

    }

    public function edit($id, MenuEditRequest $r): Menu | bool
    {

    }

    public function delete($id)
    {
        return $this->menuRepository->delete($id);
    }
}
