<?php

namespace App\Http\Controllers;

use App\Http\Requests\MenuCreateRequest;
use App\Http\Requests\MenuEditRequest;
use App\Http\Responses\CreateResponse;
use App\Http\Responses\EditResponse;
use App\Models\Menu;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use MenuRepository;
use MenuRepositoryInterface;
use Response;

class MenuController extends Controller
{
    protected MenuRepository $menuRepository;

    public function __construct(MenuRepositoryInterface $me)
    {
        $this->menuRepository = $me;
    }

    /**
     * /
     * @return Collection
     *  Needs to be changed to return tables only for company
     */
    public function get(): Collection
    {
        return $this->menuRepository->all();
    }

    public function insert(MenuCreateRequest $r): CreateResponse
    {
        $data = Menu::getFillable();
        $success = $this->menuRepository->store($data);
        if($success)
            return new CreateResponse(true, 'Created successfully!');
        else return new CreateResponse(false, 'Could not create Menu!');
    }

    public function edit($id, MenuEditRequest $r): EditResponse
    {
        $data = $r->only(Menu::getFillableFields());
        $menu = Menu::find($id);
        if(!$menu)
            return new EditResponse(success: false, custom_message: 'Company not found!');
        else {
            $success = $this->menuRepository->edit($id, $data);
            if($success)
                return new EditResponse(true);
            else return new EditResponse(false, 'Could not edit menu!');
        }
    }

    public function delete($id)
    {
        $success = $this->menuRepository->delete($id);
        if($success)
            return Response::json([ 'message'=> 'success' ]);
        else return Response::json([ 'message'=> 'Failed to delete resource' ], 404);
    }
}
